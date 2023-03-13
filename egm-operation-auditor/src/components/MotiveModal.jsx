import React, { useState } from "react";
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
    
  const [showDisableButton, setShowDisableButton] = useState(true);

  const contador = (e) => {
    if (e.target.value.length >= 25) {
      setShowDisableButton(false);
    } else {
      setShowDisableButton(true);
    }
    onChange(e.target.value);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{title || "Motivo"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          multiline
          rows={2}
          label="Motivo"
          margin="dense"
          id="name"
          onChange={contador}
          fullWidth
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setShowDisableButton(true);
          }}
        >
          {exitText || "Cancelar"}
        </Button>
        <Button
          disabled={showDisableButton}
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
