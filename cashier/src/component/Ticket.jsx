import { Grid, Paper, Typography } from "@mui/material";
import Barcode from "react-barcode";

const Ticket = (props) => {
  console.log(props)
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
          <Typography variant={props.thereArePayedTickets ? "h2" : "h4"}>{props.thereArePayedTickets ? "TICKET YA PAGADO" : "TICKET NO DISPONIBLE PARA PAGO"}</Typography>
        </Grid>
        <Grid item>
          <Barcode value={props.payedTicket.Barcode || props.notPayableTicket.Barcode} />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item>
            <Typography>{new Date(props.payedTicket.PrintedAt || props.notPayableTicket.PrintedAt ).toLocaleString()}</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h3">{props.payedTicket.Amount || props.notPayableTicket.Amount} ARS</Typography>
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
            <Typography>MAQUÍNA NRO {props.payedTicket.PrintedIn || props.notPayableTicket.PrintedIn}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"red", marginTop:"30px",borderRadius: "5px", }}>

      <Typography
        sx={{
         
          textAlign: "center",
        
          color: "white",
          
        }}
      >
        {props.thereArePayedTickets && "Pagado por Jonatán Schijman"}
        {props.thereIsNotPayableTicket &&  "Este ticket no puede ser pagado"}
        {props.thereArePayedTickets && ` el ${new Date(props.payedTicket.RedeemedAt || props.notPayableTicket.RedeemedAt).toLocaleString()}`}
      </Typography>
      </Grid>
  
    </Paper>
  );
};


/*    <Typography
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
        {props.notPayableTicket ? "Este ticket no puede ser pagado" : "Pagado por Jonatán Schijman"}
       
        {props.payedTicket && `el ${new Date(props.payedTicket.RedeemedAt || props.notPayableTicket.RedeemedAt).toLocaleString()}`}
      </Typography> */ 
export default Ticket;
