import React, { useContext } from "react";
import { Print } from "@mui/icons-material";
import { IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  EscPosPrinterContext,
  PRINTER_STATUS_OFFLINE,
} from "../../context/EscPosPrinterContext";

const PrinterButton = () => {
  const { Printer } = useContext(EscPosPrinterContext);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <IconButton
      sx={{ flexDirection: "column", color: "white" }}
      onClick={() => {
        if (Printer.status === PRINTER_STATUS_OFFLINE) {
          Printer.connect();
        }
        if (!Printer.status === PRINTER_STATUS_OFFLINE) {
          Printer.demo();
        }
      }}
    >
      <Print
        sx={{
          fill: Printer.status === PRINTER_STATUS_OFFLINE ? "red" : "green",
        }}
      />
      <Typography
        color={down600px ? "primary.main" : "third.main"}
        fontSize="x-small"
      >
        {Printer.name()}
      </Typography>
    </IconButton>
  );
};

export default PrinterButton;
