import React, { memo, useRef } from "react";
import { useSnackbar } from "notistack";

export const NotifyUserContext = React.createContext({});

export const NotifyUserProvider = memo(({ children }) => {
  const snackbarRef = useRef();
  const { enqueueSnackbar } = useSnackbar();
  snackbarRef.current = enqueueSnackbar;

  const NotifyUser = {
    Error: (message) => {
      snackbarRef.current(message, { variant: "error", persist: false });
    },
    Warning: (message) => {
      snackbarRef.current(message, { variant: "warning", persist: false });
    },
    Info: (message) => {
      snackbarRef.current(message, { variant: "info", persist: false });
    },
    Success: (message) => {
      snackbarRef.current(message, { variant: "success", persist: false });
    },
  };

  return (
    <NotifyUserContext.Provider value={NotifyUser}>
      {children}
    </NotifyUserContext.Provider>
  );
});
