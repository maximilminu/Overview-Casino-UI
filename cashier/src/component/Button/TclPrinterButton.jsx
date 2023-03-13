import React, { useContext } from "react";
import { BookOnline } from "@mui/icons-material";
import {
  TclPrinterContext,
  PRINTER_STATUS_OFFLINE,
} from "../../context/TclPrinterContext";
import { IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";

const PrinterButton = () => {
  const { Printer } = useContext(TclPrinterContext);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <IconButton
      onClick={() => {
        if (Printer.status === PRINTER_STATUS_OFFLINE) {
          Printer.connect();
        } else {
          Printer.print(
            {
              barCode: "012345678901234567",
              side: "by overview.casino",
              validityDays: 125,
              value: 123.45,
              date: Date.now(),
              number: 9876543210,
              header: "Ticket de demo",
              titleLeft: "Terminal",
              titleRight: "de test",
              footer: "Sumate hoy a Mi.Mejor.Club",
            },
            2
          );
        }
      }}
      sx={{ flexDirection: "column" }}
    >
      <BookOnline
        sx={{
          fill: Printer.status === PRINTER_STATUS_OFFLINE ? "red" : "green",
        }}
      />
      <Typography
        sx={{ color: down600px ? "black" : "white" }}
        fontSize="xx-small"
      >
        {Printer.name()}
      </Typography>
    </IconButton>
  );
};

export default PrinterButton;
