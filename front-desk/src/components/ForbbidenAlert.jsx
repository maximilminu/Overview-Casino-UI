import React from "react";
import Alert from "@mui/material/Alert";

const ForbbidenAlert = ({ msg }) => {
  return (
    <Alert severity="error" sx={{ fontWeight: 700 }}>
      {msg}
    </Alert>
  );
};

export default ForbbidenAlert;
