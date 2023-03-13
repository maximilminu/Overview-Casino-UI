import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';
import { ApiProvider } from "./context/ApiContext";
import { NotifyUserProvider } from "./context/NotifyUserContext";
import { SnackbarProvider } from "notistack";
import { EscPosPrinterProvider } from "./context/EscPosPrinterContext";
import { BarcodeReaderProvider } from "./context/BarcodeReaderContext";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider } from './context/ThemeProvider';
import ConfigProvider from "./context/ConfigProvider";
import UserProvider from "./context/UserProvider.js";
import 'dayjs/locale/es-mx';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<SnackbarProvider>
		<LocalizationProvider
			dateAdapter={AdapterDayjs}
			adapterLocale="es-mx"
		>
			<EscPosPrinterProvider>
				<BarcodeReaderProvider>
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
				</BarcodeReaderProvider>
			</EscPosPrinterProvider>
		</LocalizationProvider>
	</SnackbarProvider>
);
