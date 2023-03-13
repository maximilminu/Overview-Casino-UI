import React from "react";
import ReactDOM from "react-dom/client";
import { ApiProvider } from "./context/ApiContext";
import Router from "./Router";
import ConfigProvider from "./context/ConfigProvider";
import { TclPrinterProvider } from "./context/TclPrinterContext";
import { EscPosPrinterProvider } from "./context/EscPosPrinterContext";
import { BarcodeReaderProvider } from "./context/BarcodeReaderContext";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "./context/ThemeProvider";
import UserProvider from "./context/UserProvider";

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
