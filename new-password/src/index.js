import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@oc/theme-context";
import { HardwareProvider } from "@oc/hardware-context";
import { SnackbarProvider } from "notistack";
import { ApiProvider } from "@oc/api-context";
import { ConfigProvider } from "@oc/config-context";
import { NotifyUserProvider } from "@oc/notify-user-context";

import UserProvider from "@oc/user-context";
import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<HardwareProvider>
		<SnackbarProvider>
			<NotifyUserProvider>
				<ApiProvider>
					<ConfigProvider>
						<ThemeProvider>
							<UserProvider>
								<Router />
							</UserProvider>
						</ThemeProvider>
					</ConfigProvider>
				</ApiProvider>
			</NotifyUserProvider>
		</SnackbarProvider>
	</HardwareProvider>
);
