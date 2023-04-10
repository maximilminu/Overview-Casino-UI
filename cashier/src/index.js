import React from "react";
import ReactDOM from "react-dom/client";
import { ApiProvider } from "@oc/api-context";
import Router from "./Router";
import { ConfigProvider } from "@oc/config-context";
import { TclPrinterProvider } from "@oc/tcl-printer-context";
import { EscPosPrinterProvider } from "@oc/escpos-printer-context";
import { BarcodeReaderProvider } from "@oc/barcode-reader-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@oc/theme-context";
import UserProvider from "@oc/user-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider>
    <NotifyUserProvider>
      <ApiProvider>
        <ConfigProvider>
          <ThemeProvider>
            <UserProvider>
              <EscPosPrinterProvider>
                <TclPrinterProvider>
                  <BarcodeReaderProvider>
                    <Router />
                  </BarcodeReaderProvider>
                </TclPrinterProvider>
              </EscPosPrinterProvider>
            </UserProvider>
          </ThemeProvider>
        </ConfigProvider>
      </ApiProvider>
    </NotifyUserProvider>
  </SnackbarProvider>
);
