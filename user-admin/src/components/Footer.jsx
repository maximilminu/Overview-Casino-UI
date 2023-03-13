import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";

export default function Footer({ userListPage }) {
	return (
		<>
			{/* Footer where info will be placed inside */}
			<AppBar
				position="fixed"
				sx={{
					backgroundColor: "secondary.main",
					top: "auto",
					bottom: 0,
				}}
			>
				<Toolbar style={{ display: "flex", justifyContent: "flex-end" }}>
					<Typography sx={{ color: "grey", margin: "0 auto" }}>
						Copyright © | Tecnoazar 2022{" "}
					</Typography>
				</Toolbar>
			</AppBar>
		</>
	);
}
