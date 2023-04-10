import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { useCookies } from "react-cookie";
import { NotifyUserContext } from "@oc/notify-user-context";

const apiEngine = (resource, options = {}) =>
	new Promise((resolve, reject) => {
		const { timeout = process.env.REACT_APP_API_TIMEOUT || 30000 } = options;
		options.headers = options.headers || {};
		if (!!!options.headers["X-Api-Key"]) {
			options.headers["X-Api-Key"] = process.env.REACT_APP_API_KEY;
		}

		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);
		fetch(
			resource,
			Object.assign({}, options, {
				signal: controller.signal,
			})
		)
			.then(resolve)
			.catch(reject)
			.finally(() => {
				clearTimeout(id);
			});
	});

export const ApiContext = React.createContext({});

export const ApiProvider = ({ children }) => {
	const [Loading, setLoading] = useState(false);
	const [CookieSessionID] = useCookies("OC_Session_ID");
	const [AccessToken, setAccessToken] = useLocalStorage("AccessToken");
	const [TokenExpiresAt, setTokenExpiresAt] = useLocalStorage("ExpiresAt");
	const [TokenType, setTokenType] = useLocalStorage("TokenType");
	const [RefreshToken, setRefreshToken] = useLocalStorage("RefreshToken");
	const [SessionID, setSessionID] = useLocalStorage("SessionID");
	const cache = useRef({});
	const NotifyUser = useContext(NotifyUserContext);

	const updateAuthData = () => {
		if (AccessToken === "") {
			forceLogin();
		} else {
			if (CookieSessionID === "") {
				if (SessionID === "") {
					API.Get("/session/v1/id").then((sid) => {
						console.debug("New SessionID saved:", sid);
						setSessionID(sid);
					});
				}
			} else {
				if (SessionID === "") {
					console.debug(
						"sessionID from cookie:",
						CookieSessionID.CXM_Session_ID
					);
					setSessionID(CookieSessionID.CXM_Session_ID);
				}
			}
		}
	};

	const forceLogin = () => {
		console.log("ApiContext forceLogin");
		setAccessToken("");
		setTokenExpiresAt(0);
		setRefreshToken("");
		setTokenType("");

		document.location.href = "/sign-in";
	};

	const request = (method, url, data, config = {}) =>
		new Promise((resolve, reject) => {
			console.debug("ApiContext request", method, url, data, config);
			const cacheKey = `${method}${url}`;
			const doResolve = (data, response) => {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].forEach((resRej) => {
						resRej.resolve({ data, response });
					});
					delete cache.current[cacheKey];
				} else {
					resolve({ data, response });
				}
			};
			const doReject = (response) => {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].forEach((resRej) => {
						resRej.reject({ response });
					});
					delete cache.current[cacheKey];
				} else {
					reject({ response });
				}
			};
			if (data === undefined) {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].push({ resolve, reject });
					return;
				}
				cache.current[cacheKey] = [{ resolve, reject }];
			}

			const refreshingToken = config.refreshingToken;
			if (config.refreshingToken !== undefined) {
				delete config[refreshingToken];
			}

			const processError = (response) => {
				if (refreshingToken) {
					forceLogin();
				}
				if (response.status) {
					console.debug("Process api error " + response.status);
					switch (response.status) {
						case 502:
							NotifyUser.Error(
								`El servicio '${method} ${url}' no esta disponible. Notifique al técnico.`
							);
							doReject(response);
							return;
						case 500:
							NotifyUser.Error(
								`Problemas con el servicio '${method} ${url}'. Notifique al técnico.`
							);
							doReject(response);
							return;
						case 424:
							NotifyUser.Error(
								`Problemas con una dependencia del servicio '${method} ${url}'. Notifique al técnico.`
							);
							doReject(response);
							return;
						case 403:
							NotifyUser.Warning(
								"Estas intentando acceder a un dato para el cual no tenés permiso."
							);
							doReject(response);
							return;
						case 401:
							console.error(
								"Se venció la seción o la autenticación es inválida."
							);
							forceLogin();
							return;
						default:
							doReject(response);
							return;
					}
				}
				if (response.code === "ECONNABORTED") {
					NotifyUser.Warning(
						"Tiempo de espera agotado llamando a las API. Reintente en unos momentos, puede que esté lenta su red."
					);
					doReject(response);
					return;
				}
				console.debug("API ERROR", response);
				doReject(response);
			};

			setLoading(true);
			const tUrl = url.indexOf("/storage") !== 0 ? `/api${url}` : url;
			const requestConfig = Object.assign(
				{
					headers: {
						"X-Session-ID": SessionID,
						Authorization: `${TokenType} ${AccessToken}`,
					},
				},

				{
					method,
					body: url.indexOf("/storage") !== 0 ? JSON.stringify(data) : data,
					responseType:
						url.indexOf("/storage") !== 0
							? undefined
							: method === "GET"
							? "blob"
							: undefined,
				},
				config
			);

			apiEngine(tUrl, requestConfig)
				.then((response) => {
					setLoading(false);
					if (response.ok) {
						const contentType = response.headers.get("content-type");
						if (contentType && contentType.indexOf("application/json") > -1) {
							response.json().then((data) => {
								doResolve(data, response);
							});
						} else {
							if (url.indexOf("/storage") > -1) {
								response.blob().then((blob) => {
									doResolve(URL.createObjectURL(blob), response);
								});
							} else {
								response.text().then((text) => {
									doResolve(text, response);
								});
							}
						}
					} else {
						processError(response);
					}
				})
				.catch((response) => {
					setLoading(false);
					console.log(response);
					processError(response);
				});
		});

	const refreshTokenIfNeeded = () =>
		new Promise((resolve) => {
			if (Date.now() > TokenExpiresAt) {
				console.debug(
					"Token has expired at",
					new Date(TokenExpiresAt),
					"refreshing"
				);
				request("put", "/api/token/v1", undefined, {
					headers: {
						Authorization: `${TokenType} ${RefreshToken}`,
					},
					refreshingToken: true,
				})
					.catch((err) => {
						console.debug("ERROR REFRESHING?");
						forceLogin();
					})
					.then((newToken) => {
						console.debug("NEW TOKEN", newToken);
						const { access_token, expires_in, refresh_token, token_type } =
							newToken;
						setAccessToken(access_token);
						setTokenExpiresAt(Date.now() + (expires_in - 60) * 1000);
						setRefreshToken(refresh_token);
						setTokenType(token_type);
						updateAuthData();
						resolve();
					});
			} else {
				resolve();
			}
		});

	const refreshAndRequest = (method, url, data, config) =>
		new Promise((resolve, reject) => {
			refreshTokenIfNeeded().then(() => {
				request(method, url, data, config)
					.then((data) => {
						resolve(data);
					})
					.catch((data) => {
						reject(data);
					});
			});
		});

	const API = {
		Get: (url, config) => refreshAndRequest("GET", url, undefined, config),
		Delete: (url, config) =>
			refreshAndRequest("DELETE", url, undefined, config),
		Head: (url, config) => refreshAndRequest("HEAD", url, undefined, config),
		Options: (url, config) =>
			refreshAndRequest("OPTIONS", url, undefined, config),
		Post: (url, data, config) => refreshAndRequest("POST", url, data, config),
		Put: (url, data, config) => refreshAndRequest("PUT", url, data, config),
		Patch: (url, data, config) => refreshAndRequest("PATCH", url, data, config),
		Loading,
		setLoading,
		AccessToken,
		SessionID,
		Logout: forceLogin,
		Fetch: apiEngine,
	};

	useLayoutEffect(() => {
		updateAuthData();
		// eslint-disable-next-line
	}, []);

	return (
		<ApiContext.Provider value={API}>
			{!SessionID
				? "Obteniendo ID de sesión"
				: !AccessToken
				? "Obteniendo Token de sesión"
				: children}
		</ApiContext.Provider>
	);
};
