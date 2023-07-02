import { Box } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";

const LogoRight = () => {
  const config = useContext(ConfigContext);

  const LogoBoxStyle = {
    width: { xl: "200px", lg: "200px", md: "200px", sm: "200px", xs: "150px" },
    height: "115px",
    objectFit: "contain",
  };

  return (
    <Box
      component="img"
      alt="logo tecnoazar"
      sx={LogoBoxStyle}
      src={config.LogoRight}
    />
  );
};

export default LogoRight;
