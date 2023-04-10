import React from "react";
import ReactDOM from "react-dom/client";
import { BarcodeReaderProvider } from "@oc/barcode-reader-context";
import { ApiProvider } from "@oc/api-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ConfigProvider } from "@oc/config-context";
import { ThemeProvider } from "@oc/theme-context";
import { EscPosPrinterProvider } from "@oc/escpos-printer-context";
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
              <EscPosPrinterProvider>
                <BarcodeReaderProvider>
                  <Router />
                </BarcodeReaderProvider>
              </EscPosPrinterProvider>
            </UserProvider>
          </ThemeProvider>
        </ConfigProvider>
      </ApiProvider>
    </NotifyUserProvider>
  </SnackbarProvider>
);
