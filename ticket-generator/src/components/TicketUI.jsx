import React, { useContext, useEffect, useLayoutEffect } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import Barcode from "react-barcode";
import { useState } from "react";
import { MuiPickersAdapterContext } from "@mui/x-date-pickers/LocalizationProvider";



const TicketUI = ({ data, pathname }) => {
	const dateTimeFormatter = useContext(MuiPickersAdapterContext).utils;
	const [ date, setDate ] = useState(Date.now());
	const [generatedBarcode, setGeneratedBarcode] = useState()

	useEffect(() => {
		setDate(data.Date);
	}, [data])

	// Sometimes generates a number with less than 18 characters. The WHILE loop prevents the creation of a ticket without the necessary amount of 18 digits.
	useLayoutEffect(() => {
		let num = Math.floor(Math.random() * 1000000000000000000).toString().padStart(18, '0');
		while (num.toString().length !== 18) {
			num = Math.floor(Math.random() * 1000000000000000000).toString().padStart(18, '0');
		}
		num = [...num].reverse().join("");
		setGeneratedBarcode(num);
	}, [])
		
	
	const value = +data?.Amount;
	const parsedValue = value?.toLocaleString("es-AR", {
		minimumFractionDigits: 2,
	});
	
	const barcodeFormat = data?.Barcode.toString().replace(
		/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
		"$1-$2-$3-$4-$5"
	);
	const generatedFormat = generatedBarcode?.replace(
		/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
		"$1-$2-$3-$4-$5"
	);

	const style = {
		paperTicket: {
			backgroundColor: "white",
			color: "black",
			width: { xs: "fit-content", lg: "30rem" },
			display: "flex",
			justifyContent: "center",
			// position: "relative",
			marginLeft: { xs: "auto", lg: "2rem" },
			marginRight: { xs: "auto", lg: 0 },
			padding: { xs: "5px", md: "30px" },
			marginTop: "0px",

		},
	};

	return (
		<Box sx={{ width: "100%", paddingTop: 0, alignSelf: { xs: "center", lg: "flex-start" } }}>
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
								variant="h"
								sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
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
								{ pathname.includes("/ticket/pre-insert") ? (
									<Barcode width={1} height={60} value={barcodeFormat !== "" ? (9 + barcodeFormat) : ""} />
								) : (
									<>
										<Typography>*Código de ejemplo</Typography>
										<Barcode width={1} height={60} value={(9 + generatedFormat) || ""} />
									</>
								)
								}
							</Grid>

							<Grid item>
								{/* DATE ACTUAL!!!! */}
								<Typography>{dateTimeFormatter.format(date, "fullDateTime")}</Typography>
							</Grid>
						</Grid>
						<Grid item>
							<Typography
								sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
								variant="h3"
							>
								${(data?.Amount ? parsedValue : "") + " "}ARS
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
									VALIDO POR 30 DÍAS <br />
									{/* {expiration} */}
								</Typography>
								<Typography>
									MAQUINA N°
									<br />
									{data?.PrintedIn ? "#" + data.PrintedIn : " "}
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
