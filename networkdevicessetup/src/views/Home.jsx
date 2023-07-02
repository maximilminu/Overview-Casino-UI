import React, { useState } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

const Home = () => {
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  return (
    <>
      <Navbar onHeightChange={setHeaderHeight} />
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
        component="main"
      >
        <Outlet />
      </Box>
      <Footer onHeightChange={setFooterHeight} />
    </>
  );
};

export default Home;
