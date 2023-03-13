import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarcodeReaderContext } from "../context/BarcodeReaderContext";
import {
  TextField,
  CircularProgress,
  InputAdornment,
  Backdrop,
  IconButton,
  Button,
  Grid,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { NotifyUserContext } from "../context/NotifyUserContext";
import { Container } from "@mui/system";
import { ApiContext } from "../context/ApiContext";
import ListTickets from "../component/ListTickets";
import Ticket from "../component/Ticket";
import { Cancel } from "@mui/icons-material";
import { TclPrinterContext } from "../context/TclPrinterContext";
import { FormatLocalCurrency } from "../utils/Intl";

const Pay = ({ userMenuRef }) => {
  const { Get, Put, Post } = useContext(ApiContext);
  const { BarcodeReader } = useContext(BarcodeReaderContext);
  // eslint-disable-next-line
  const { Printer } = useContext(TclPrinterContext);
  const NotifyUser = useContext(NotifyUserContext);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [payedTicket, setPayedTicket] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [retAmount, setRetAmount] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [thereArePayedTickets, setThereArePayedTickets] = useState(false);
  const [payInProcess, setPayInProcess] = useState(false);
  const navigate = useNavigate();
  const [changeTicket, setChangeTicket] = useState();

  const style = {
    inputField: {
      width: "100%",
      margin: "0 auto",
      label: {
        color: "white",
      },
      input: {
        color: "primary.light",
        borderColor: "primary.light",
      },
    },
  };

  // userMenuRef.current = [
  //   {
  //     caption: "Hacer arqueo",
  //     action: () => {
  //       handleTicketNumberClean();
  //       navigate("/register");
  //     },
  //   },
  // ];

  useEffect(() => {
    if (thereArePayedTickets) {
      handleTicketNumberClean();
      return;
    }
    if (BarcodeReader.data) {
      console.log(BarcodeReader.data, "data");
      if (BarcodeReader.data.length !== 18) {
        NotifyUser.Info("Error leyendo el ticket, reintente.");
      } else {
        setTicketNumber(BarcodeReader.data);
      }
      BarcodeReader.clear();
    }
    // eslint-disable-next-line
  }, [BarcodeReader.data]);

  useEffect(() => {
    if (ticketNumber.length === 18) {
      if (
        tickets.filter((t) => t.Barcode.replaceAll("-", "") === ticketNumber)
          .length
      ) {
        NotifyUser.Error("Ticket ya escaneado.");
        setTicketNumber("");
        return;
      }
      setLoadingTicket(true);
      Get("/ticket/v1/by-number/" + ticketNumber)
        .then((data) => {
          setLoadingTicket(false);
          if (data.RedeemedAt) {
            setPayedTicket(data);
            setThereArePayedTickets(true);
          } else {
            const ID = data.ID.toString();
            Put("/ticket/v1/prepare-payment", {
              ID: ID,
              Status: true,
            }).catch((err) => console.log(err));
            const tks = [...tickets, data];
            setTickets(tks);
            const tot = tks.reduce((prev, curr) => prev + curr.Amount, 0);
            const pay = Math.floor(tot / 100) * 100;
            setTotalAmount(tot);
            setPayAmount(pay);
            setRetAmount(tot - pay);
            setTicketNumber("");
          }
        })
        .catch((err) => {
          console.log("ERR", err);
          switch (err.response.status) {
            case 404:
              NotifyUser.Warning(
                "No se encuentra el ticket en la base de datos."
              );

              break;
            default:
              NotifyUser.Warning(
                "Problemas con el servicio de api ticket, por favor llame al 0800-TecnoAzar"
              );
          }
          setLoadingTicket(false);
        });
    }
    // eslint-disable-next-line
  }, [ticketNumber]);

  const handleRemoveTicket = (ticket) => {
    const ID = ticket.ID.toString();
    Put("/ticket/v1/prepare-payment", {
      ID: ID,
      Status: false,
    }).catch((err) => console.log(err));

    const tks = [...tickets].filter((t) => t.ID !== ticket.ID);
    setTickets(tks);
    const tot = tks.reduce((prev, curr) => prev + curr.Amount, 0);
    const pay = Math.floor(tot / 100) * 100;
    setTotalAmount(tot);
    setPayAmount(pay);
    setRetAmount(tot - pay);
  };

  const handleTicketNumberChange = (ev) => {
    const value = ev.target.value;
    setTicketNumber(value);
  };

  const handleTicketNumberClean = () => {
    setTicketNumber("");
    setPayedTicket(false);
    setThereArePayedTickets(false);
  };

  const handlePay = () => {
    const vuelto = parseFloat(retAmount.toFixed(2));
    Post("/register/v1/cashier", {
      TicketsArray: tickets,
      TicketDeVuelto: { Amount: vuelto },
    })
      .then((res) => {
        setChangeTicket(res);
        setPayInProcess(true);

        if (retAmount > 0.1) {
          Printer.print({
            barCode: `${res.Barcode}`,
            side: "Ticket de vuelto",
            validityDays: 30,
            value: res.Amount,
            date: Date.now(),
            number: 9876543210,
            header: "Ticket de Vuelto",
            titleLeft: "Av. Patricio Peralta Ramos 2100",
            titleRight: "Mar Del Plata",
            footer: "No valido para cobrar en caja",
          });
        }
      })
      .catch((IDs) => {
        NotifyUser.Error("Algunos tickets no pueden ser cobrados.");
        console.log("IDs", IDs);
      });
  };

  const handleFinish = () => {
    const ID = changeTicket.ID.toString();
    Put(`/ticket/v1/to-redeem`, { ID: ID })
      .then((res) => {
        setPayInProcess(false);
        setTickets([]);
        setPayAmount(0);
        setRetAmount(0);
        setTotalAmount(0);
        setTicketNumber("");
      })
      .catch((err) => {
        NotifyUser(
          "No se puede autorizar el ticket de vuelto, intente nuevamente."
        );
      });
  };

  return (
    <>
      <Container sx={{ marginTop: "20px" }}>
        <Grid
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          xl={12}
          spacing={2}
          container
        >
          <Grid item md={5} sx={{ flexGrow: 1 }}>
            <Grid
              container
              sx={{
                borderRadius: "5px",
                padding: "15px",
                backgroundColor: "third.main",
              }}
            >
              <Grid
                item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: 1,
                  marginRight: 3,
                }}
              >
                <Typography>Cantidad:</Typography>
                <Typography variant="h4">{tickets.length}</Typography>
              </Grid>
              <Divider orientation="vertical" flexItem />
              <Grid
                item
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography>Total:</Typography>
                <Typography variant="h4">
                  {FormatLocalCurrency(totalAmount)}
                </Typography>
              </Grid>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ marginLeft: 1, marginRight: 3 }}
              />
              <Grid
                item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography>Vuelto:</Typography>
                <Typography variant="h4">
                  {FormatLocalCurrency(retAmount)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={4}>
            <TextField
              focused
              // autoComplete="off"
              sx={style.inputField}
              id="ticket-number"
              label="Número de ticket"
              variant="outlined"
              disabled={loadingTicket || thereArePayedTickets}
              onChange={handleTicketNumberChange}
              value={ticketNumber}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {ticketNumber.length > 1 && (
                      <IconButton onClick={handleTicketNumberClean}>
                        <Cancel />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item>
            <Button
              disabled={payedTicket || tickets.length < 1 || payAmount < 1}
              sx={{
                backgroundColor: "primary.main",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "third.main",
                },
                color: "third.main",
              }}
              variant="contained"
              onClick={handlePay}
            >
              <Typography>Pagar</Typography>
              <Typography variant="h3">
                {FormatLocalCurrency(payAmount)}
              </Typography>
            </Button>
          </Grid>
          {payedTicket ? (
            <Ticket data={payedTicket} />
          ) : (
            <ListTickets tickets={tickets} removeTicket={handleRemoveTicket} />
          )}

          {loadingTicket && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer - 1100,
              }}
              open={loadingTicket}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Grid>
      </Container>

      <Dialog
        open={payInProcess}
        // open={true}
        onClose={() => setPayInProcess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ padding: "50px" }}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle sx={{ fontSize: "25px" }}> Usted ha pagado:</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: "center",
              fontWeight: "700",
              color: "primary.main",
            }}
            variant="h2"
          >
            {FormatLocalCurrency(payAmount)}
          </DialogContentText>
          <DialogContentText sx={{ textAlign: "center" }}>
            Presione terminar para confirmar que se imprimió correctamente el
            ticket de vuelto.
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <Button onClick={() => setPayInProcess(false)}>Cancelar</Button>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": { backgroundColor: "secondary.main" },
              width: "80%",
            }}
            onClick={handleFinish}
          >
            Re-imprimir ticket
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "primary.main", width: "100%" }}
            onClick={handleFinish}
          >
            Terminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pay;
