import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const DialogLogInSupervisor = ({
  open,
  passwordChange,
  emailChange,
  onContinue,
}) => {
  return (
    <Dialog fullWidth={true} maxWidth="xs" open={open}>
      <form>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            width: "100%",
          }}
        >
          <DialogTitle sx={{ padding: "0px" }}>
            Supervisor, ingresa usuario y contraseña por favor.
          </DialogTitle>

          <TextField
            onChange={(e) => emailChange(e.target.value)}
            label="Usuario"
            variant="outlined"
          />
          <TextField
            type="password"
            onChange={(e) => passwordChange(e.target.value)}
            label="Contraseña"
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button
            sx={{ marginBottom: "10px" }}
            onClick={() => {
              onContinue();
            }}
            autoFocus
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DialogLogInSupervisor;
