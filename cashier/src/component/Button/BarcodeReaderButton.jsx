import React, { useContext } from "react";
import {
  BarcodeReaderContext,
  READER_STATUS_OFFLINE,
} from "../../context/BarcodeReaderContext";
import { IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { QrCodeScanner } from "@mui/icons-material";

const BarcodeReaderButton = () => {
  const { BarcodeReader } = useContext(BarcodeReaderContext);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <IconButton
      onClick={() => {
        if (BarcodeReader.status === READER_STATUS_OFFLINE) {
          BarcodeReader.connect();
        }
      }}
      sx={{ flexDirection: "column" }}
    >
      <QrCodeScanner
        sx={{
          fill:
            BarcodeReader.status === READER_STATUS_OFFLINE ? "red" : "green",
        }}
      />
      <Typography
        sx={{ color: down600px ? "black" : "white" }}
        fontSize="xx-small"
      >
        {BarcodeReader.name()}
      </Typography>
    </IconButton>
  );
};

export default BarcodeReaderButton;
