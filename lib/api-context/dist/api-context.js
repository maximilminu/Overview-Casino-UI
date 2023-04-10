"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ApiProvider = exports.ApiContext = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactUseLocalstorage = require("react-use-localstorage");

var _reactUseLocalstorage2 = _interopRequireDefault(_reactUseLocalstorage);

var _reactCookie = require("react-cookie");

var _notifyUserContext = require("@oc/notify-user-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiEngine = function apiEngine(resource) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	return new Promise(function (resolve, reject) {
		var _options$timeout = options.timeout,
		    timeout = _options$timeout === undefined ? process.env.REACT_APP_API_TIMEOUT || 30000 : _options$timeout;

		options.headers = options.headers || {};
		if (!!!options.headers["X-Api-Key"]) {
			options.headers["X-Api-Key"] = process.env.REACT_APP_API_KEY;
		}

		var controller = new AbortController();
		var id = setTimeout(function () {
			return controller.abort();
		}, timeout);
		fetch(resource, Object.assign({}, options, {
			signal: controller.signal
		})).then(resolve).catch(reject).finally(function () {
			clearTimeout(id);
		});
	});
};

var ApiContext = exports.ApiContext = _react2.default.createContext({});

var ApiProvider = exports.ApiProvider = function ApiProvider(_ref) {
	var children = _ref.children;

	var _useState = (0, _react.useState)(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    Loading = _useState2[0],
	    setLoading = _useState2[1];

	var _useCookies = (0, _reactCookie.useCookies)("OC_Session_ID"),
	    _useCookies2 = _slicedToArray(_useCookies, 1),
	    CookieSessionID = _useCookies2[0];

	var _useLocalStorage = (0, _reactUseLocalstorage2.default)("AccessToken"),
	    _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
	    AccessToken = _useLocalStorage2[0],
	    setAccessToken = _useLocalStorage2[1];

	var _useLocalStorage3 = (0, _reactUseLocalstorage2.default)("ExpiresAt"),
	    _useLocalStorage4 = _slicedToArray(_useLocalStorage3, 2),
	    TokenExpiresAt = _useLocalStorage4[0],
	    setTokenExpiresAt = _useLocalStorage4[1];

	var _useLocalStorage5 = (0, _reactUseLocalstorage2.default)("TokenType"),
	    _useLocalStorage6 = _slicedToArray(_useLocalStorage5, 2),
	    TokenType = _useLocalStorage6[0],
	    setTokenType = _useLocalStorage6[1];

	var _useLocalStorage7 = (0, _reactUseLocalstorage2.default)("RefreshToken"),
	    _useLocalStorage8 = _slicedToArray(_useLocalStorage7, 2),
	    RefreshToken = _useLocalStorage8[0],
	    setRefreshToken = _useLocalStorage8[1];

	var _useLocalStorage9 = (0, _reactUseLocalstorage2.default)("SessionID"),
	    _useLocalStorage10 = _slicedToArray(_useLocalStorage9, 2),
	    SessionID = _useLocalStorage10[0],
	    setSessionID = _useLocalStorage10[1];

	var cache = (0, _react.useRef)({});
	var NotifyUser = (0, _react.useContext)(_notifyUserContext.NotifyUserContext);

	var updateAuthData = function updateAuthData() {
		if (AccessToken === "") {
			forceLogin();
		} else {
			if (CookieSessionID === "") {
				if (SessionID === "") {
					API.Get("/session/v1/id").then(function (sid) {
						console.debug("New SessionID saved:", sid);
						setSessionID(sid);
					});
				}
			} else {
				if (SessionID === "") {
					console.debug("sessionID from cookie:", CookieSessionID.CXM_Session_ID);
					setSessionID(CookieSessionID.CXM_Session_ID);
				}
			}
		}
	};

	var forceLogin = function forceLogin() {
		console.log("ApiContext forceLogin");
		setAccessToken("");
		setTokenExpiresAt(0);
		setRefreshToken("");
		setTokenType("");

		document.location.href = "/sign-in";
	};

	var request = function request(method, url, data) {
		var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		return new Promise(function (resolve, reject) {
			console.debug("ApiContext request", method, url, data, config);
			var cacheKey = "" + method + url;
			var doResolve = function doResolve(data, response) {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].forEach(function (resRej) {
						resRej.resolve({ data: data, response: response });
					});
					delete cache.current[cacheKey];
				} else {
					resolve({ data: data, response: response });
				}
			};
			var doReject = function doReject(response) {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].forEach(function (resRej) {
						resRej.reject({ response: response });
					});
					delete cache.current[cacheKey];
				} else {
					reject({ response: response });
				}
			};
			if (data === undefined) {
				if (cache.current[cacheKey]) {
					cache.current[cacheKey].push({ resolve: resolve, reject: reject });
					return;
				}
				cache.current[cacheKey] = [{ resolve: resolve, reject: reject }];
			}

			var refreshingToken = config.refreshingToken;
			if (config.refreshingToken !== undefined) {
				delete config[refreshingToken];
			}

			var processError = function processError(response) {
				if (refreshingToken) {
					forceLogin();
				}
				if (response.status) {
					console.debug("Process api error " + response.status);
					switch (response.status) {
						case 502:
							NotifyUser.Error("El servicio '" + method + " " + url + "' no esta disponible. Notifique al t\xE9cnico.");
							doReject(response);
							return;
						case 500:
							NotifyUser.Error("Problemas con el servicio '" + method + " " + url + "'. Notifique al t\xE9cnico.");
							doReject(response);
							return;
						case 424:
							NotifyUser.Error("Problemas con una dependencia del servicio '" + method + " " + url + "'. Notifique al t\xE9cnico.");
							doReject(response);
							return;
						case 403:
							NotifyUser.Warning("Estas intentando acceder a un dato para el cual no tenés permiso.");
							doReject(response);
							return;
						case 401:
							console.error("Se venció la seción o la autenticación es inválida.");
							forceLogin();
							return;
						default:
							doReject(response);
							return;
					}
				}
				if (response.code === "ECONNABORTED") {
					NotifyUser.Warning("Tiempo de espera agotado llamando a las API. Reintente en unos momentos, puede que esté lenta su red.");
					doReject(response);
					return;
				}
				console.debug("API ERROR", response);
				doReject(response);
			};

			setLoading(true);
			var tUrl = url.indexOf("/storage") !== 0 ? "/api" + url : url;
			var requestConfig = Object.assign({
				headers: {
					"X-Session-ID": SessionID,
					Authorization: TokenType + " " + AccessToken
				}
			}, {
				method: method,
				body: url.indexOf("/storage") !== 0 ? JSON.stringify(data) : data,
				responseType: url.indexOf("/storage") !== 0 ? undefined : method === "GET" ? "blob" : undefined
			}, config);

			apiEngine(tUrl, requestConfig).then(function (response) {
				setLoading(false);
				if (response.ok) {
					var contentType = response.headers.get("content-type");
					if (contentType && contentType.indexOf("application/json") > -1) {
						response.json().then(function (data) {
							doResolve(data, response);
						});
					} else {
						if (url.indexOf("/storage") > -1) {
							response.blob().then(function (blob) {
								doResolve(URL.createObjectURL(blob), response);
							});
						} else {
							response.text().then(function (text) {
								doResolve(text, response);
							});
						}
					}
				} else {
					processError(response);
				}
			}).catch(function (response) {
				setLoading(false);
				console.log(response);
				processError(response);
			});
		});
	};

	var refreshTokenIfNeeded = function refreshTokenIfNeeded() {
		return new Promise(function (resolve) {
			if (Date.now() > TokenExpiresAt) {
				console.debug("Token has expired at", new Date(TokenExpiresAt), "refreshing");
				request("put", "/api/token/v1", undefined, {
					headers: {
						Authorization: TokenType + " " + RefreshToken
					},
					refreshingToken: true
				}).catch(function (err) {
					console.debug("ERROR REFRESHING?");
					forceLogin();
				}).then(function (newToken) {
					console.debug("NEW TOKEN", newToken);
					var access_token = newToken.access_token,
					    expires_in = newToken.expires_in,
					    refresh_token = newToken.refresh_token,
					    token_type = newToken.token_type;

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
	};

	var refreshAndRequest = function refreshAndRequest(method, url, data, config) {
		return new Promise(function (resolve, reject) {
			refreshTokenIfNeeded().then(function () {
				request(method, url, data, config).then(function (data) {
					resolve(data);
				}).catch(function (data) {
					reject(data);
				});
			});
		});
	};

	var API = {
		Get: function Get(url, config) {
			return refreshAndRequest("GET", url, undefined, config);
		},
		Delete: function Delete(url, config) {
			return refreshAndRequest("DELETE", url, undefined, config);
		},
		Head: function Head(url, config) {
			return refreshAndRequest("HEAD", url, undefined, config);
		},
		Options: function Options(url, config) {
			return refreshAndRequest("OPTIONS", url, undefined, config);
		},
		Post: function Post(url, data, config) {
			return refreshAndRequest("POST", url, data, config);
		},
		Put: function Put(url, data, config) {
			return refreshAndRequest("PUT", url, data, config);
		},
		Patch: function Patch(url, data, config) {
			return refreshAndRequest("PATCH", url, data, config);
		},
		Loading: Loading,
		setLoading: setLoading,
		AccessToken: AccessToken,
		SessionID: SessionID,
		Logout: forceLogin,
		Fetch: apiEngine
	};

	(0, _react.useLayoutEffect)(function () {
		updateAuthData();
		// eslint-disable-next-line
	}, []);

	return _react2.default.createElement(
		ApiContext.Provider,
		{ value: API },
		!SessionID ? "Obteniendo ID de sesión" : !AccessToken ? "Obteniendo Token de sesión" : children
	);
};