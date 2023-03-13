import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ConfigContext } from "../context/ConfigProvider";

const LogoRight = () => {
  const theme = useTheme();
  const config = useContext(ConfigContext);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const LogoBoxStyle = {
    display: !matches && "flex",
    position: matches && "absolute",
    marginInline: !matches && "auto",
    top: matches && 0,
    right: matches && "50px",
    width: "200px",
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
