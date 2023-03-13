// crear el contexto para la actualizacion de los devices
import { useLayoutEffect } from "react";
import { createContext, useState } from "react";
import packageJson from "../../package.json";

export const ConfigContext = createContext();

const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});

  useLayoutEffect(() => {
    fetch(`${packageJson.homepage}/config.json`)
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
