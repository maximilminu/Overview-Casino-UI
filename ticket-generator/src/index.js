import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { ApiProvider } from "@oc/api-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@oc/theme-context";
import { ConfigProvider } from "@oc/config-context";
import UserProvider from "@oc/user-context";
import "dayjs/locale/es-mx";
import { HardwareProvider } from "@oc/hardware-context";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HardwareProvider>
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
  </HardwareProvider>
);
