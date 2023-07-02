import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router";
import ThemeProvider from "./context/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import ConfigProvider from "./context/ConfigProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  </ConfigProvider>
);
