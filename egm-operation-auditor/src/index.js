import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { BarcodeReaderProvider } from "./context/BarcodeReaderContext";
import { ApiProvider } from "./context/ApiContext";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import ConfigProvider from "./context/ConfigProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { EscPosPrinterProvider } from "./context/EscPosPrinterContext";
import UserProvider from "./context/UserProvider";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
