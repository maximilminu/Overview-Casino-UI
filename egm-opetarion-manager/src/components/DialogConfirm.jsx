import React, { useContext } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router";
import { TicketDataCOntext } from "../context/TicketData";
import { ApiContext } from "../context/ApiContext";

const DialogConfirm = ({ setOpen, open, ticketData, setCount }) => {
	const { setTicket } = useContext(TicketDataCOntext);
	const { Put } = React.useContext(ApiContext);
	const navigate = useNavigate();

	const handleConfirm = () => {
		Put(`/ticket/v1/auth-pending`, { ID: ticketData.ID.toString() })
			.then(() => {
				setTicket("");
				setCount(1);
				navigate("/egm-operation-manager");
			})
			.catch((err) => console.log(err));
	};

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(true)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title" sx={{ padding: "2rem" }}>
				{"¿Seguro que desea terminar?"}
			</DialogTitle>

			<DialogActions
				sx={{
					display: "flex",
					justifyContent: "space-between",
					padding: "2rem",
				}}
			>
				<Button onClick={() => setOpen(!true)}>Cancelar</Button>
				<Button
					onClick={handleConfirm}
					sx={{
						backgroundColor: "secondary.main",
						fontSize: "18px",
						color: "third.main",
						"&:hover": { color: "secondary.main" },
						// width: "100%",
					}}
				>
					Confirmar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogConfirm;
