import { Outlet, useMatches } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRef } from "react";
import { Box } from "@mui/system";
import { useState } from "react";

function Home() {
  const buttonsRef = useRef([]);
  const matches = useMatches();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // eslint-disable-next-line 
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
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
        }}
      >
        <Outlet />
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
}

export default Home;
