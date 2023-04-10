// crear el contexto para la actualizacion de los devices
import { createContext, useLayoutEffect, useState } from "react";
// eslint-disable-next-line
import { ThemeProvider as MuiThemeProvider } from "@mui/system";
import { createTheme, Box } from "@mui/material";
import packageJson from "../../package.json";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(false);

  useLayoutEffect(() => {
    setTheme(
      createTheme({
        palette: {
          action: {
            disabledBackground: "#e0e0e0",
            disabled: "#a8a8a8",
            disabledvariant: "contained",
          },
          primary: {
            main: "#d03c31",
            light: "#f1faee",
            dark: "#2E2D2D",
          },
          secondary: {
            main: "#019f98",
          },
          light: {
            main: "#f1faee",
          },
        },
        background: {
          default: "#424242",
        }
      })
    );
  }, []);

  return (
    <ThemeContext.Provider value="">
      {theme && <MuiThemeProvider theme={theme}>
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
      </MuiThemeProvider>}
    </ThemeContext.Provider>
  );
};
