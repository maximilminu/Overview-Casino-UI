import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Container } from "@mui/material";

import Logo from "./assets/Logo.png";

import Checkmark from "./assets/Checkmark";

const style = {
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},

	paper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		height: "250px",
		width: "400px",
		margin: "2rem",
		elevation: "2",
		padding: "40px",
		backgroundColor: "third.main",
		color: "primary.main",
	},
	paperTicket: {
		backgroundColor: "white",
		color: "black",
		width: { xs: "18rem", md: "30rem" },
		height: { xs: "22.5rem", md: "unset" },
		position: "relative",
		marginLeft: "auto",
		marginRight: "auto",
		padding: { xs: "5px", md: "30px" },
		marginTop: "-50px",
		textAlign: "center",
	},
};

const TicketUi = ({ Name, Area, PrintedAt }) => {
	const [capitalizedName, setCapitalizedName] = useState();
	function convertirFecha(milisegundos) {
		const fecha = new Date(milisegundos);
		const opciones = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: false,
		};

		return `${fecha.toLocaleString("es-ES", opciones)} `;
	}

	useEffect(() => {
		const toTitleCase = (str) => {
			if (!str) return ""; // <-- agregamos una comprobación aquí
			return str.replace(/\b\w+/g, function (word) {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			});
		};
		const capitalizedName = toTitleCase(Name);
		setCapitalizedName(capitalizedName);
	}, [Name]);

	const date = convertirFecha(PrintedAt);
	return (
		<Container sx={style.container}>
			<Box sx={{ marginTop: "4em" }}>
				<Box
					component="img"
					src={Logo}
					sx={{
						objectFit: "fill",
						width: { xs: "300px", md: "400px" },
						height: { xs: "150px", md: "200px" },
						marginBottom: "4rem",
					}}
				/>
			</Box>
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
									Check-in de
									{<br />}
									{capitalizedName}
								</Typography>
							</Grid>
							<Grid item>
								{<br />}
								<Typography sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" } }}>
									En {Area}
								</Typography>
							</Grid>
							<Grid item>
								{<br />}
								<Typography
									variant="h3"
									sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
								>
									{date}
								</Typography>
							</Grid>
							<Grid item>
								{<br />}
								{/* <Box variant="h3" sx={{ width: "5rem", height: "10rem" }}> */}
								<Checkmark />
								{/* </Box> */}
							</Grid>

							<Grid
								container
								direction="row"
								justifyContent="space-evenly"
								alignItems="center"
							>
								{/* <Grid item>
									{<br />}
									<Typography
										sx={{
											fontSize: { xs: "1.2rem", md: "1.5rem" },
											marginTop: "2rem",
										}}
									>
										Impresión válida número 3
									</Typography>
								</Grid> */}
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default TicketUi;
