import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NotifyUserContext } from "../context/NotifyUserContext";
import { BarcodeReaderContext } from "../context/BarcodeReaderContext";
import { Box } from "@mui/material";
import { useNavigate, Outlet, useMatches } from "react-router-dom";
import AutoDeepLinkContext from "../context/AutoDeepLinkContext";
const Home = () => {
  const matches = useMatches();
  const { BarcodeReader } = useContext(BarcodeReaderContext);
  const NotifyUser = useContext(NotifyUserContext);
  const navigate = useNavigate();
  const [valueTicket, setValueTicket] = useState("");

  useEffect(() => {
    if (BarcodeReader.data) {
      if (BarcodeReader.data.length < 17) {
        NotifyUser.Info("Error leyendo el ticket, reintente.");
      } else {
        navigate(`/egm-operation-auditor/ticket/${BarcodeReader.data}`);
      }
      BarcodeReader.clear();
    }
    // eslint-disable-next-line
  }, [BarcodeReader.data]);

  return (
    <>
      <Navbar setValueTicket={setValueTicket} valueTicket={valueTicket} />
      <Box
        sx={{
          position: "fixed",
          top: "65px",
          bottom: "49px",
          left: 0,
          right: 0,
          overflow: "unset",
          backgroundColor: matches.length > 1 && "#eeeeeeb0",
        }}
      >
        <AutoDeepLinkContext />
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default Home;
