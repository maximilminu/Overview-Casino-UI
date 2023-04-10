import { createContext, useContext, useLayoutEffect, useState } from "react";
// eslint-disable-next-line
import { ThemeProvider as MuiThemeProvider } from "@mui/system";
import { createTheme, Box, CssBaseline } from "@mui/material";
import packageJson from "../../package.json";
import { ConfigContext } from "./ConfigProvider";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const config = useContext(ConfigContext);
  const [theme, setTheme] = useState(false);

  useLayoutEffect(() => {
    setTheme(createTheme(config.Theme));

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
