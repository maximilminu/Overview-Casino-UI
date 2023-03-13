import React, { useRef } from "react";
import { useSnackbar } from "notistack";

export const NotifyUserContext = React.createContext({});

export const NotifyUserProvider = ({ children }) => {
  const snackbarRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  snackbarRef.current = enqueueSnackbar;

  const NotifyUser = {
    Error: (message) => {
      console.log("NOTIFY USER ERROR:", message);
      snackbarRef.current(message, { variant: "error", persist: false });
    },
    Warning: (message) => {
      console.log("NOTIFY USER WARNING:", message);
      snackbarRef.current(message, { variant: "warning", persist: false });
    },
    Info: (message) => {
      console.log("NOTIFY USER INFO:", message);
      snackbarRef.current(message, { variant: "info", persist: false });
    },
    Success: (message) => {
      console.log("NOTIFY USER SUCCESS:", message);
      snackbarRef.current(message, { variant: "seccess", persist: false });
    },
  };

  return (
    <NotifyUserContext.Provider value={NotifyUser}>
      {children}
    </NotifyUserContext.Provider>
  );
};
