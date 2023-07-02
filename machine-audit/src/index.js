import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { ConfigProvider } from "@oc/config-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@oc/theme-context";
import { ApiProvider } from "@oc/api-context";
import UserProvider from "@oc/user-context";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es-mx";
import { HardwareProvider } from "@oc/hardware-context";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<HardwareProvider>
		<SnackbarProvider>
			<NotifyUserProvider>
				<ApiProvider>
					<ConfigProvider>
						<ThemeProvider>
							<UserProvider>
								<LocalizationProvider
									adapterLocale="es-mx"
									dateAdapter={AdapterDayjs}
								>
									<Router />
								</LocalizationProvider>
							</UserProvider>
						</ThemeProvider>
					</ConfigProvider>
				</ApiProvider>
			</NotifyUserProvider>
		</SnackbarProvider>
	</HardwareProvider>
);
