import React from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Modal,
  IconButton,
  TextField,
  Box,
  InputLabel,
  Paper,
  Button,
  Typography,
} from "@mui/material";

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

const AddRoleModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: "white", padding: "1px" }}>
        <AddIcon align="center" size="35px" />
      </IconButton>
      <Modal padding="50px" open={open} onClose={handleClose}>
        <Box sx={style.modal}>
          <Box sx={{ position: "relative", top: "30px" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              height="20px"
              sx={style.box}
            >
              <Typography sx={style.tableCellTitle}>Nuevo rol</Typography>
            </Box>
          </Box>
          <Paper sx={{ padding: "50px", boxShadow: "none" }}>
            <InputLabel sx={{ marginBottom: "-10px" }}>Nombre:</InputLabel>
            <TextField
              margin="normal"
              fullWidth
              sx={{ marginBottom: "15px" }}
              //   onChange={handleChange}
              color="secondary"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              aria-label="add"
              //   onChange={handleSubmit}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
            >
              Agregar
            </Button>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

export default AddRoleModal;
