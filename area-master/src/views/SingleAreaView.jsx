import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";

const array = {
  Layout:
    "https://cdn.milenio.com/uploads/media/2022/08/10/los-mejores-casinos-online.jpg",
  MaxParent: { Nombre: " Primer Piso", Jurisdiccion: "Casino Mar del Plata" },
  Nombre: "Restaurante",
  Telefono: "1154879",
  Dirección: "Bermudez 2808",
};
const SingleAreaView = () => {
  return (
    <Grid container component={Paper} sx={{ margin: "0 auto", width: "80%" }}>
      <Grid container>
        <Grid
          item
          sx={{
            margin: "0 auto",
            bgcolor: "grey",
            width: "60%",
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {Object.keys(array).map((key) => {
            if (key === "Layout") {
              return (
                <Box sx={{ width: "15%" }} component="img" src={array[key]} />
              );
            }

            if (typeof array[key] === "object") {
              Object.keys(array[key]).map((subKey) => (
                <>
                  <Typography>{subKey}</Typography>
                  <Typography>{array[key][subKey]}</Typography>
                </>
              ));
            } else {
              return (
                <>
                  <Typography>{key}</Typography>
                  <Typography>{array[key]}</Typography>
                </>
              );
            }
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

/*     {Object.keys(array).map((key) => {
            if (typeof array[key] === "object") {
              Object.keys(array[key]).map((subKey) => (
                <>
                  <Typography>{subKey}</Typography>
                  <Typography>{array[key][subKey]}</Typography>
                </>
              ));
            }
          })} */
export default SingleAreaView;
