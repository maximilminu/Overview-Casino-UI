import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Roulette from "./Spinner/Roulette";
import { Box } from "@mui/system";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DialogConfirm from "./DialogConfirmPrint";
import { Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

const styles = {
	box: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
	},
	confirm: { marginBottom: "4rem", padding: "1rem" },
};

export default function DraggableDialog({
	openConfirm,
	setCount,
	loading,
	ticketData,
	handlePrintTicketAgain,
}) {
	const [openMotive, setOpenMotive] = React.useState(false);

	return (
		<>
			<DialogConfirm
				setOpenMotive={setOpenMotive}
				openMotive={openMotive}
				ticketData={ticketData}
				setCount={setCount}
			/>
			<Dialog
				open={openConfirm}
				TransitionComponent={Transition}
				PaperComponent={PaperComponent}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle
					style={{ cursor: "move", textAlign: "center", fontWeight: "bold" }}
					id="draggable-dialog-title"
				>
					{loading ? "Finalizando Impresión" : "Impresión finalizada"}
				</DialogTitle>
				<DialogContent sx={{ padding: "4rem" }}>
					<DialogContentText>
						<Box sx={{ padding: "2rem" }}>
							{loading ? (
								<Roulette />
							) : (
								<Box sx={styles.box}>
									<Button
										variant="contained"
										sx={styles.confirm}
										endIcon={<AssignmentTurnedInIcon />}
										onClick={() => setOpenMotive(true)}
									>
										{" "}
										Confirmar operación
									</Button>
									<Button
										variant="outlined"
										endIcon={<KeyboardReturnIcon />}
										onClick={handlePrintTicketAgain}
									>
										Re-Imprimir Ticket
									</Button>
								</Box>
							)}
						</Box>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</>
	);
}
