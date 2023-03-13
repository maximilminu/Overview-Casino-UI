import React from "react";
import {
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ImageCrupier from "./ImageCrupier";
import Form from "./Form";
import "../index.css";

const CardLogin2 = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const style = {
    box: {
      marginTop: {
        xl: "50px",
        lg: "50px",
        md: "50px",
        sm: "100px",
        xs: "50px",
      },
      borderRadius: "3%",
      width: { xl: "40%", lg: "40%", md: "40%", sm: "70%", xs: "100%" },
      marginBottom: { xl: "50px", lg: "50px", md: "50px" },
      height: "35%",
      padding: "50px",
      background: "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
      boxShadow: " 2px 1px 36px 0px rgba(0,0,0,0.75)",
    },
    containerStyle: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "5%",
      position: "relative",
    },
  };

  return (
    <>
      <Container className="background" sx={style.containerStyle}>
        <Box sx={style.box}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="20px"
            sx={{ width: matches ? "70%" : "80%" }}
          >
            <ImageCrupier />
            <Typography
              sx={{
                color: "third.main",
                fontSize: {
                  xs: "29px",
                  sm: "36px",
                  md: "37px",
                  lg: "36px",
                  xl: "41px",
                },
              }}
              gutterBottom
            >
              Iniciar Sesión
            </Typography>
            <Form />
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default CardLogin2;
