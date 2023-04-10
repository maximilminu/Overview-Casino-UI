import * as React from "react";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
const ErrorModal = ({ message }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fdeded",
    border: "2px solid #ef5350",
    boxShadow: 24,
    outline: "none",
    p: 4,
  };
  return (
    <Modal open={true}>
      <Box sx={style}>
        <Box
          gap="5px"
          display="flex"
          flexDirection="row"
          justifyContent="left"
          alignItems="center"
        >
          <ErrorOutlineIcon color="warning" />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <strong> ERROR </strong>
          </Typography>
        </Box>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
