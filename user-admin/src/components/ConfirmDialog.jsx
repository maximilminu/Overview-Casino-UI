import React, { useContext } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { PrinterContext } from "../context/EscPosPrinterContext";

const ConfirmDialog = ({ setShowConfirmDialog, showConfirmDialog }) => {
	const { Printer } = useContext(PrinterContext);
	const handleClose = () => {
		setShowConfirmDialog(false);
	};

	const handleConfirmPetition = () => {
		//solicitud post al back para confirmar la solicitud
		setTimeout(() => {
			Printer.print();
		}, [2500]);
		setShowConfirmDialog(false);
	};

	return (
		<Dialog
			open={showConfirmDialog}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				¿Estás seguro de reiniciar la clave?
			</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					El usuario a partir de este momento no podrá volver a loguearse.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancelar</Button>
				<Button onClick={handleConfirmPetition} autoFocus>
					Confirmar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
