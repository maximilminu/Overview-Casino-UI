import { Outlet, useMatches } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useRef } from "react";
import { Box } from "@mui/system";
import AutoDeepLinkProvider from "../context/AutoDeepLinkContext";
import { useState } from "react";

function Home() {
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [disable, setDisable] = useState();
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
        <AutoDeepLinkProvider />
        <Outlet context={[disable, setDisable]} />
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
