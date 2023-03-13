import React, { useContext, useState } from "react";
import { Button, Box } from "@mui/material";

import { TicketDataCOntext } from "../context/TicketData";
import {
	EscPosPrinterContext,
	PRINTER_STATUS_OFFLINE,
} from "../context/EscPosPrinterContext";
import { NotifyUserContext } from "../context/NotifyUserContext";
import DialogConfirm from "./DialogConfirm";
import { LoadingButton } from "@mui/lab";
import MotiveModal from "./MotiveModal";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router";
const VerifiedTicketPaper = ({ formatShortMonth, parseDate }) => {
	const [showModal, setShowModal] = useState(false);
	const [date, setDate] = useState();
	const [ticketData, setTicketData] = useState();
	const [motive, setMotive] = useState("");
	const [open, setOpen] = useState(false);
	const [count, setCount] = useState(1);
	const [loading, setLoading] = useState(false);
	const { ticket, setTicket } = useContext(TicketDataCOntext);
	const { Post } = useContext(ApiContext);
	const { Printer } = useContext(EscPosPrinterContext);
	const NotifyUser = useContext(NotifyUserContext);

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

		Printer.print(
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
						.feed(1)
						.barcode(`${formatBcode}`, "ITF", {
							width: 2,
							position: "off",
						})
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

						.feed(2)
						.tableCustom(
							[
								{
									text: "AUTORIZA:",
									align: "CENTER",
									width: 1,
								},
								{
									text: `LEGAJO: `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.feed(1)
						.tableCustom(
							[
								{
									text: "______________",
									align: "CENTER",
									width: 1,
								},
								{
									text: "______________",
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
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
		setCount((prevState) => prevState + 1);

		Printer.print(
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
						.feed(1)
						.barcode(`${formatBcode}`, "ITF", {
							width: 2,
							position: "off",
						})
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

						.feed(2)
						.tableCustom(
							[
								{
									text: "AUTORIZA:",
									align: "CENTER",
									width: 1,
								},
								{
									text: `LEGAJO: `,
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
						.feed(1)
						.tableCustom(
							[
								{
									text: "______________",
									align: "CENTER",
									width: 1,
								},
								{
									text: "______________",
									align: "CENter",
									width: 1,
								},
							],
							"cp857"
						)
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
		if (!Printer.status === PRINTER_STATUS_OFFLINE) {
			setShowModal(true);
		} else {
			NotifyUser.Error("Problemas comunicando con la impresora.");
		}
	};

	const handlePrint = () => {
		Post(`/ticket/v1/replace`, { ID: ticket.ID, Notes: motive })
			.then((res) => {
				setCount((prevState) => prevState + 1);
				setTicketData(res);
				handlePrintTicket(res);
				handleClose();
			})
			.catch((err) => {
				NotifyUser.Error("El estado del ticket no fue actualizado");
				console.log(err);
			});
	};

	const handleClose = () => {
		setShowModal(false);
	};

	const handleDonePrinting = () => {
		setTimeout(() => {
			setOpen(true);
		}, 300);
	};

	const handleCancelOperation = () => {
		setTicket("");
		navigate("/egm-operation-manager");
	};

	const styles = {
		button: {
			fontSize: count > 1 ? "20px" : "13px",
			width: count > 1 ? "80%" : "60%",
			height: count > 1 && "4rem",
			color: "third.main",
			backgroundColor: count > 1 ? "#318b35f0" : "secondary.main",
			"&:hover": {
				backgroundColor: count > 1 ? "#226126" : "#222422",
			},
		},
	};

	return (
		<>
			<DialogConfirm
				setOpen={setOpen}
				open={open}
				ticketData={ticketData}
				setCount={setCount}
			/>
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
					onClick={count > 1 ? handleDonePrinting : handleCancelOperation}
					sx={styles.button}
				>
					{count > 1 ? "Confirmar Operación" : "Cancelar"}
				</Button>
				<LoadingButton
					variant="contained"
					loading={loading}
					onClick={count > 1 ? handlePrintTicketAgain : handleOpenModal}
					sx={{
						backgroundColor: "primary.main",
						fontSize: count > 1 ? "15px" : "20px",
						width: "80%",
						height: count > 1 && "3rem",
					}}
				>
					{count >= 2
						? "Re-imprimir Ticket Muleto"
						: "Reemplazar por Ticket Muleto"}
				</LoadingButton>
			</Box>
			<MotiveModal
				title={"Escriba el motivo de reemplazo de Ticket Muleto"}
				open={showModal}
				onClose={handleClose}
				onChange={setMotive}
				onClick={handlePrint}
				exitText={"Cancelar"}
				confirmText={"Confirmar"}
				// condition={motive.length > 20}
			/>
		</>
	);
};

export default VerifiedTicketPaper;
