import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@oc/theme-context";

import { SnackbarProvider } from "notistack";
import { EscPosPrinterProvider } from "@oc/escpos-printer-context";
import { ApiProvider } from "@oc/api-context";
import { ConfigProvider } from "@oc/config-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import TicketDataProvider from "./context/TicketData";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es-mx";
import UserProvider from "@oc/user-context";
import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<>
		<SnackbarProvider>
			<EscPosPrinterProvider>
				<ApiProvider>
					<ConfigProvider>
						<ThemeProvider>
							<NotifyUserProvider>
								<TicketDataProvider>
									<UserProvider>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}
											adapterLocale="es-mx"
										>
											<Router />
										</LocalizationProvider>
									</UserProvider>
								</TicketDataProvider>
							</NotifyUserProvider>
						</ThemeProvider>
					</ConfigProvider>
				</ApiProvider>
			</EscPosPrinterProvider>
		</SnackbarProvider>
	</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
