import { Outlet, useMatches } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useRef } from "react";
import { Box } from "@mui/system";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { HardwareContext } from "@oc/hardware-context";
import { useContext } from "react";

function Home() {
  const Hardware = useContext(HardwareContext);
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [disable, setDisable] = useState();

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
        component="main"
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
        <Outlet context={[disable, setDisable]} />
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
