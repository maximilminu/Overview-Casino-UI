import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

function MotiveModal({
  title,
  open,
  onClose,
  onChange,
  onClick,
  exitText,
  confirmText,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
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
          onClick={onClick}
        >
          {confirmText || "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MotiveModal;
