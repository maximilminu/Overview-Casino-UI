import React from "react";
import Alert from "@mui/material/Alert";
import { AlertTitle, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorAlert = ({ message }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar sx={{ margin: "0 auto" }} open={open} onClose={handleClose}>
        <Alert
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ margin: "0 auto", width: "100%" }}
          severity="error"
        >
          <AlertTitle>
            <strong> Error</strong>
          </AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ErrorAlert;
