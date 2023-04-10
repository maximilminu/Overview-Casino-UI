import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./Main";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { BarcodeReaderProvider } from "./context/BarcodeReaderContext";
import { CameraProvider } from "@oc/camera-context";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import { EscPosPrinterProvider } from "./context/EscPosPrinterContext";
import { TclPrinterProvider } from "./context/TclPrinterContext";
import { RfIdReaderProvider } from "./context/RfIdReaderContext";
import { SecureBrowserProvider } from "@oc/secure-browser-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SecureBrowserProvider>
    <BrowserRouter>
      <ThemeProvider>
        <SnackbarProvider>
          <NotifyUserProvider>
            <EscPosPrinterProvider>
              <TclPrinterProvider>
                <CameraProvider>
                  <BarcodeReaderProvider>
                    {/* <RfIdReaderProvider> */}
                    <Main />
                    {/* </RfIdReaderProvider> */}
                  </BarcodeReaderProvider>
                </CameraProvider>
              </TclPrinterProvider>
            </EscPosPrinterProvider>
          </NotifyUserProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </SecureBrowserProvider>
);
