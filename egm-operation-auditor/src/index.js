import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { ConfigProvider } from "@oc/config-context";
import { EscPosPrinterProvider } from "@oc/escpos-printer-context";
import { BarcodeReaderProvider } from "@oc/barcode-reader-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@oc/theme-context";
import { ApiProvider } from "@oc/api-context";
import UserProvider from "@oc/user-context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es-mx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <SnackbarProvider>
    <NotifyUserProvider>
      <ApiProvider>
        <ConfigProvider>
          <ThemeProvider>
            <UserProvider>
              <EscPosPrinterProvider>
                <LocalizationProvider
                  adapterLocale="es-mx"
                  dateAdapter={AdapterDayjs}
                >
                  <BarcodeReaderProvider>
                    <Router />
                  </BarcodeReaderProvider>
                </LocalizationProvider>
              </EscPosPrinterProvider>
            </UserProvider>
          </ThemeProvider>
        </ConfigProvider>
      </ApiProvider>
    </NotifyUserProvider>
  </SnackbarProvider>
);
