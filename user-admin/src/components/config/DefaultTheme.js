import { createTheme } from "@mui/material";

export const theme = createTheme({
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
      main: "#3c3c43",
    },
    light: {
      main: "#f1faee",
    },
  },
  background: {
    default: "#424242",
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "transparent",
          color: "grey",
        },
      },
    },
  },
});
