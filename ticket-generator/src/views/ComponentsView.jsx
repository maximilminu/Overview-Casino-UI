import { useContext, useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  Box,
  Grid,
  Autocomplete,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import moment from "moment";
import NumbersIcon from "@mui/icons-material/Numbers";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import TicketUI from "../components/TicketUI";
import Captcha from "../components/Captcha";
import CreateIcon from "@mui/icons-material/Create";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MuiPickersAdapterContext } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import { HardwareContext } from "@oc/hardware-context";
import PaidIcon from "@mui/icons-material/Paid";
function Home() {
  const dateTimeFormatter = useContext(MuiPickersAdapterContext).utils;
  const { pathname } = useLocation();
  const Hardware = useContext(HardwareContext);
  const [preData, setPreData] = useState({
    Barcode: "",
    Amount: "",
    PrintedAt: dayjs(Date.now()).valueOf(),
    Date: dayjs(Date.now()).valueOf(),
    Notes: "",
    PrintedIn: "",
  });
  const [newData, setNewData] = useState({
    Amount: "",
    Notes: "",
    PrintedIn: "",
  });
  const [machines, setMachines] = useState([]);
  const NotifyUser = useContext(NotifyUserContext);
  const [loading, setLoading] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const AccessToken = localStorage.getItem("AccessToken");
  const token = AccessToken;
  const decoded = token && jwt_decode(token);
  const TokenType = localStorage.getItem("TokenType");
  const { Get, Post, Put } = useContext(ApiContext);
  const [confirmAuthorization, setConfirmAuthorization] = useState(false);
  const url = useLocation();
  const [dateTime, setDateTime] = useState(dayjs(Date.now()));
  const [ticketInfo, setTicketInfo] = useState();
  const [inputAutocomplete, setInputAutocomplete] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  useEffect(() => {
    if (Hardware.Device.BarcodeScanner === undefined) return;
    return Hardware.Device.BarcodeScanner.onDataListener((data) => {
      if (data) {
        if (data.length < 18) {
          NotifyUser.Info("Error leyendo el ticket, reintente.");
        } else {
          setPreData({ ...preData, Barcode: data });
        }
        Hardware.Device.BarcodeScanner.clear();
      }
    });

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (inputAutocomplete) {
      setNewData({ ...newData, PrintedIn: inputAutocomplete });
      setPreData({ ...preData, PrintedIn: inputAutocomplete });
    }
    // eslint-disable-next-line
  }, [inputAutocomplete]);

  useEffect(() => {
    setPreData({
      Barcode: "",
      Amount: 0,
      Date: dayjs(Date.now()).valueOf(),
      Notes: "",
      PrintedIn: "",
      PrintedAt: dayjs(Date.now()).valueOf(),
    });
    setNewData({
      Amount: 0,
      Notes: "",
      PrintedIn: "",
    });
    setInputAutocomplete("");
    setMachineNumber("");
  }, [url]);

  useEffect(() => {}, [ticketInfo]);

  useEffect(() => {
    if (count >= 2) {
      handlePrintTicket(ticketInfo);
    }
    // eslint-disable-next-line
  }, [count]);

  const validate = () => {
    if (disabledButton) {
      return false;
    }
    if (pathname.includes("/ticket/pre-insert")) {
      return (
        preData?.Amount?.toString().length >= 1 &&
        preData?.Date?.toString().length > 6 &&
        preData?.Barcode?.length === 18 &&
        preData?.PrintedIn?.length <= 18 &&
        preData?.Notes?.length >= 20
      );
    } else {
      return (
        newData?.Amount?.toString().length >= 1 &&
        newData?.PrintedIn?.length <= 8 &&
        newData?.Notes?.length >= 20
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const date2 = moment(dateTime);

    if (pathname.includes("/ticket/pre-insert")) {
      if (preData.Barcode[0] !== "0" || preData.Barcode[1] !== "0") {
        NotifyUser.Warning("El código de barras debe comenzar con 00.");
        return;
      }
      if (!date2.isValid()) {
        NotifyUser.Warning("Ingrese una fecha válida");
        return;
      }

      if (dateTime >= today) {
        NotifyUser.Warning("No se pueden ingresar fechas futuras.");
        return;
      }
    }

    if (Hardware.Device.Printer.status() === true) {
      setConfirmAuthorization(true);
    } else {
      NotifyUser.Error("Problemas conectando con la impresora.");
    }
  };

  function correctValidationCaptcha() {
    if (Hardware.Device.Printer.status() === true) {
      if (pathname.includes("/ticket/new-insert")) {
        newData.Amount = Number(newData.Amount);
        Post(`/ticket/v1/create-ticket`, newData)
          .then(({ data }) => {
            setCount((prevState) => prevState + 1);
            setTicketInfo(data);
            const formatBcode = data.Barcode && data.Barcode.replace(/-/g, "");
            setOpenConfirmDialog(true);
            setDisabledButton(true);
            handlePrintTicket(data, formatBcode);
          })
          .catch((err) => {
            NotifyUser.Error("El ticket no fue registrado");
            console.log(err);
          });
      } else {
        preData.Amount = Number(preData.Amount);
        Post(`/ticket/v1/register-ticket`, preData)
          .then(({ data }) => {
            setCount((prevState) => prevState + 1);
            setTicketInfo(data);
            const formatBcode = data.Barcode && data.Barcode.replace(/-/g, "");
            setOpenConfirmDialog(true);
            setDisabledButton(true);
            handlePrintTicket(data, formatBcode);
          })
          .catch((err) => {
            NotifyUser.Error("El ticket no fue registrado");
            console.log(err);
          });
      }
    } else {
      NotifyUser.Error("Problemas comunicando con la impresora.");
    }
    setConfirmAuthorization(false);
    return;
  }

  const onFinish = () => {
    const { ID } = ticketInfo;
    if (ticketInfo?.ID !== undefined) {
      Put(
        `/ticket/v1/auth-pending/`,
        { ID: ID.toString() },
        {
          headers: {
            Authorization: `${TokenType} ${AccessToken}`,
          },
        }
      )
        .then((res) => {
          NotifyUser.Success(
            "¡El estado del ticket fue guardado con éxito! Redirigiendo..."
          );
          setTicketInfo([]);
          setTimeout(() => {
            setOpenConfirmDialog(false);
            navigate("/ticket");
          }, 2500);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            NotifyUser.Error("El ticket ya fue autorizado previamente.");
          } else {
            NotifyUser.Error("Hubo un error finalizando el estado del ticket.");
          }
        });
    } else {
      NotifyUser.Error("No se puede finalizar la operacion.");
    }
  };

  // Cases: Notes - Barcode
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.value.length <= 18) {
      setNewData({ ...newData, [e.target.id]: e.target.value });
      setPreData({ ...preData, [e.target.id]: e.target.value });
    }
  };

  const handleInputChange = (e, newInputValue) => {
    if (preData?.PrintedIn?.length >= 3) {
      setLoadingApi(true);
      Get(`/machines/v1/autocomplete/?ID=${preData?.PrintedIn}`)
        .then(({ data }) => {
          const machineIDs = data.map((machine) => machine.Describe);
          setMachines(machineIDs.flat());
        })
        .catch((err) => console.log(err));
    }
    setInputAutocomplete(newInputValue);
  };

  const handleNoteChange = (e) => {
    e.preventDefault();
    if (e.target.value.length >= 20) {
      setNewData({ ...newData, [e.target.id]: e.target.value });
      setPreData({ ...preData, [e.target.id]: e.target.value });
    }
  };

  const handleTimePicker = (value) => {
    const timeInSeconds = new Date(value);
    setDateTime(timeInSeconds.getTime());
    setPreData({ ...preData, PrintedAt: timeInSeconds.getTime() });
  };

  const handleChangeAmount = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const newValue = value.replace(",", ".").replace(/\.(?=\d*\.)/g, "");
    if (newValue.length <= 15) {
      setNewData({ ...newData, [e.target.id]: newValue });
      setPreData({ ...preData, [e.target.id]: newValue });
    }
  };

  const handleKeyPressAmount = (e) => {
    const allowedChars = /[0-9.,]/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };

  // PRINTS
  const handlePrintTicket = (data) => {
    const value = +data?.Amount;
    const formatBcode = data.Barcode && data.Barcode.replace(/-/g, "");
    const parsedValue = value?.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    });
    const barcodeFormat = data?.Barcode?.replace(
      /(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})/,
      "$1-$2-$3-$4-$5"
    );

    Hardware.Device.Printer.print(
      (printer) =>
        new Promise((finishPrint) => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 5000);
          printer
            .align("ct")
            .style("normal")
            .size(1, 1)
            .style("b")
            .text("CASINO CENTRAL")
            .feed(1)
            .size(0, 0)
            .text("Av. Patricio Peralta Ramos 2100 Mar del Plata")
            .feed(1)
            .size(2, 3)
            .text("VALE EN EFECTIVO")
            .feed(1)
            .feed(1)
            .raster(Hardware.Device.Printer.makeBarcode(formatBcode))
            .feed(1)
            .size(0, 0)
            .text(`${barcodeFormat}`)
            .feed(2)
            .size(1, 0)
            .text(dateTimeFormatter.format(data.PrintedAt, "fullDateTime"))
            .feed(1)
            .size(1, 1)
            .text(`$${parsedValue} ARS`)
            .feed(1)
            .size(0, 0)
            .tableCustom(
              [
                {
                  text: "VALIDO POR ",
                  align: "CENTER",
                  width: 1,
                },
                {
                  text: `MáQUINA N° `,
                  align: "CENter",
                  width: 1,
                },
              ],
              "cp857"
            )
            .tableCustom(
              [
                {
                  text: "30 DIAS",
                  align: "CENTER",
                  width: 1,
                },
                {
                  text: `#${data.PrintedIn}`,
                  align: "CENter",
                  width: 1,
                },
              ],
              "cp857"
            )
            .align("lt")
            .feed(2)
            .text(`CREADO POR:                             FIRMA`)
            .feed(1)
            .text(`${decoded.Profile.FullName}`)
            .text("________________________________________________")
            .feed(2)
            .text("AUTORIZADO POR:                         FIRMA")
            .feed(2)
            .text("________________________________________________")
            .align("ct")
            .feed(2)
            .size(1, 0)
            .text("Solo cobrar por caja")
            .text(`${count >= 2 ? "Re-impresion N°" + (count - 1) : ""}`);
          finishPrint();
        }),
      (onError) => {
        console.log("ERROR Asking for printer", onError);
        NotifyUser.Error("Problemas comunicando con la impresora.");
      }
    );
  };

  return (
    <Grid
      container
      sx={{
        width: " 100%",
        height: "100%",
        display: "flex",
      }}
    >
      <Grid
        item
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          component={Paper}
          sx={{
            width: "70%",
            maxHeight: { xl: "70%", md: "80%" },
            overflow: "auto",
            alignItems: "center",
            justifyContent: "center",
            py: "15px",
          }}
        >
          <Grid
            item
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                Generar Ticket
              </Typography>
            </Box>
            <form
              autoComplete="off"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box>
                {pathname.includes("/ticket/pre-insert") && (
                  <Grid container sx={{}}>
                    <TextField
                      id="Barcode"
                      value={preData?.Barcode}
                      helperText="Debe comenzar con 00"
                      onChange={handleChange}
                      label="Código de Barras"
                      variant="standard"
                      onKeyPress={handleKeyPressAmount}
                      inputProps={{ maxLength: 18 }}
                      sx={{
                        width: "100%",
                      }}
                      InputProps={{
                        maxLength: 16,

                        endAdornment: (
                          <InputAdornment position="end">
                            <NumbersIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Autocomplete
                      id="PrintedIn"
                      options={machines}
                      noOptionsText="Comience a escribir para buscar "
                      includeInputInList
                      sx={{ width: "100%", marginBottom: "10px" }}
                      value={machineNumber}
                      onChange={(e, newValue) => {
                        setMachineNumber(newValue);
                        setPreData({ ...preData, PrintedIn: e.target.value });
                      }}
                      inputValue={inputAutocomplete}
                      onInputChange={handleInputChange}
                      loading={loadingApi}
                      loadingText="Buscando..."
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Número de Máquina"
                          variant="standard"
                          onKeyPress={handleKeyPressAmount}
                          InputProps={{
                            ...params.InputProps,
                            inputProps: {
                              ...params.inputProps,
                              maxLength: 18,
                            },
                          }}
                          // type="number"
                          // inputProps={{ }}
                        />
                      )}
                    />
                    <DateTimePicker
                      label="Fecha y Hora"
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          sx={{ width: "100%", marginY: "10px" }}
                          variant="standard"
                        />
                      )}
                      value={dateTime}
                      onChange={handleTimePicker}
                      maxDate={new Date()}
                    />

                    <TextField
                      id="Amount"
                      onChange={handleChangeAmount}
                      label="Monto"
                      onKeyPress={handleKeyPressAmount}
                      value={preData?.Amount === 0 ? "" : preData?.Amount}
                      variant="standard"
                      sx={{ width: "100%", marginY: "10px" }}
                      InputProps={{
                        maxLength: 15,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PaidIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      id="Notes"
                      label="Motivo"
                      placeholder="Motivo"
                      multiline
                      variant="standard"
                      onChange={handleNoteChange}
                      sx={{ width: "100%", marginY: "10px" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CreateIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}

                {pathname.includes("/ticket/new-insert") && (
                  <Grid container spacing={2}>
                    <Autocomplete
                      id="PrintedIn"
                      options={machines}
                      noOptionsText="Comience a escribir para buscar "
                      includeInputInList
                      sx={{
                        width: "100%",
                        marginY: "10px",
                      }}
                      value={machineNumber}
                      onChange={(e, newValue) => {
                        setMachineNumber(newValue);
                        setPreData({ ...preData, PrintedIn: e.target.value });
                      }}
                      inputValue={inputAutocomplete}
                      onInputChange={handleInputChange}
                      loading={loadingApi}
                      loadingText="Buscando..."
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Número de Máquina"
                          variant="standard"
                          InputProps={{
                            ...params.InputProps,
                            inputProps: {
                              ...params.inputProps,
                              maxLength: 18,
                            },
                          }}
                          onKeyPress={handleKeyPressAmount}
                          inputProps={{ maxLength: 18 }}
                        />
                      )}
                    />
                    <TextField
                      id="Amount"
                      value={newData.Amount === 0 ? "" : newData.Amount}
                      onKeyPress={handleKeyPressAmount}
                      onChange={handleChangeAmount}
                      label="Monto"
                      variant="standard"
                      sx={{ width: "100%", marginY: "10px" }}
                      InputProps={{
                        maxLength: 15,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PaidIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      id="Notes"
                      label="Motivo"
                      placeholder="Motivo"
                      multiline
                      variant="standard"
                      onChange={handleNoteChange}
                      sx={{ width: "100%", marginY: "10px" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CreateIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
              </Box>
              <Box sx={style.boxButton}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  onClick={handleSubmit}
                  sx={style.button}
                  color="error"
                  disabled={!validate()}
                  type="submit"
                >
                  Crear E Imprimir Ticket Muleto
                </LoadingButton>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          width: "50%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Grid
          container
          sx={{
            width: "70%",
            maxHeight: { xl: "70%", md: "80%" },
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Grid
            item
            component={Paper}
            sx={{
              width: "100%",
              maxHeight: "80%",
              overflow: "auto",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TicketUI data={preData} pathname={pathname} />
          </Grid>
        </Grid>

        <Captcha
          title={"Para confirmar la autorización del ticket clickeá el número"}
          onContinue={correctValidationCaptcha}
          open={confirmAuthorization}
          onCancel={() => {
            setConfirmAuthorization(false);
          }}
        />
      </Grid>

      <Dialog
        // open={true}
        open={openConfirmDialog}
      >
        <DialogTitle>¡Operación realizada con éxito!</DialogTitle>

        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <LoadingButton
            variant="outlined"
            loading={loading}
            onClick={() => {
              setCount((prev) => prev + 1);
            }}
            sx={{ fontSize: "13px", color: "secondary.main" }}
            color="error"
            type="submit"
          >
            Re-imprimir Ticket Creado
          </LoadingButton>

          <LoadingButton
            sx={{ fontSize: "20px", width: "100%" }}
            variant="contained"
            onClick={onFinish}
            color="error"
            type="submit"
          >
            Terminar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
const style = {
  paperTicket: {
    backgroundColor: "primary.main",
    alignSelf: { xs: "center", lg: "flex-start" },
    color: "black",
    display: "flex",
    justifyContent: "center",
    width: { xs: "fit-content", md: "30rem" },
    marginLeft: { xs: 0, lg: "2rem" },
    marginBottom: "1.10px",
    marginTop: { xs: 0, lg: "-2rem" },
  },
  paper: {
    width: { xs: "24.375rem", md: "30rem" },
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: "white",
    marginBottom: "50px",
    marginTop: "50px",
    marginRight: { xs: 0, lg: "4rem" },
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "40px",
    height: "85vh",
  },

  boxButton: { display: "flex", justifyContent: "end", padding: "1.2rem" },
};

export default Home;
