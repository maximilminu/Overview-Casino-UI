import React, { useContext } from "react";
import { Print } from "@mui/icons-material";
import {
	EscPosPrinterContext,
	PRINTER_STATUS_OFFLINE,
} from "../context/EscPosPrinterContext";
import { IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";

const PrinterButton = ({}) => {
	const { Printer } = useContext(EscPosPrinterContext);
	const theme = useTheme();
	const down600px = useMediaQuery(theme.breakpoints.down("sm"));
	return (
		<IconButton
			onClick={() => {
				if (Printer.status === PRINTER_STATUS_OFFLINE) {
					Printer.connect();
				} else {
					Printer.demo();
				}
			}}
			sx={{ flexDirection: "column" }}
		>
			<Print
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
