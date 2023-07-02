import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { NotifyUserContext } from "@oc/notify-user-context";
import Typography from "@mui/material/Typography";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ApiContext } from "@oc/api-context";
import ForbbidenAlert from "../components/ForbbidenAlert";
import { Backdrop, Button, Paper, Container, useTheme } from "@mui/material";
// eslint-disable-next-line
import { MemberContext } from "../context/MemberContext";
import Avatar from "../components/Avatar";
import ConfirmDialog from "../components/ConfirmDialog";
import { HardwareContext } from "@oc/hardware-context";
import Roulette from "../components/Spinner/Roulette";
import { ConfigContext } from "@oc/config-context";

const style = {
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    height: { xl: "60%", md: "80%" },
    width: { xl: "30%", md: "40%" },
    margin: "2rem",
    elevation: "2",
    padding: "20px",
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
  const config = useContext(ConfigContext);
  const NotifyUser = useContext(NotifyUserContext);
  const { setMember, member } = useContext(MemberContext);
  const [thePostIsDone, setThePostIsDone] = useState(false);
  const { Post, Put, Get } = useContext(ApiContext);
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [visit, setVisit] = useState({});
  const [contador, setContador] = useState(0);
  const [postReqData, setPostReqData] = useState({});
  // eslint-disable-next-line
  const [forbbiden, setForbbiden] = useState(false);
  // eslint-disable-next-line
  const [checkIn] = useOutletContext();
  const [openDialog, setOpenDialog] = useState(false);
  const Hardware = useContext(HardwareContext);
  const theme = useTheme();
  const { memberID } = useParams();

  useEffect(() => {
    if (!member || !member.Name) {
      if (memberID) {
        Get(`/member/v1/by-id/${memberID}`)
          .then(({ data }) => {
            setMember(data);
          })
          .catch((error) => {
            NotifyUser.Warning(
              `Error para obtener los datos del usuario, (${error.request.status})`
            );
          });
      } else {
        navigate("/front-desk/check-in");
      }
    }
    // eslint-disable-next-line
  }, [member, memberID]);

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

  const capitalizer = (word) => {
    const result = word.split(" ").map((singleWord) => {
      return (
        singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase()
      );
    });
    return result.join(" ");
  };
  const convertDate = (data) => {
    const date = new Date(data);
    const parseDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const hoursAndMinutes =
      padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());
    return `${parseDate} a las ${hoursAndMinutes}`;
  };

  const handlePrintTicket = () => {
    if (visit && visit.TotalQty) {
      const qrUrl = `https://${config.TicketInformation.QrUrlCheckIn}/checkin/${visit.ID}`;
      Hardware.Device.Printer.print(
        (printer) =>
          new Promise((finishPrint) => {
            Hardware.Device.Printer.makeQr(qrUrl)
              .then((qrImg) => {
                printer.align("ct").style("normal")
                  .size(0, 0)
                  .text("─".repeat(45))
                  .size(1, 0)
                  .style("b")
                  .text(text)
                  .feed(1)
                  .text("damos la bienvenida al")
                  .feed(1)
                  .text(`${config.TicketInformation.CasinoName}!`)
                  .feed(2)
                  .raster(qrImg)
                  .size(0, 0)
                  .style("normal")
                  .text(qrUrl)
                  .text(convertDate(visit.CreatedAt))
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
                console.log(err)
                NotifyUser.Error("Problemas creando el QR.");
                return
              });
            Put(`/visit/v1/visit-update/${postReqData.ID}`, {
              PrintQty: contador,
            })
              .then(() => {
                console.log("AFTER PRINT", contador);
              })
              .catch((err) => {
                console.log("error", err);
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

  const convert = (data) => {
    let newDays = "";
    let newHours = "";
    let newMinutes = "";
    let newSeconds = "";
    let seconds = parseInt(data);
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
    if (Hardware.Device.Printer && Hardware.Device.Printer.status() === true) {
      Post("/visit/v1", {
        MemberID: member?.ID,
      })
        .then(({ data }) => {
          setPostReqData(data);
          Put(`/visit/v1/visit-update/${data.ID}`, { PrintQty: contador }).then(
            () => {
              setVisit(data);
            }
          );
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      NotifyUser.Error("Problemas comunicando con la impresora.");
    }
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
              sx={{
                ...style.paper,
                border: checkIn.Banned
                  ? `solid 7px ${theme.palette.error.dark}`
                  : checkIn.UnderAge &&
                    `solid 7px ${theme.palette.warning.dark}`,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
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
              </Box>
              <Avatar
                sx={{
                  marginBottom: "5px",
                  width: 200,
                  height: 200,
                }}
                subject={member}
              />
              <Box
                sx={{
                  width: "90%",
                  height: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    maxHeight: "25%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {checkIn.AlreadyReported ? (
                    <Typography
                      sx={{
                        fontSize: member?.Name.length >= 14 ? "20px" : "25px",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      {`¡${capitalizer(member.Name)} ya realizó el check-in!`}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: member?.Name.length >= 14 ? "20px" : "25px",
                        color: "black",
                      }}
                    >
                      {`¡Hola ${capitalizer(member.Name)}!`}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    maxHeight: "50%",
                  }}
                >
                  {checkIn.Banned && (
                    <ForbbidenAlert msg="Suscripto al programa de juego responsable" />
                  )}
                  {checkIn.UnderAge && <ForbbidenAlert msg="Menor de Edad" />}
                  {!checkIn && (
                    <Typography
                      sx={{ fontSize: "20px", color: "secondary.main" }}
                    >
                      ¿Deseas hacer check-in?
                    </Typography>
                  )}
                  {checkIn.AlreadyReported && (
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
                          {convert(checkIn.CheckInRemainingSeconds)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box>
                  {checkIn && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        navigate("/front-desk/check-in");
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                  {!checkIn && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "15px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ width: "70px" }}
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
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
          open={true}
        >
          <Roulette color="inherit" />
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
