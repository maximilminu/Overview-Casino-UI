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
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle sx={{ color: "black" }} >
          {title}
        </DialogTitle>
        <DialogContent>
         {content && <DialogContentText>
            {content}
          </DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} >
            No
          </Button>
          <Button onClick={onConfirm} variant="contained" >
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ConfirmDialog;
