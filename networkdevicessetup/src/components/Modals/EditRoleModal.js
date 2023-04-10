import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import {
  Modal,
  IconButton,
  Box,
  TextField,
  InputLabel,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

const style = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#f5f5f5",
    borderRadius: "2%",
    p: 4,
  },
  box: {
    marginLeft: "16px",
    marginRight: "16px",
    position: "relative",
    top: "-30",
    padding: " 24px 16px",
    opacity: "1",
    borderRadius: "0.5rem",
    boxShadow:
      "rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(0 187 212 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem",
    backgroundColor: "primary.main",
  },
  tableCellTitle: {
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "primary.main",
  },
};

const EditRoleModal = ({ singleRole }) => {
  // eslint-disable-next-line
  const [onChangeRole, setOnChangeRole] = useState();
  const handleChange = (e) => {
    setOnChangeRole(e.target.value);
  };

  const handleDelete = (e) => {};

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MdModeEditOutline />
      </IconButton>
      <Modal
        padding="50px"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.modal}>
          <Box sx={{ position: "relative", top: "30px" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              height="20px"
              sx={style.box}
            >
              <Typography sx={style.tableCellTitle}>Editar rol</Typography>
            </Box>
          </Box>
          <Paper sx={{ padding: "50px", boxShadow: "none" }}>
            <InputLabel sx={{ marginBottom: "-10px" }}>Nombre:</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              onChange={handleChange}
              defaultValue={singleRole.name}
            />
            <InputLabel sx={{ marginBottom: "-10px" }}>
              Cantidad de Dispositivos:
            </InputLabel>
            <TextField
              margin="normal"
              fullWidth
              defaultValue={singleRole.quantity}
            />

            <Button
              type="submit"
              fullWidth
              aria-label="add"
              variant="contained"
              onClick={handleChange}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Modificar
            </Button>
            {singleRole.quantity === 0 && (
              <Button
                type="submit"
                fullWidth
                aria-label="add"
                variant="outlined"
                sx={{
                  mb: 2,
                  color: "black",
                  "&:hover": {
                    color: "black",
                  },
                }}
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

export default EditRoleModal;
