import { createContext, useContext, useLayoutEffect, useState } from "react";
// eslint-disable-next-line
import { ThemeProvider as MuiThemeProvider } from "@mui/system";
import { Box, createTheme, CssBaseline } from "@mui/material";
import { ConfigContext } from "./ConfigProvider";
import packageJson from "../../package.json";
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(false);
  const config = useContext(ConfigContext);

  useLayoutEffect(() => {
    setTheme(createTheme(config.theme));
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeContext.Provider value="">
      {theme && (
        <MuiThemeProvider theme={theme}>
          {children}
          <CssBaseline />
          {packageJson.version.includes("rc") && (
            <Box
              sx={{
                border: "3px solid red",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                zIndex: 999999,
                pointerEvents: "none",
              }}
            />
          )}
        </MuiThemeProvider>
      )}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
