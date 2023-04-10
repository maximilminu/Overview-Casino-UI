import {
	QrCodeScanner,
	Print,
	Videocam,
	BookOnline,
} from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import React from "react";

const DriverIcon = {
	Camera: Videocam,
	EscPosPrinter: Print,
	TclPrinter: BookOnline,
	BarcodeScanner: QrCodeScanner,
};

const HardwareButton = (props) => {
	const Icon = DriverIcon[props.driver];

	return (
		<IconButton
			onClick={() => {
				if (!props.disabled && props.status) {
					props.onClick(props.name);
				}
			}}
			sx={{
				flexDirection: "column",
				color: props.disabled ? "grey" : props.status ? "green" : "red",
			}}
		>
			<i>
				<Icon />
			</i>

			<Typography sx={{ color: "black" }} fontSize="x-small">
				{props.label}
			</Typography>
		</IconButton>
	);
};

export default HardwareButton;
