import React from "react";
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = React.memo(
  ({ open, onClose, onConfirm, onCancel, title, content }) => {
    return (
      <Dialog
        open={open}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-confirmdelete-title"
        aria-describedby="alert-dialog-confirmdelete-description"
      >
        <DialogTitle sx={{ color: "black" }}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "primary.main" }}>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "secondary.main" }}>
            No, cancelar.
          </Button>
          <Button onClick={onConfirm} variant="contained">
            ¡Sí, proceder!
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ConfirmDialog;
