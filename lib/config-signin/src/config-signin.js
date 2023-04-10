// crear el contexto para la actualizacion de los devices
import { useLayoutEffect } from "react";
import { createContext, useState } from "react";

export const ConfigContext = createContext();
const ConfigProvider = ({ children }) => {
	const [config, setConfig] = useState({});

	//!ADD TO .env FILE : REACT_APP_VERSION=$npm_package_version
	const packageJson = process.env.REACT_APP_HOMEPAGE;
	useLayoutEffect(() => {
		if (!packageJson) {
			console.error(
				"Include  REACT_APP_VERSION=$npm_package_homepage on .env file "
			);
			return;
		}
	}, [packageJson]);

	useLayoutEffect(() => {
		fetch(`${packageJson}/config.json`)
			.then((response) => response.json())
			.then((json) => setConfig(json));
	}, []);
	return (
		<ConfigContext.Provider value={config}>
			{config.LogoRight ? children : "Leyendo configuraciones de la página..."}
		</ConfigContext.Provider>
	);
};
export default ConfigProvider;
