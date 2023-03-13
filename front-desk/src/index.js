import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import { BarcodeReaderProvider } from "@oc/barcode-reader-context";
import { CameraProvider } from "@oc/camera-context";
import { ApiProvider } from "@oc/api-context";
import { NotifyUserProvider } from "@oc/notify-user-context";
import { SnackbarProvider } from "notistack";
import { ConfigProvider } from "@oc/config-context";
import { ThemeProvider } from "@oc/theme-context";
import AutoDeepLinkProvider from "./context/AutoDeepLinkContext";
import { EscPosPrinterProvider } from "@oc/escpos-printer-context";
import UserProvider from "@oc/user-context";
import MemberProvider from "./context/MemberContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<SnackbarProvider>
		<NotifyUserProvider>
			<ApiProvider>
				<ConfigProvider>
					<ThemeProvider>
						<UserProvider>
							<EscPosPrinterProvider>
								<CameraProvider>
									<BarcodeReaderProvider>
										<MemberProvider>
											<Router />
										</MemberProvider>
									</BarcodeReaderProvider>
								</CameraProvider>
							</EscPosPrinterProvider>
						</UserProvider>
					</ThemeProvider>
				</ConfigProvider>
			</ApiProvider>
		</NotifyUserProvider>
	</SnackbarProvider>
);
