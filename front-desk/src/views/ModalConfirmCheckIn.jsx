import React, { useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { NotifyUserContext } from "@oc/notify-user-context";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import {
	EscPosPrinterContext,
	PRINTER_STATUS_OFFLINE,
} from "@oc/escpos-printer-context";
import {
	Backdrop,
	CircularProgress,
	Button,
	Paper,
	Container,
} from "@mui/material";
import { MemberContext } from "../context/MemberContext";
import Avatar from "../components/Avatar";

const style = {
	paper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		height: "450px",
		width: "500px",
		margin: "2rem",
		elevation: "2",
		padding: "40px",
		backgroundColor: "third.main",
		color: "primary.main",
	},
	box: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		minHeight: "40vh",
	},
};

const ModalConfirmCheckIn = () => {
	const NotifyUser = useContext(NotifyUserContext);
	const { member } = React.useContext(MemberContext);
	const [thePostIsDone, setThePostIsDone] = React.useState(false);
	const { Printer } = React.useContext(EscPosPrinterContext);
	const { Post, Put } = React.useContext(ApiContext);
	const navigate = useNavigate();
	const AccessToken = localStorage.getItem("AccessToken");
	const TokenType = localStorage.getItem("TokenType");
	const areaKey = "13c917d0-9fb3-4a98-9a17-c425f7450958";
	const [visit, setVisit] = React.useState({});
	const [contador, setContador] = React.useState(0);

	useEffect(() => {
		if (!member) {
			navigate("/front-desk/check-in");
		}
		// eslint-disable-next-line
	}, [member]);

	const memberCapitalized =
		member?.Name?.charAt(0).toUpperCase() + member?.Name?.slice(1);
	let text;
	if (member?.Name?.length >= 20) {
		text = `¡${memberCapitalized}\n \n te`;
	} else {
		text = `¡${memberCapitalized}, te`;
	}

	const handlePrintAgain = () => {
		if (visit && visit.TotalQty) {
			const qrUrl = `https://Mi.Mejor.Club/checkin/${visit.ID}`;
			Put(`/visit/v1/visit-update/${visit.ID}`, { PrintQty: contador }).then(
				() => {
					Printer.print(
						(printer) =>
							new Promise((finishPrint) => {
								Printer.makeQr(qrUrl)
									.then((qrImg) => {
										printer
											.align("ct")
											.style("normal")
											.size(0, 0)
											.text("─".repeat(45))
											.size(1, 0)
											.style("b")
											.text(text)
											.feed(1)
											.text("damos la bienvenida al")
											.feed(1)
											.text("Casino de Mar del Plata!")
											.feed(2)
											.raster(qrImg)
											.size(0, 0)
											.style("normal")
											.text(qrUrl)
											.feed(1)
											.text(`Reimpresión N° ${contador}`)
											.feed(3)
											.size(1, 0)
											.style("b")
											.text(`Felicitaciones por`)
											.text(`tu visita número ${visit.TotalQty}`)
											.feed(2)
											.text(`¡Gracias por venir,`)
											.text(`y que la suerte este`)
											.text("siempre a tu favor!")
											.text("─".repeat(45));
										finishPrint();
										setThePostIsDone(true);
									})
									.catch((err) => {
										NotifyUser.Error("Problemas creando el QR.");
									});
							}),
						(onError) => {
							NotifyUser.Error("Problemas comunicando con la impresora.");
						}
					);
				}
			);
		}
	};

	const handlePrintTicket = () => {
		if (visit && visit.TotalQty) {
			const qrUrl = `https://Mi.Mejor.Club/checkin/${visit.ID}`;
			Printer.print(
				(printer) =>
					new Promise((finishPrint) => {
						Printer.makeQr(qrUrl)
							.then((qrImg) => {
								printer
									.align("ct")
									.style("normal")
									.size(0, 0)
									.text("─".repeat(45))
									.size(1, 0)
									.style("b")
									.text(text)
									.feed(1)
									.text("damos la bienvenida al")
									.feed(1)
									.text("Casino de Mar del Plata!")
									.feed(2)
									.raster(qrImg)
									.size(0, 0)
									.style("normal")
									.text(qrUrl)
									.feed(3)
									.size(1, 0)
									.style("b")
									.text(`Felicitaciones por`)
									.text(`tu visita número ${visit.TotalQty}`)
									.feed(2)
									.text(`¡Gracias por venir,`)
									.text(`y que la suerte este`)
									.text("siempre a tu favor!")
									.text("─".repeat(45));
								finishPrint();
								setThePostIsDone(true);
							})
							.catch((err) => {
								NotifyUser.Error("Problemas creando el QR.");
							});
					}),
				(onError) => {
					NotifyUser.Error("Problemas comunicando con la impresora.");
				}
			);
		}
	};

	useEffect(() => {
		if (contador > 0) {
			handlePrintAgain();
		}
		// eslint-disable-next-line
	}, [contador]);

	useEffect(
		handlePrintTicket,
		// eslint-disable-next-line
		[visit]
	);

	const handleCheckIn = () => {
		if (Printer.status !== PRINTER_STATUS_OFFLINE) {
			Post(
				"/visit/v1",
				{
					MemberKey: member?.ID,
					AreaKey: areaKey,
				},
				{
					headers: {
						Authorization: `${TokenType} ${AccessToken}`,
					},
				}
			)
				.then(({ data }) => {
					if ({ data }.AlreadyReported) {
						NotifyUser.Warning(
							"Ya obtuvo el ticket de check in en la jornada actual"
						);
						return;
					}
					Put(`/visit/v1/visit-update/${data.ID}`, { PrintQty: contador }).then(
						() => {
							setVisit(data);
						}
					);
				})
				.catch((err) => {
					console.log("error", err);
				});
		} else {
			NotifyUser.Error("Problemas comunicando con la impresora.");
		}
	};

	return (
		<>
			{member?.Name ? (
				thePostIsDone ? (
					<>
						<Container
							sx={{
								marginTop: "30px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Paper
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "column",
									width: { xl: "40%", lg: "40%", md: "40%", sm: "90%" },
									padding: "50px",
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
										sx={{ textAlign: "center" }}
									>
										¡Check in realizado <br /> con exito!
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
												setContador(contador + 1);
											}}
											sx={{
												fontSize: "13px",
												width: "60%",
												color: "secondary.main",
											}}
										>
											Re-imprimir ticket
										</Button>
										<Button
											variant="contained"
											onClick={() => {
												navigate("/front-desk");
											}}
											sx={{
												backgroundColor: "primary.main",
												fontSize: "20px",
												width: "100%",
											}}
										>
											Terminar
										</Button>
									</Box>
								</Box>
							</Paper>
						</Container>
					</>
				) : (
					<Box sx={style.box}>
						<Paper sx={style.paper}>
							<Avatar
								sx={{
									margin: "50px",
									width: 200,
									height: 200,
									marginTop: "50px",
								}}
								subject={member}
							/>
							<Typography sx={{ fontSize: "30px", color: "secondary.main" }}>
								¡Hola{" "}
								{member.Name.charAt(0).toUpperCase() + member.Name.slice(1)}!
							</Typography>
							<Typography sx={{ fontSize: "20px", color: "secondary.main" }}>
								¿Deseas hacer check in?
							</Typography>
							<Box
								sx={{
									display: "flex",
									marginTop: "30px",
									gap: "20px",
									marginBottom: "70px",
								}}
							>
								<Button
									sx={{ color: "secondary.main", width: "70px" }}
									onClick={() => {
										navigate("/front-desk/check-in");
									}}
								>
									No
								</Button>
								<Button
									variant="contained"
									onClick={handleCheckIn}
									sx={{ backgroundColor: "primary.main", width: "70px" }}
								>
									Sí
								</Button>
							</Box>
						</Paper>
					</Box>
				)
			) : (
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
					open={true}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
		</>
	);
};

export default ModalConfirmCheckIn;
