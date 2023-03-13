import { Outlet, useLocation, useMatches } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useRef } from "react";
import { Box } from "@mui/system";
import AutoDeepLinkProvider from "../context/AutoDeepLinkContext";

function Home() {
  const buttonsRef = useRef([]);
  const matches = useMatches();

  return (
    <>
      <Navbar buttonsRef={buttonsRef} />
      <Box
        sx={{
          position: "fixed",
          top: "65px",
          bottom: "49px",
          left: 0,
          right: 0,
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
          overflow: "auto",
        }}
      >
        <AutoDeepLinkProvider />
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}

export default Home;
