import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";

const VerificationCodeDialog = () => {
  const [openModalVerification, setOpenModalVerification] = useState(true);
  const NotifyUser = useContext(NotifyUserContext);
  const [codeVerificationChange, setCodeVerificationChange] = useState("");
  const { Get } = useContext(ApiContext);
  const navigate = useNavigate();
  const [disabledButton, setDisableButton] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    Get(`/network-device/v1/by-code/${codeVerificationChange}`)
      .then(({ data }) =>
        navigate(`/network-devices/list/${data.Type}/setup/${data.ID}`)
      )
      .catch((err) => {
        if (err.response.status === 404) {
          NotifyUser.Warning(
            "No se han encontrados dispositivos que coincidan con tu búsqueda."
          );
        }
      });
  };

  const handleInputChange = (e) => {
    if (e.target.value.length >= 4) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
    setCodeVerificationChange(e.target.value);
  };

  return (
    <Dialog sx={{ zIndex: 250 }} open={openModalVerification}>
      <form>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <DialogContentText>
            Ingresa el código de verificación para poder registrar el nuevo
            dispositivo.
          </DialogContentText>
          <TextField
            onChange={handleInputChange}
            autoFocus
            id="code"
            label="Código de verificación"
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModalVerification(false);
              navigate("/network-devices/list/1");
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={disabledButton}
            variant="contained"
            onClick={(e) => handleSubmit(e)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VerificationCodeDialog;
