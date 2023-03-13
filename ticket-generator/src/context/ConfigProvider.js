import { createContext, useState, useContext, useEffect } from "react";
import { ApiContext } from "./ApiContext";

export const ConfigContext = createContext();

const ConfigProvider = ({ children }) => {
  const { Get } = useContext(ApiContext);
  const [config, setConfig] = useState({});

  useEffect(() => {
    Get("/config/v1").then((res) => setConfig(res));
    // eslint-disable-next-line
  }, []);

  return (
    <ConfigContext.Provider value={config}>
      {config.Theme ? children : "Leyendo configuraciones de la página..."}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
