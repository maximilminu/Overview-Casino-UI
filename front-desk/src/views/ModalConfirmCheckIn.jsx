import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { NotifyUserContext } from "@oc/notify-user-context";
import Typography from "@mui/material/Typography";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import ForbbidenAlert from "../components/ForbbidenAlert";
import {
  Backdrop,
  CircularProgress,
  Button,
  Paper,
  Container,
} from "@mui/material";
// eslint-disable-next-line
import { MemberContext } from "../context/MemberContext";
import Avatar from "../components/Avatar";
import ConfirmDialog from "../components/ConfirmDialog";
import { HardwareContext } from '@oc/hardware-context';

const style = {
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "450px",
    width: "500px",
    margin: "2rem",
    elevation: "2",
    padding: "40px",
    backgroundColor: "third.main",
    color: "primary.main",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "40vh",
    height: "100%",
  },
};

const ModalConfirmCheckIn = () => {
  const NotifyUser = useContext(NotifyUserContext);
  const { member } = useContext(MemberContext);
  const [thePostIsDone, setThePostIsDone] = useState(false);
  const { Post, Put } = useContext(ApiContext);
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [visit, setVisit] = useState({});
  const [contador, setContador] = useState(0);
  // eslint-disable-next-line
  const [forbbiden, setForbbiden] = useState(false);

  // eslint-disable-next-line
  const [checkIn] = useOutletContext();
  const [openDialog, setOpenDialog] = useState(false);
  const Hardware = useContext(HardwareContext);

  useEffect(() => {
    if (!member) {
      navigate("/front-desk/check-in");
    }
    // eslint-disable-next-line
  }, [member]);

  useEffect(() => {
    if (member?.Name) {
      if (thePostIsDone) {
        setOpenDialog(true);
      }
    }
    // eslint-disable-next-line
  }, [member]);

  const memberCapitalized =
    member?.Name?.charAt(0).toUpperCase() + member?.Name?.slice(1);
  let text;
  if (member?.Name?.length >= 20) {
    text = `¡${memberCapitalized}\n \n te`;
  } else {
    text = `¡${memberCapitalized}, te`;
  }

  const handlePrintTicket = () => {
    if (visit && visit.TotalQty) {
      const qrUrl = `https://Mi.Mejor.Club/checkin/${visit.ID}`;
      Hardware.Device.Printer.print(
        (printer) =>
          new Promise((finishPrint) => {
            Hardware.Device.Printer.makeQr(qrUrl)
              .then((qrImg) => {
                printer
                  .align("ct")
                  .style("normal")
                  .size(0, 0)
                  .text("─".repeat(45))
                  .size(1, 0)
                  .style("b")
                  .text(text)
                  .feed(1)
                  .text("damos la bienvenida al")
                  .feed(1)
                  .text("Casino de Mar del Plata!")
                  .feed(2)
                  .raster(qrImg)
                  .size(0, 0)
                  .style("normal")
                  .text(qrUrl)
                  .feed(1)
                  .text(`${contador > 0 ? "Reimpresion N°" + contador : ""}`)
                  .feed(3)
                  .size(1, 0)
                  .style("b")
                  .text(`Felicitaciones por`)
                  .text(`tu visita número ${visit.TotalQty}`)
                  .feed(2)
                  .text(`¡Gracias por venir,`)
                  .text(`y que la suerte este`)
                  .text("siempre a tu favor!")
                  .text("─".repeat(45));
                finishPrint();
                setThePostIsDone(true);
              })
              .catch((err) => {
                NotifyUser.Error("Problemas creando el QR.");
              });
          }),
        (onError) => {
          NotifyUser.Error("Problemas comunicando con la impresora.");
        }
      );
    }
  };

  useEffect(() => {
    if (contador > 0) {
      handlePrintTicket();
    }
    // eslint-disable-next-line
  }, [contador]);

  useEffect(
    handlePrintTicket,
    // eslint-disable-next-line
    [visit]
  );

  function padTo2Digits(num) {
    return String(num).padStart(2, "0");
  }
  const convertDate = (data) => {
    const date = new Date(data);
    const parseDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const hoursAndMinutes =
      padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());
    return `${parseDate} a las ${hoursAndMinutes}`;
  };

  const convert = (data) => {
    let newDays = "";
    let newHours = "";
    let newMinutes = "";
    let newSeconds = "";
    let seconds = parseInt(data / 1000);
    let days = parseInt(seconds / 60 / 60 / 24);
    let hours = parseInt((seconds - days * 24 * 60 * 60) / 60 / 60);
    let minutes = parseInt(
      (seconds - days * 24 * 60 * 60 - hours * 60 * 60) / 60
    );
    if (days !== 0) {
      newDays = `${days} ${days === 1 ? "día" : "días"}`;
    }
    if (hours !== 0) {
      newHours = `${hours} ${hours === 1 ? "hora" : "horas"}`;
    }
    if (minutes !== 0) {
      newMinutes = `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    }
    if (seconds !== 0) {
      newSeconds = `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
    }

    return !newDays && !newHours && !newMinutes
      ? `${newSeconds}`
      : `${newDays} ${newHours} ${newMinutes}`.replaceAll("   ", " ");
  };

  const handleCheckIn = () => {
    //if (Printer.status !== PRINTER_STATUS_OFFLINE) {
      Post(
        "/visit/v1",
        {
          MemberID: member?.ID
        }
      )
        .then(({ data }) => {
          Put(`/visit/v1/visit-update/${data.ID}`, { PrintQty: contador }).then(
            () => {
              // setThePostIsDone(true);
              setVisit(data);
            }
          );
        })
        .catch((err) => {
          console.log("error", err);
        });
    // } else {
    //   NotifyUser.Error("Problemas comunicando con la impresora.");
    // }
  };

  const confirmRedirect = () => {
    setThePostIsDone(false);
    setOpenDialog(false);
    navigate("/front-desk/check-in/confirm");
  };

  return (
    <>
      {member?.Name ? (
        thePostIsDone ? (
          <>
            <Container
              sx={{
                marginTop: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: { xl: "40%", lg: "40%", md: "40%", sm: "90%" },
                  padding: "50px",
                }}
              >
                <Box
                  sx={{
                    marginTop: "20px",
                    gap: "5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                  >
                    ¡Check in realizado <br /> con exito!
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "30px",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setContador(contador + 1);
                      }}
                      sx={{
                        fontSize: "13px",
                        width: "60%",
                        color: "secondary.main",
                      }}
                    >
                      Re-imprimir ticket
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate("/front-desk");
                      }}
                      sx={{
                        backgroundColor: "primary.main",
                        fontSize: "20px",
                        width: "100%",
                      }}
                    >
                      Terminar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Container>
          </>
        ) : (
          <Box sx={style.box}>
            <Paper
              sx={
                forbbiden
                  ? { ...style.paper, border: "solid 7px red" }
                  : style.paper
              }
            >
              <Avatar
                sx={{
                  margin: "50px",
                  width: 200,
                  height: 200,
                  marginTop: "50px",
                }}
                subject={member}
              />
              {checkIn.AlreadyReported ? (
                <>
                  <Typography
                    sx={{
                      fontSize: member?.Name.length >= 14 ? "20px" : "25px",
                      color: "black",
                      textAlign: "center",
                      marginTop: "-15px",
                    }}
                  >
                    ¡
                    {member.Name.charAt(0).toUpperCase() + member.Name.slice(1)}{" "}
                    ya realizó el check-in!
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{ color: "black", textTransform: "uppercase" }}
                      >
                        Último check-in:
                      </Typography>
                      <Typography>
                        {convertDate(checkIn.LastCheckInAt)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{ color: "black", textTransform: "uppercase" }}
                      >
                        Próximo check-in en:
                      </Typography>
                      <Typography>
                        {convert(checkIn.CheckInRemainingTime)}
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: "30px", color: "black" }}>
                    ¡Hola{" "}
                    {member.Name.charAt(0).toUpperCase() + member.Name.slice(1)}
                    !
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", color: "secondary.main" }}
                  >
                    {!checkIn.UnderAge &&
                      !checkIn.Banned &&
                      "¿Deseas hacer check in?"}
                  </Typography>
                </>
              )}
              <Box
                sx={{
                  display: "flex",
                  marginTop: "30px",
                  gap: "20px",
                  marginBottom: "70px",
                }}
              >
                {checkIn.Banned || checkIn.UnderAge ? (
                  <ForbbidenAlert
                    msg={checkIn.Banned ? "Autoexcluido" : "Menor de Edad"}
                  />
                ) : checkIn.AlreadyReported ? (
                  <>
                    <Button
                      sx={{ color: "secondary.main" }}
                      onClick={() => {
                        navigate("/front-desk/check-in");
                      }}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(
                          `/front-desk/member-list/${member.LegalID}/view-single-member/${member.ID}`
                        );
                      }}
                    >
                      Ver perfil
                    </Button>
                  </>
                ) : (
                  <>
                    <>
                      <Button
                        sx={{ color: "secondary.main", width: "70px" }}
                        onClick={() => {
                          navigate("/front-desk/check-in");
                        }}
                      >
                        No
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleCheckIn}
                        sx={{ backgroundColor: "primary.main", width: "70px" }}
                      >
                        Sí
                      </Button>
                    </>
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        )
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={"¿Quiere terminar el Check-in?"}
        onConfirm={confirmRedirect}
      />
    </>
  );
};

export default ModalConfirmCheckIn;

/* 
    if (parseInt((seconds - days * 24 * 60 * 60) / 60 / 60) !== 0) {
    } else if (parseInt(seconds / 60 / 60 / 24) !== 0) {
      days = parseInt(seconds / 60 / 60 / 24);
    }

    let remainding =
      seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    console.log(
      "Faltan %d dias %d horas %d minutos y %d segundos",
      days,
      hours,
      minutes,
      seconds
    ); */
