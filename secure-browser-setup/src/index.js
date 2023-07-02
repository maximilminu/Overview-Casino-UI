import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";
import { BrowserRouter } from "react-router-dom";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import { HardwareProvider } from "@oc/hardware-context";
import { ApiProvider } from "./context/ApiContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HardwareProvider>
    <BrowserRouter>
      <ApiProvider>
        <SnackbarProvider>
          <NotifyUserProvider>
            <Main />
          </NotifyUserProvider>
        </SnackbarProvider>
      </ApiProvider>
    </BrowserRouter>
  </HardwareProvider>
);
