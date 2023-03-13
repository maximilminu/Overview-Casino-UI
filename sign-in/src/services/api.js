const API_KEY = process.env.REACT_APP_API_KEY;

export const login = ({ Email, Password }) => {
  return fetch(`/api/token/v1`, {
    method: "POST",
    headers: {
      "content-type": "application/json charset=utf-8",
      "X-API-Key": API_KEY,
      "X-Session-ID": localStorage.getItem("SessionID"),
    },
    body: JSON.stringify({
      SignInID: Email,
      Password,
    }),
  })
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.status);
      }
      return resp;
    })
    .then((res) => res.json());
};

export const logout = ({ tokenType, accessToken }) => {
  const headers = {
    "Content-Type": "application/json charset=utf-8",
    "X-API-Key": API_KEY,
  };

  if (localStorage.getItem("SessionID")) {
    headers["X-Session-ID"] = localStorage.getItem("SessionID");
  }

  if (tokenType && accessToken) {
    headers["Authorization"] = `${tokenType} ${accessToken}`;
  }

  return fetch(`/api/token/v1`, {
    method: "DELETE",
    headers,
  });
};

export const getSession = () => {
  return fetch(`/api/session/v1/id`, {
    method: "GET",
    credentials: "include",
    headers: {
      "content-type": "application/json charset=utf-8",
      "X-API-Key": API_KEY,
    },
  })
    .then((resp) => {
      if (resp.status !== 200) {
        throw new Error(resp.status);
      }
      return resp;
    })
    .then((res) => res.text());
};

// @type: string[public|private]
export const getSessionValue = (type, value) => {
  return fetch(`/api/session/v1/${type}/${value}`, {
    method: "GET",
    headers: {
      "content-type": "application/json charset=utf-8",
      "X-API-Key": API_KEY,
    },
  })
    .then((resp) => {
      if (resp.status !== 200 || resp.status !== 404) {
        throw new Error(resp.status);
      }
      return resp;
    })
    .then((res) => {
      res.text();
      console.log(res);
    });
};
