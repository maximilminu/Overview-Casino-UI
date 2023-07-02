import React from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import ImageCrupier from "./ImageCrupier";
import Form from "./Form";
import LogoLeft from "./LogoLeft"
import LogoRight from "./LogoRight"

const CardLogin2 = () => {

  return (
    <Grid container sx={{ width:"100%", height:"100%", display:"flex", flexDirection:"column"}}>
      <Grid item sx={{width:"100%", height: {xl:"15%", sm:"20%", xs: "15%"}, display:"flex", justifyContent:"space-between", alignItems: "center", paddingX:"15px"}}>
        <LogoLeft />
        <LogoRight />
      </Grid>
      <Grid item sx={{width:"100%", height:{xl:"85%", sm:"80%", xs:"85%"}, display:"flex", alignItems: "flex-start",justifyContent: "center"}}>
        <Box sx={{ width:{xl:"25%", lg: "30%", md:"50%", sm:"60%", xs:"80%"},  borderRadius: "3%", height: {xl: "85%", lg:"90%", sm:"90%", md:"80%", xs:"90%"}, background: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Grid item sx={{width:"75%", height:"95%", display: "flex", justifyContent: "flex-start", flexDirection:"column", alignItems:"center", paddingTop:{xl:"40px", xs:"15px"}, gap:{xl:"5%", lg:"15px", md:"20px", xs: "15px"}}}>
            <ImageCrupier />
            <Typography sx={{color:"white", fontSize:{xl:"55px", md:"45px", xs:"40px"}}}>Iniciar Sesión</Typography>
            <Form /> 
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CardLogin2;
