import React, { useEffect } from "react";

import { Grid, Paper, Typography, Box } from "@mui/material";
import Barcode from "react-barcode";

import { useNavigate } from "react-router";

const style = {
	paperTicket: {
		backgroundColor: "white",
		color: "black",
		width: { xs: "24.375rem", md: "33rem" },
		position: "relative",
		marginLeft: "auto",
		marginRight: "auto",
		padding: { xs: "5px", md: "30px" },
		marginTop: "15px",
	},
};

const TicketUI = ({
	parsedDate,
	formatMonth,
	parsedValue,
	machineID,
	BarcodeValue,
}) => {
	const navigate = useNavigate();

	useEffect(() => {
		!BarcodeValue && navigate("/egm-operation-manager");

		//eslint-disable-next-line
	}, [BarcodeValue]);

	return (
		<Box sx={{ padding: { xs: 2, md: 8 } }}>
			<Paper elevation={3} sx={style.paperTicket}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Grid
						container
						direction="column"
						justifyContent="center"
						alignItems="center"
					>
						<Grid item>
							<Typography
								sx={{
									marginTop: { xs: "5px", md: "-10px" },
									fontSize: { xs: "1.5rem", md: "2.215rem" },
								}}
								variant="h4"
							>
								CASINO CENTRAL
							</Typography>
						</Grid>
						<Grid item>
							<Typography sx={{ fontSize: { xs: "14px", md: "1rem" } }}>
								Av. Patricio Peralta Ramos 2100 Mar del Plata
							</Typography>
						</Grid>
						<Grid item>
							<Typography
								variant="h3"
								sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
							>
								{" "}
								VALE EN EFECTIVO
							</Typography>
						</Grid>

						<Grid
							container
							direction="row"
							justifyContent="space-evenly"
							alignItems="center"
						>
							<Grid
								container
								direction="column"
								justifyContent="center"
								alignItems="center"
							>
								{" "}
								<Barcode width={1} height={60} value={BarcodeValue} />{" "}
							</Grid>

							<Grid item>
								<Typography>{parsedDate}</Typography>
							</Grid>
						</Grid>
						<Grid item>
							<Typography
								sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
								variant="h3"
							>
								${parsedValue} ARS
							</Typography>
						</Grid>
						<Grid
							container
							direction="row"
							justifyContent="space-evenly"
							alignItems="center"
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexDirection: "column",
							}}
						>
							<Grid
								item
								sx={{
									textAlign: "center",
									display: "flex",
									gap: "2.5rem",
									marginTop: "1rem",
								}}
							>
								<Typography>
									VALIDO POR <br />
									30 DÍAS
									{/* {expiration} */}
								</Typography>
								<Typography>
									MAQUINA N°
									<br />
									{machineID}
								</Typography>
							</Grid>

							<Grid
								item
								sx={{
									textAlign: "center",
									display: "flex",
									gap: "2.5rem",
									marginTop: "1rem",
								}}
							>
								<Typography>Solo cobrar por caja</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Box>
	);
};

export default TicketUI;
