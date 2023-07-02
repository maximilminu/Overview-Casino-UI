import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { HardwareProvider } from "@oc/hardware-context";
import { ApiProvider } from "@oc/api-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ConfigProvider } from "@oc/config-context";
import { ThemeProvider } from "@oc/theme-context";
import UserProvider from "@oc/user-context";
import MemberProvider from "./context/MemberContext";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <SnackbarProvider>
      <NotifyUserProvider>
        <HardwareProvider>
          <ApiProvider>
            <ConfigProvider>
              <ThemeProvider>
                <UserProvider>
                  <MemberProvider>
                    <Router />
                  </MemberProvider>
                </UserProvider>
              </ThemeProvider>
            </ConfigProvider>
          </ApiProvider>
        </HardwareProvider>
      </NotifyUserProvider>
    </SnackbarProvider>
);
