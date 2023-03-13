import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import SignIn from "./SignIn";
import ThemeProvider from "./context/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import ConfigProvider from "./context/ConfigProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider>
    <ThemeProvider>
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    </ThemeProvider>
  </ConfigProvider>
);
