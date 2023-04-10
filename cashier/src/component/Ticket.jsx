import { Grid, Paper, Typography } from "@mui/material";
import Barcode from "react-barcode";

const Ticket = ({ data }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: "white",
        color: "black",
        maxWidth: "700px",
        position: "relative",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "30px",
        marginTop: "15px",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3">CASINO CENTRAL</Typography>
        </Grid>
        <Grid item>
          <Typography>Av. Patricio Peralta Ramos 2100 Mar del Plata</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h2">TICKET YA PAGADO</Typography>
        </Grid>
        <Grid item>
          <Barcode value={data.Barcode} />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item>
            <Typography>{new Date(data.PrintedAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h3">{data.Amount} ARS</Typography>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ marginBottom: "-20px" }}
        >
          <Grid item>
            <Typography>VALIDO POR 30 DÍAS</Typography>
          </Grid>
          <Grid item>
            <Typography>MAQUÍNA NRO {data.PrintedIn}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Typography
        sx={{
          background: "red",
          padding: "5px",
          textAlign: "center",
          borderRadius: "5px",
          color: "white",
          position: "absolute",
          top: "43%",
          left: "33%",
        }}
      >
        PAGADO por
        <br />
        {(data.RedeemedBy || {}).FullName}
        <br />
        el {new Date(data.RedeemedAt).toLocaleString()}
      </Typography>
    </Paper>
  );
};

export default Ticket;
