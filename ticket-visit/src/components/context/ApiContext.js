import React, { useContext, useRef, useState } from "react";

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
	const cache = useRef({});
	const [, setLoading] = useState(false);
	const NotifyUser = useContext(NotifyUserContext);

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
			const processError = (response) => {
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

			apiEngine(tUrl)
				.then((response) => {
					setLoading(false);
					if (response.ok) {
						const contentType = response.headers.get("content-type");
						if (contentType && contentType.indexOf("application/json") > -1) {
							response.json().then((data) => {
								doResolve(data, response);
							});
						} else {
							response.text().then((text) => {
								doResolve(text, response);
							});
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

	const refreshAndRequest = (method, url, data, config) =>
		new Promise((resolve, reject) => {
			request(method, url, data, config)
				.then((data) => {
					resolve(data);
				})
				.catch((data) => {
					reject(data);
				});
		});

	const API = {
		Get: (url, config) => refreshAndRequest("GET", url, undefined, config),
	};

	return <ApiContext.Provider value={API}>{children}</ApiContext.Provider>;
};
