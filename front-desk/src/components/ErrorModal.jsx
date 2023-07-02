import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorModal = () => {
	const navigate = useNavigate();
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "#fdeded",
		border: "2px solid #ef5350",
		boxShadow: 24,
		outline: "none",
		p: 4,
	};
	return (
		<Box
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				top: 0,
			}}
		>
			<Grid
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					width: "100%",
				}}
			>
				<Box sx={style}>
					<Box
						gap="5px"
						display="flex"
						flexDirection="row"
						justifyContent="left"
						alignItems="center"
					>
						<ErrorOutlineIcon color="warning" />
						<Typography id="modal-modal-title" variant="h6" component="h2">
							<strong> ERROR </strong>
						</Typography>
					</Box>
					<Typography id="modal-modal-description" sx={{ mt: 2 }}>
						Se encontró un error en el código, notifique al técnico por favor.
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Button
							variant="contained"
							onClick={() => {
								navigate("/front-desk");
							}}
						>
							Inicio
						</Button>
					</Box>
				</Box>
			</Grid>
		</Box>
	);
};

export default ErrorModal;
