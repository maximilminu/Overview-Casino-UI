import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = React.memo(
  ({
    open,
    onConfirm,
    onFinishOperation,
    title,
    textFirstButton,
    textSecondButton,
  }) => {
    return (
      <Dialog
        open={open}
        sx={{ zIndex: (theme) => theme.zIndex.drawer - 200 }}
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-confirmdelete-title">{title}</DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <Button
            onClick={() => onConfirm()}
            autoFocus
            sx={{ width: "50%" }}
            variant="outlined"
          >
            {textFirstButton}
          </Button>
          <Button
            onClick={() => onFinishOperation()}
            sx={{
              width: "70%",
            }}
            autoFocus
            variant="contained"
          >
            {textSecondButton}
          </Button>
        </Box>
      </Dialog>
    );
  }
);

export default ConfirmDialog;
