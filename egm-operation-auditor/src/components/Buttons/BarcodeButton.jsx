import React, { useContext } from "react";
import { QrCodeScanner } from "@mui/icons-material";

import {
  BarcodeReaderContext,
  READER_STATUS_OFFLINE,
} from "../../context/BarcodeReaderContext";
import { IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";

const BarcodeButton = () => {
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));

  const { BarcodeReader } = useContext(BarcodeReaderContext);

  return (
    <IconButton
      onClick={() => {
        if (BarcodeReader.status === READER_STATUS_OFFLINE) {
          BarcodeReader.connect();
        }
      }}
      sx={{ flexDirection: "column", color: "white" }}
    >
      <QrCodeScanner
        sx={{
          fill:
            BarcodeReader.status === READER_STATUS_OFFLINE ? "red" : "green",
        }}
      />
      <Typography
        color={down600px ? "primary.main" : "third.main"}
        fontSize="x-small"
      >
        {BarcodeReader.name()}
      </Typography>
    </IconButton>
  );
};

export default BarcodeButton;
