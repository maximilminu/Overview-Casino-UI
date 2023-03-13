import { Container, Paper, Typography } from "@mui/material";
import React from "react";

const Home = ({ users }) => {
  const today = new Date();
  const hour = today.toLocaleString().split(",");

  return (
    <Container sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
      className="home-paper"
        sx={{

          width: "20vw",
          height: "20vh",
          backgroundColor: "secondary.main",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "white", fontSize: "50px" }}>
          {hour[1]}
        </Typography>
        <Typography sx={{ color: "white", fontSize: "30px" }}>
          {hour[0]}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
