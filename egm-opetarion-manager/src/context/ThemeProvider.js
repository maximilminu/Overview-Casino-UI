import { createContext, useLayoutEffect, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/system";
import { createTheme, Box, CssBaseline } from "@mui/material";
import packageJson from "../../package.json";
import { useContext } from "react";
import { ConfigContext } from "./ConfigProvider";

// backgroundImage: `url(${config.Images.HomeImageLaptop})`,


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(false);
  const config = useContext(ConfigContext);
  useLayoutEffect(() => {
    setTheme(createTheme(config.Theme));
    // eslint-disable-next-line
  }, []);
  return (
    <ThemeContext.Provider value="">
      {theme && (
        <MuiThemeProvider theme={theme}>

          <CssBaseline />

          {children}
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
