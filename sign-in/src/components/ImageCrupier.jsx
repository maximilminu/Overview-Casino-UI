import React from "react";
import { Box } from "@mui/material";
import { ConfigContext } from "../context/ConfigProvider";
import { useContext } from "react";
const randomNumber = Math.floor(Math.random() * 2);

const ImageCrupier = () => {
  const config = useContext(ConfigContext);
  const CroupierImages = [
    config.CrupierImages.WomanCrupier,
    config.CrupierImages.ManCrupier,
  ];

  return (
    <Box
      component="img"
      sx={{ height: "130px", width: "140px" }}
      src={CroupierImages[randomNumber]}
    />
  );
};

export default ImageCrupier;
