import React, { useContext, useState } from "react";
import { Button, Box } from "@mui/material";
import AfterPrint from "../components/AfterPrint";
import { TicketDataCOntext } from "../context/TicketData";
import { HardwareContext } from "@oc/hardware-context";
import { NotifyUserContext } from "@oc/notify-user-context";

import { LoadingButton } from "@mui/lab";
import MotiveModal from "./MotiveModal";
import { ApiContext } from "@oc/api-context";
import { useNavigate } from "react-router";
import jwt_decode from "jwt-decode";
import PrintIcon from "@mui/icons-material/Print";
const VerifiedTicketPaper = ({ formatShortMonth, parseDate }) => {
	const [showModal, setShowModal] = useState(false);
	const [date, setDate] = useState();
	const [ticketData, setTicketData] = useState();
	const [motive, setMotive] = useState("");
	const [openConfirm, setOpenConfirm] = useState(false);
	const [count, setCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const { ticket, setTicket } = useContext(TicketDataCOntext);
	const { Post } = useContext(ApiContext);
	const Hardware = useContext(HardwareContext);
	const NotifyUser = useContext(NotifyUserContext);
	const AccessToken = localStorage.getItem("AccessToken");
	const token = AccessToken;
	const decoded = token && jwt_decode(token);

	const value = +ticketData?.Amount;
	const parsedValue = value?.toLocaleString("es-AR", {
		minimumFractionDigits: 2,
	});
	const navigate = useNavigate();
	let bcode = ticketData?.Barcode;
	let formatBcode = bcode?.replace(/-/g, "");

	const handlePrintTicket = ({ Barcode, Amount, PrintedIn, PrintedAt }) => {
		const parsedValue = Amount?.toLocaleString("es-AR", {
			minimumFractionDigits: 2,
		});

		const formatBcode = Barcode && Barcode.replace(/-/g, "");

		const formatMonth = formatShortMonth(PrintedAt);

		const parsedDate = parseDate(formatMonth);

		setDate(parsedDate);

		Hardware.Device.Printer.print(
			(printer) =>
				new Promise((finishPrint) => {
					setLoading(true);
					setTimeout(() => {
						setLoading(false);
					}, 5000);

					printer
						.align("ct")
						.style("normal")
						.size(1, 1)
						.style("b")
						.text("CASINO CENTRAL")
						.feed(1)
						.size(0, 0)
						.text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
						.feed(1)
						.size(2, 3)
						.text("VALE EN EFECTIVO")
						.feed(1)

						.raster(Hardware.Device.Printer.makeBarcode(formatBcode))
						.feed(1)
						.size(0, 0)
						.text(`${Barcode}`)

						.feed(2)
						.size(1, 0)
						.text(parsedDate)
						.feed(1)
						.size(2, 2)
						.text(`$${parsedValue} ARS`)
						.feed(1)
						.size(0, 0)
						.tableCustom(
							[
								{
									text: "VALIDO POR ",
									align: "CENTER",
									width: 1,
								},
								{
									text: `MAQUINA N° `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.tableCustom(
							[
								{
									text: "30 DIAS",
									align: "CENTER",
									width: 1,
								},
								{
									text: `${PrintedIn}`,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)

						.align("lt")
						.feed(2)
						.text(`CREADO POR:                             FIRMA`)
						.feed(1)
						.text(`${decoded.Profile.FullName}`)
						.text("________________________________________________")
						.feed(2)
						.text("AUTORIZADO POR:                         FIRMA")
						.feed(2)
						.text("________________________________________________")

						.align("ct")
						.feed(2)
						.size(1, 0)
						.text("Solo cobrar por caja");

					finishPrint();
				}),
			(onError) => {
				console.log("ERROR Asking for printer", onError);
				NotifyUser.Error("Problemas comunicando con la impresora.");
			}
		);
	};

	const handlePrintTicketAgain = () => {
		Hardware.Device.Printer.print(
			(printer) =>
				new Promise((finishPrint) => {
					setCount((prevState) => prevState + 1);
					setLoading(true);
					setTimeout(() => {
						setLoading(false);
					}, 2000);

					printer
						.align("ct")
						.style("normal")
						.size(1, 1)
						.style("b")
						.text("CASINO CENTRAL")
						.feed(1)
						.size(0, 0)
						.text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
						.feed(1)
						.size(2, 3)
						.text("VALE EN EFECTIVO")
						.feed(1)
						.feed(1)
						.raster(Hardware.Device.Printer.makeBarcode(formatBcode))
						.feed(1)
						.size(0, 0)
						.text(`${ticketData?.Barcode}`)

						.feed(2)
						.size(1, 0)
						.text(date)
						.feed(1)
						.size(2, 2)
						.text(`$${parsedValue} ARS`)
						.feed(1)
						.size(0, 0)
						.tableCustom(
							[
								{
									text: "VALIDO POR ",
									align: "CENTER",
									width: 1,
								},
								{
									text: `MAQUINA N° `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.tableCustom(
							[
								{
									text: "30 DIAS",
									align: "CENTER",
									width: 1,
								},
								{
									text: `${ticket?.PrintedIn}`,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)

						.align("lt")
						.feed(2)
						.text(`CREADO POR:                             FIRMA`)
						.feed(1)
						.text(`${decoded.Profile.FullName}`)
						.text("________________________________________________")
						.feed(2)
						.text("AUTORIZADO POR:                         FIRMA")
						.feed(2)
						.text("________________________________________________")

						.align("ct")
						.feed(2)
						.size(1, 0)
						.text("Solo cobrar por caja")

						.feed(2)
						.size(0, 0)
						.text(`${"Re-impresion N°" + count}`);

					finishPrint();
				}),
			(onError) => {
				console.log("ERROR Asking for printer", onError);
				NotifyUser.Error("Problemas comunicando con la impresora.");
			}
		);
	};

	const handleOpenModal = () => {
		if (Hardware.Device.Printer.status() === true) {
			setShowModal(true);
		} else {
			NotifyUser.Error("Problemas comunicando con la impresora.");
		}
	};

	const handlePrint = () => {
		Post(`/ticket/v1/replace`, {
			ID: ticket.ID,
			Notes: motive,
			Barcode: ticket.Barcode,
		})
			.then(({ data }) => {
				setCount((prevState) => prevState + 1);
				setTicketData(data);
				handlePrintTicket(data);
				setLoading(true);
				setTimeout(() => {
					setLoading(false);
				}, 2000);
				setOpenConfirm(true);
				handleClose();
			})
			.catch((err) => {
				NotifyUser.Error("El ticket ya fue reemplazado por muleto");
				console.log(err);
			});
	};

	const handleClose = () => {
		setShowModal(false);
	};

	const handleCancelOperation = () => {
		setTicket("");
		navigate("/egm-operation-manager");
	};

	const styles = {
		button: {
			fontSize: "13px",
			padding: "1rem",
			width: "75%",
			display: count >= 1 && "none",

			color: "third.main",
			backgroundColor: "secondary.main",
			"&:hover": {
				backgroundColor: "#222422",
			},
		},
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					gap: "30rem",
					alignItems: "center",
				}}
			>
				<Button
					variant="contained"
					handleCancelOperation
					onClick={handleCancelOperation}
					sx={styles.button}
				>
					Cancelar
				</Button>
				<Box sx={{ textAlign: "center" }}>
					<LoadingButton
						variant="contained"
						loading={loading}
						onClick={handleOpenModal}
						sx={{
							backgroundColor: "primary.main",
							display: count >= 1 && "none",
							width: "12rem",
						}}
						startIcon={<PrintIcon />}
					>
						{" "}
						Reemplazar por <br />
						Ticket Muleto
					</LoadingButton>
				</Box>
			</Box>
			<MotiveModal
				title={"Escriba el motivo de reemplazo de Ticket Muleto"}
				openMotive={showModal}
				onClose={handleClose}
				onChange={setMotive}
				onClick={handlePrint}
				exitText={"Cancelar"}
				confirmText={"Confirmar"}
				condition={motive.length > 20}
			/>
			<AfterPrint
				count={count}
				setCount={setCount}
				openConfirm={openConfirm}
				loading={loading}
				ticketData={ticketData}
				handlePrintTicketAgain={handlePrintTicketAgain}
			/>
		</>
	);
};

export default VerifiedTicketPaper;
