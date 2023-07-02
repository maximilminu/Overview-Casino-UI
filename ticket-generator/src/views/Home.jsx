import React from "react";
import { Outlet, useMatches } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";
import { HardwareContext } from "@oc/hardware-context";
import { useContext } from "react";
import { useLayoutEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// eslint-disable-next-line
import { es } from "dayjs/locale/es";

function Home() {
  const matches = useMatches();
  const buttonsRef = useRef([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // eslint-disable-next-line
  const [disable, setDisable] = useState();
  const Hardware = useContext(HardwareContext);
  useLayoutEffect(() => {
    Hardware.ConnectAll()
      .then((ret) => {
        console.log("Devices initialized:", ret);
      })
      .catch((err) => {
        console.log("Problems connecting devices:", err);
      });
  }, [Hardware]);

  return (
    <>
      <Navbar onHeightChange={setHeaderHeight} buttonsRef={buttonsRef} />
      <Box
        sx={{
          position: "fixed",
          top: headerHeight,
          bottom: footerHeight,
          left: 0,
          right: 0,
          overflow: "hidden",
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Outlet />
        </LocalizationProvider>
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
