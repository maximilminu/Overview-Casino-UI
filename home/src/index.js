import React from "react";
import ReactDOM from "react-dom/client";
import { ApiProvider } from "./context/ApiContext";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import ConfigProvider from "./context/ConfigProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import UserProvider from "./context/UserProvider";
import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <SnackbarProvider>
    <NotifyUserProvider>
      <ApiProvider>
        <ConfigProvider>
          <ThemeProvider>
            <UserProvider>
              <Router />
            </UserProvider>
          </ThemeProvider>
        </ConfigProvider>
      </ApiProvider>
    </NotifyUserProvider>
  </SnackbarProvider>
);
