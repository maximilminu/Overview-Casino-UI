import { useRef } from "react";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { NotifyUserContext } from "@oc/notify-user-context";
import { BarcodeReaderContext } from "@oc/barcode-reader-context";
import { Box } from "@mui/material";
import { useNavigate, Outlet, useMatches } from "react-router-dom";
import AutoDeepLinkContext from "../context/AutoDeepLinkContext";
const Home = () => {
  const buttonsRef = useRef([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // eslint-disable-next-line
  const [disable, setDisable] = useState();
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
      <Navbar
        onHeightChange={setHeaderHeight}
        buttonsRef={buttonsRef}
        setValueTicket={setValueTicket}
        valueTicket={valueTicket}
      />
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
        <AutoDeepLinkContext />
        <Outlet />
      </Box>
      <Footer disable={disable} onHeightChange={setFooterHeight} />
    </>
  );
};

export default Home;
