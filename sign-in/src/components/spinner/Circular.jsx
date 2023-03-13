import React from "react";
import { CircularProgress } from "@material-ui/core";
import { Box } from "@mui/material";

const loaderBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
};
const Circular = () => {
  return (
    <Box sx={loaderBoxStyle}>
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default Circular;
