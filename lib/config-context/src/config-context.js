import React, { createContext, useState, useContext, useEffect } from "react";
import { ApiContext } from "@oc/api-context";

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
	const { Get } = useContext(ApiContext);
	const [config, setConfig] = useState({});
	const [dots, setDots] = useState(3);
	useEffect(() => {
		readConfig();
		// eslint-disable-next-line
	}, []);

	const readConfig = () => {
		Get("/config/v1").then(({ data }) => {
			if (!data.Theme) {
				setTimeout(readConfig, 1000);
				setDots((prevState) => prevState + 1);
				return;
			}
			setConfig(data);
			setDots(0);
		});
	};
	return (
		<ConfigContext.Provider value={config}>
			{config.Theme
				? children
				: "Leyendo configuraciones de la página" + ".".repeat(dots)}
		</ConfigContext.Provider>
	);
};
