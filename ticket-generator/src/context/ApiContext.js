import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { useCookies } from "react-cookie";
import axios from "axios";
import { NotifyUserContext } from "./NotifyUserContext";

const apiEngine = axios.create({
  timeout: 30000,
  headers: {
    "X-Api-Key": process.env.REACT_APP_API_KEY,
  },
});

export const ApiContext = React.createContext({});

export const ApiProvider = ({ children }) => {
  const NotifyUser = useContext(NotifyUserContext);
  const [Loading, setLoading] = useState(false);
  const [CookieSessionID] = useCookies("OC_Session_ID");
  const [AccessToken, setAccessToken] = useLocalStorage("AccessToken");
  const [TokenExpiresAt, setTokenExpiresAt] = useLocalStorage("ExpiresAt");
  const [TokenType, setTokenType] = useLocalStorage("TokenType");
  const [RefreshToken, setRefreshToken] = useLocalStorage("RefreshToken");
  const [SessionID, setSessionID] = useLocalStorage("SessionID");
  const cache = useRef({});

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
    setAccessToken("");
    setTokenExpiresAt(0);
    setRefreshToken("");
    setTokenType("");
    request(
      "post",
      "/session/v1/public/AfterLoginGoTo",
      document.location.href
    ).finally(() => {
      document.location.href = "/sign-in";
    });
  };

  const request = (method, url, data, config = {}) =>
    new Promise((resolve, reject) => {
      console.debug("ApiContext request", method, url, data, config);
      const cacheKey = `${method}${url}`;
      const doResolve = (data) => {
        if (cache.current[cacheKey]) {
          cache.current[cacheKey].forEach((resRej) => {
            resRej.resolve(data);
          });
          delete cache.current[cacheKey];
        } else {
          resolve(data);
        }
      };
      const doReject = (data) => {
        if (cache.current[cacheKey]) {
          cache.current[cacheKey].forEach((resRej) => {
            resRej.reject(data);
          });
          delete cache.current[cacheKey];
        } else {
          reject(data);
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
      setLoading(true);
      const requestConfig = Object.assign(
        {
          headers: {
            "X-Session-ID": SessionID,
            Authorization: `${TokenType} ${AccessToken}`,
          },
        },
        config,
        {
          method,
          url: url.indexOf("/storage") !== 0 ? `/api${url}` : url,
          data,
          responseType: url.indexOf("/storage") !== 0 ? undefined : "blob",
        }
      );
      console.debug("Executing", JSON.stringify(requestConfig));
      apiEngine
        .request(requestConfig)
        .then((data) => {
          setLoading(false);
          if (url.indexOf("/storage") > -1) {
            doResolve(URL.createObjectURL(data.data));
          } else {
            doResolve(data.data);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (refreshingToken) {
            forceLogin();
          }
          if (err.response && err.response.status) {
            console.debug("Process api error " + err.response.status);
            switch (err.response.status) {
              case 502:
                NotifyUser.Error(
                  `El servicio '${method} ${url}' no esta disponible. Notifique al técnico.`
                );
                doReject(err);
                return;
              case 500:
                NotifyUser.Error(
                  `Problemas con el servicio '${method} ${url}'. Notifique al técnico.`
                );
                doReject(err);
                return;
              case 424:
                NotifyUser.Error(
                  `Problemas con una dependencia del servicio '${method} ${url}'. Notifique al técnico.`
                );
                doReject(err);
                return;
              case 403:
                NotifyUser.Warning(
                  "Estas intentando acceder a un dato para el cual no tenés permiso."
                );
                doReject(err);
                return;
              case 401:
                console.error(
                  "Se venció la seción o la autenticación es inválida."
                );
                forceLogin();
                return;
              default:
                doReject(err);
                return;
            }
          }
          if (err.code === "ECONNABORTED") {
            NotifyUser.Warning(
              "Tiempo de espera agotado llamando a las API. Reintente en unos momentos, puede que esté lenta su red."
            );
            doReject(err);
            return;
          }
          console.debug("API ERROR", err);
          doReject(err);
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
            // console.groupEnd();
            resolve(data);
          })
          .catch((data) => {
            // console.groupEnd();
            reject(data);
          });
      });
    });

  const API = {
    Get: (url, config) => refreshAndRequest("Get", url, undefined, config),
    Delete: (url, config) =>
      refreshAndRequest("Delete", url, undefined, config),
    Head: (url, config) => refreshAndRequest("Head", url, undefined, config),
    Options: (url, config) =>
      refreshAndRequest("Options", url, undefined, config),
    Post: (url, data, config) => refreshAndRequest("Post", url, data, config),
    Put: (url, data, config) => refreshAndRequest("Put", url, data, config),
    Patch: (url, data, config) => refreshAndRequest("Patch", url, data, config),
    Loading,
    setLoading,
    AccessToken,
    SessionID,
    Logout: forceLogin,
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
