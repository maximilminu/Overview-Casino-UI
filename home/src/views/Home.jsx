import { useMatches } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useRef } from "react";
import { Box } from "@mui/material";
import AutoDeepLinkProvider from "../context/AutoDeepLinkContext";
import { useState } from "react";

function Home() {
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
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
      </Box>
      <Footer onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
