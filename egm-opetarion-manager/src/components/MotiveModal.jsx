import React from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function MotiveModal({
	title,
	openMotive,
	onClose,
	onChange,
	onClick,
	exitText,
	confirmText,
	condition,
}) {
	const validate = () => {
		if (condition === undefined) return true;
		return condition;
	};

	return (
		<Dialog
			open={openMotive}
			onClose={onClose}
			TransitionComponent={Transition}
		>
			<DialogTitle>{title || "Motivo"}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					multiline
					rows={2}
					label="Motivo"
					margin="dense"
					id="name"
					onChange={(e) => onChange(e.target.value)}
					fullWidth
					variant="filled"
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>{exitText || "Cancelar"}</Button>
				<Button
					sx={{ backgroundColor: "secondary.main" }}
					variant="contained"
					disabled={typeof condition === "undefined" ? false : !validate()}
					onClick={onClick}
				>
					{confirmText || "Confirmar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default MotiveModal;
