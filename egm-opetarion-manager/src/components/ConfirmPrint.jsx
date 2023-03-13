import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const ConfirmPrint = () => {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					minHeight: "70vh",
				}}
			>
				<Paper
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						padding: "20px",
						height: "300px",
						width: "400px",
					}}
				>
					<Box
						sx={{
							marginTop: "20px",
							gap: "5rem",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Typography
							variant="h4"
							gutterBottom
							sx={{ textAlign: "center", marginBottom: "-2rem" }}
						>
							¡Ticket verificado <br /> con éxito!
						</Typography>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								gap: "30px",
								width: "100%",
								alignItems: "center",
							}}
						>
							<Button
								variant="outlined"
								onClick={() => {
									// setContador(contador + 1);
								}}
								sx={{ fontSize: "13px", width: "60%" }}
							>
								Re-imprimir ticket
							</Button>
							<Button
								variant="contained"
								onClick={() => {
									// navigate("/front-desk");
								}}
								sx={{
									backgroundColor: "secondary.main",
									fontSize: "20px",
									width: "100%",
								}}
							>
								Terminar
							</Button>
						</Box>
					</Box>
				</Paper>
			</Box>
		</>
	);
};

export default ConfirmPrint;
