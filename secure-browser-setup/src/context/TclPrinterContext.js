import React, { useLayoutEffect, useRef, useState } from "react";
import dayjs from "dayjs";

export const PRINTER_STATUS_OFFLINE = false;
export const PRINTER_STATUS_ONLINE = true;

export const TclPrinterContext = React.createContext({});

export const TclPrinterProvider = ({ children }) => {
	const init = useRef(false);
	const port = useRef(false);
	const deviceName = useRef(false);
	const timeout = useRef(false);
	const [status, setStatus] = useState(PRINTER_STATUS_OFFLINE);

	useLayoutEffect(() => {
		if (!init.current) {
			init.current = true;

			navigator.serial?.addEventListener("disconnect", (event) => {
				if (event.target === port.current) {
					if (timeout.current) {
						clearTimeout(timeout.current);
						timeout.current = false;
						port.current = false;
						deviceName.current = false;
						setStatus(PRINTER_STATUS_OFFLINE);
					}
				}
			});
		}
	}, []);

	const connect = () => {
		navigator.serial.requestPort().then((p) => {
			p.open({ baudRate: 9600 }).then(() => {
				port.current = p;
				setStatus(PRINTER_STATUS_ONLINE);
			});
		});
	};

	const name = () => {
		if (port.current) {
			if (deviceName.current) {
				return deviceName.current;
			}
			return "Conectado.";
		} else {
			return "Sin Conexion.";
		}
	};

	const print = (data) => {
		if (port.current) {
			const code =
				String(data.barCode).substring(0, 2) +
				"-" +
				String(data.barCode).substring(2, 6) +
				"-" +
				String(data.barCode).substring(6, 10) +
				"-" +
				String(data.barCode).substring(10, 14) +
				"-" +
				String(data.barCode).substring(14, 18) +
				"/00";
			const date = dayjs(data.date);
			const ticket = `^P|0|1|${data.side}|${data.header}|${data.titleLeft}|${
				data.titleRight
			}|||${code}|${date.format("DD-MM-YYYY")}|${date.format(
				"HH:mm:ss"
			)}|TICKET #${data.number}|||$${data.value}||${data.validityDays}|${
				data.footer
			}|${data.barCode}|^`;
			const encoder = new TextEncoder();
			const writer = port.current.writable.getWriter();
			writer.write(encoder.encode(ticket)).then(() => {
				writer.releaseLock();
			});
		}
	};

	const Printer = {
		status,
		connect,
		name,
		print,
	};

	return (
		<TclPrinterContext.Provider value={{ Printer }}>
			{children}
		</TclPrinterContext.Provider>
	);
};
