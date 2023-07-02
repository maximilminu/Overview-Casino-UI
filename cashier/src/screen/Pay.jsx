import React, { useState, useContext, useEffect } from "react";
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
import { NotifyUserContext } from "@oc/notify-user-context";
import { Container } from "@mui/system";
import { ApiContext } from "@oc/api-context";
import ListTickets from "../component/ListTickets";
import Ticket from "../component/Ticket";
import { Cancel } from "@mui/icons-material";
// import { TclPrinterContext } from "../context/TclPrinterContext";
import { FormatLocalCurrency, FormatLocalDateTime, FormatLocalTime } from "../utils/Intl";
import { HardwareContext } from "@oc/hardware-context";
import { useLayoutEffect } from "react";
// eslint-disable-next-line
const Pay = ({ userMenuRef }) => {
  const { Get, Put, Post } = useContext(ApiContext);
  // eslint-disable-next-line
  const NotifyUser = useContext(NotifyUserContext);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [payedTicket, setPayedTicket] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [retAmount, setRetAmount] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [thereArePayedTickets, setThereArePayedTickets] = useState(false);
  const [ notPayableTicket, setNotPayableTicket ] = useState({})
  const [payInProcess, setPayInProcess] = useState(false);
  const [ thereIsNotPayableTicket, setThereIsNotPayableTicket ] = useState(false)
  // eslint-disable-next-line
  const [changeTicket, setChangeTicket] = useState();
  const Hardware = useContext(HardwareContext);

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

  useLayoutEffect(() => {
    if (thereArePayedTickets) {
      handleTicketNumberClean();
      return;
    }

    if (Hardware.Device.BarcodeScanner === undefined ||Hardware.Device.BarcodeScanner.status() !== true ) {
      NotifyUser.Error("Problemas comunicando con el scanner.")
      return;
    }

    return Hardware.Device.BarcodeScanner.onDataListener((data) => {
      if (data) {
        if (data.length === 19) {
          const number = data.toString();
          const ticket = number.substring(0, number.length - 1);
          setTicketNumber(ticket);
        } else if (data.length === 18) {
          setTicketNumber(data);
        } else {
          NotifyUser.Info("Error leyendo el ticket, reintente.");
        }
        Hardware.Device.BarcodeScanner.clear();
      }
    });

    // eslint-disable-next-line
  }, []);

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
        .then(({ data }) => {
          setLoadingTicket(false);
          if (data.RedeemedAt) {
            setPayedTicket(data);
            setThereArePayedTickets(true);
            return
          } else {
            const ID = data.ID.toString();
            Put("/ticket/v1/prepare-payment", {
              ID: ID,
              Status: true,
            }).then(() => {
              const tks = [...tickets, data];
              setTickets(tks);
              const tot = tks.reduce((prev, curr) => prev + curr.Amount, 0);
              const pay = Math.floor(tot / 100) * 100;
              setTotalAmount(tot);
              setPayAmount(pay);
              setRetAmount(tot - pay);
              setTicketNumber("");
              setThereIsNotPayableTicket(false);
              setNotPayableTicket({})
            })
            .catch((err) => {
              if(err.response.data.Error === "TICKET_STATUS_UNAUTHORIZED"){
                setThereIsNotPayableTicket(true);
                setNotPayableTicket(data);
                return;
              }
            }
            );
        
          }
        })
        .catch((err) => {
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


  console.log(notPayableTicket)
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
    setNotPayableTicket({});
    setThereIsNotPayableTicket(false);
  };

  const handlePay = () => {
    if(Hardware.Device.TclPrinter.status() === true){ 
    const vuelto = parseFloat(retAmount.toFixed(2));
    Post("/register/v1/cashier", {
      TicketsArray: tickets,
      TicketDeVuelto: { Amount: vuelto },
    })
      .then(({ data }) => {
        setChangeTicket(data);
        setPayInProcess(true);

        if (retAmount > 0.1) {
           Hardware.Device.TclPrinter.print(
          {
            side: "Ticket",
            validityDays: 125,
            H3: "Ticket de Demo",
            SH1: "Terminal",
            SH2: "de test",
            H1: "OVERVIEW.CASINO",
            BC1:"VALIDATION",
            BC2: data.Barcode,
            BBC1: FormatLocalDateTime(Date.now()),
            BBC2: FormatLocalTime(Date.now()),
            BBC3: `Vale ${data.ID}`,
            D1: "",
            D2: "",
            H2: `$${data.Amount}`,
            F1: "30 dias",
            F2: "No válido para cobrar por caja",
            Number: 9876543211,
          }

        );
        }
      })
      .catch((IDs) => {
        NotifyUser.Error("Algunos tickets no pueden ser cobrados.");
      })
    } else {
      NotifyUser.Error("Problemas para comunicarse con la impresora. ")
    }
  };

  const reImprimir = () => {
    if (retAmount > 0.1) {
      Hardware.Device.TclPrinter.print(
     {
       side: "Ticket",
       validityDays: 125,
       H3: "Ticket de Demo",
       SH1: "Terminal",
       SH2: "de test",
       H1: "OVERVIEW.CASINO",
       BC1:"VALIDATION",
       BC2: changeTicket.Barcode,
       BBC1: FormatLocalDateTime(Date.now()),
       BBC2: FormatLocalTime(Date.now()),
       BBC3: `Vale ${changeTicket.ID}`,
       D1: "",
       D2: "",
       H2: `$${changeTicket.Amount}`,
       F1: "30 dias",
       F2: "No válido para cobrar por caja",
       Number: 9876543211,
     }

   );
   }
  };

  const handleFinish = () => {
    setPayInProcess(false);
    setTickets([]);
    setPayAmount(0);
    setRetAmount(0);
    setTotalAmount(0);
    setTicketNumber("");
    const ID = changeTicket.ID.toString();
    Put(`/ticket/v1/to-redeem`, { ID: ID })
      .then((data) => {
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
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
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
              <Divider orientation="vertical" flexItem sx={{ margin: 1 }} />
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
              <Typography variant="h4">
                {FormatLocalCurrency(payAmount)}
              </Typography>
            </Button>
          </Grid>
          {payedTicket || thereIsNotPayableTicket  ? (
            <Ticket payedTicket={payedTicket && payedTicket} notPayableTicket={notPayableTicket && notPayableTicket} thereIsNotPayableTicket={thereIsNotPayableTicket} thereArePayedTickets={thereArePayedTickets}  />
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
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": { backgroundColor: "secondary.main" },
              width: "80%",
            }}
            onClick={reImprimir}
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
