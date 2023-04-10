import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { ApiProvider } from "@oc/api-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ThemeProvider } from "@oc/theme-context";
import { ConfigProvider } from "@oc/config-context";
import UserProvider from "@oc/user-context";
import "dayjs/locale/es-mx";
import { CameraProvider } from "@oc/camera-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<SnackbarProvider>
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-mx">
			<ApiProvider>
				<NotifyUserProvider>
					<CameraProvider>
						<ConfigProvider>
							<ThemeProvider>
								<UserProvider>
									<Router />
								</UserProvider>
							</ThemeProvider>
						</ConfigProvider>
					</CameraProvider>
				</NotifyUserProvider>
			</ApiProvider>
		</LocalizationProvider>
	</SnackbarProvider>
);
