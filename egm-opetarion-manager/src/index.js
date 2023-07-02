import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@oc/theme-context";
import { HardwareProvider } from "@oc/hardware-context";
import { SnackbarProvider } from "notistack";
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
			<HardwareProvider>
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
			</HardwareProvider>
		</SnackbarProvider>
	</>
);
