import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "./context/ThemeProvider";

import { SnackbarProvider } from "notistack";
import { EscPosPrinterProvider } from "./context/EscPosPrinterContext";
import { ApiProvider } from "./context/ApiContext";
import ConfigProvider from "./context/ConfigProvider";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import TicketDataProvider from "./context/TicketData";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es-mx";
import UserProvider from "./context/UserProvider";
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
