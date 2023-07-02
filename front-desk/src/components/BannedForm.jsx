import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CustomTextField from "./CustomInput";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// eslint-disable-next-line
import { es } from "dayjs/locale/es";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
import MotiveModal from "./MotiveModal";
import { NotifyUserContext } from "@oc/notify-user-context";

const style = {
  input: {
    width: "15%",
    marginTop: "-10px",
    input: { padding: 0 },
  },
};
const BannedForm = ({
  bannedInformation,
  setBannedInformation,
  dataBanned,
  userData,
  isUnauthorize,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const { id } = useParams();
  const { Post, Patch } = useContext(ApiContext);
  const [userInfo, setUserInfo] = useState(dataBanned || {});
  const [disableComponents, setDisableComponents] = useState(false);
  const [disableOption, setDisableOption] = useState();
  const [dialogMotive, setDialogMotive] = useState(false);
  const [inputMotive, setInputMotive] = useState("");
  const [term, setTerm] = useState("");
  const NotifyUser = useContext(NotifyUserContext);
  useEffect(() => {
    if (dataBanned) {
      setUserInfo(dataBanned);
    }
    // eslint-disable-next-line
  }, [dataBanned]);

  //SETEA LA INFO DEL USUARIO SI ES QUE YA ESTA BANEADO
  useEffect(() => {
    if (userInfo && userInfo.Banned) {
      if (userInfo && userInfo && userInfo.Banned && userInfo.Banned[0].Mode) {
        setBannedInformation(userInfo.Banned[0]);
        if (userInfo.Banned[0].Mode === 1) {
          setDisableOption(true);
          setDisableComponents({
            ...disableComponents,
            1: false,
            2: true,
            3: true,
            TextField: true,
          });
        }
        if (userInfo.Banned[0].Mode === 2) {
          setDisableComponents({
            ...disableComponents,
            1: true,
            2: false,
            3: true,
            TextField: true,
          });
        }
        if (userInfo.Banned[0].Mode === 3) {
          setDisableComponents({
            ...disableComponents,
            1: true,
            2: true,
            3: false,
            TextField: true,
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [userInfo]);

  //ABRE EL DIALOG
  const handleClickOpen = () => {
    setOpen(true);
  };

  //SOLO ACEPTA NUMEROS
  const handleKeyPressOnlyNumber = (e) => {
    const allowedChars = /^[0-9]*$/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };

  //SOLO ACEPTA LETRAS
  const handleKeyPressOnlyLetters = (e) => {
    const allowedChars = /^[a-zA-Z\s]*$/;
    const charCode = e.charCode;
    const char = String.fromCharCode(charCode);
    if (!allowedChars.test(char)) {
      e.preventDefault();
    }
  };
  //HANDLE CHANGE DE LOS MODE
  const handleRadioMood = (event) => {
    setDisableOption(false);
    setBannedInformation({
      Mode: Number(event.target.value),
    });
  };

  //HANDLE CHANGE DE TODOS LOS INPUTS
  const handleInputChange = (e) => {
    if (bannedInformation.Mode === 3 && e.target.id !== "Comments") {
      setBannedInformation({
        ...bannedInformation,
        Limits: {
          ...bannedInformation.Limits,
          [e.target.id]: Number(e.target.value),
        },
      });
    } else {
      setBannedInformation({
        ...bannedInformation,
        [e.target.id]: e.target.value,
      });
    }
  };

  //HANDLE CHANGE DE LOS PLAZOS DEL MODE 1
  const handleRadioTerm = (e) => {
    setTerm(e.target.value);
    if (e.target.value === "Otro") {
      setBannedInformation({
        ...bannedInformation,
        Until: dayjs(Date.now()).valueOf(),
      });
      setDisableOption(false);
    } else {
      const value = e.target.value.split(" ");
      const a = dayjs();
      const date = a.add(Number(value[0]), value[1]);
      setBannedInformation({
        ...bannedInformation,
        Until: dayjs(date).valueOf(),
      });
      setDisableOption(true);
    }
  };
  //VALIDACION DEL BOTON
  const validate = () => {
    if (
      bannedInformation &&
      bannedInformation.Mode &&
      bannedInformation.Mode === 1
    ) {
      return bannedInformation.Until;
    }
    if (
      bannedInformation &&
      bannedInformation.Mode &&
      bannedInformation.Mode === 2
    ) {
      return (
        bannedInformation?.Name?.length >= 3 &&
        bannedInformation?.Lastname?.length >= 3 &&
        bannedInformation?.LegalID?.length >= 6
      );
    }
    if (
      bannedInformation &&
      bannedInformation.Mode &&
      bannedInformation.Mode === 3
    ) {
      return (
        bannedInformation?.Limits?.MoneyDailyLimit >= 100 ||
        bannedInformation?.Limits?.MoneyMonthlyLimit >= 100 ||
        bannedInformation?.Limits?.HoursDailyLimit >= 100 ||
        bannedInformation?.Limits?.HoursMonthlyLimit >= 100
      );
    }
  };

  //SETEA LAS PROPIEDADES OBLIGATORISA QUE DEBE TENER CADA MODE CUANDO SE CLICKEA UN RADIO
  useEffect(() => {
    if (
      !userInfo.Banned &&
      bannedInformation &&
      bannedInformation.Mode &&
      bannedInformation.Mode === 3
    ) {
      setBannedInformation({
        ...bannedInformation,
        Limits: {
          ...bannedInformation.Limits,
          MoneyDailyLimit: 1000,
          MoneyMonthlyLimit: 20000,
        },
      });
    }
    if (
      !userInfo.Banned &&
      bannedInformation &&
      bannedInformation.Mode &&
      bannedInformation.Mode === 1
    ) {
      setBannedInformation({
        ...bannedInformation,
        Since: dayjs(Date.now()).valueOf(),
        Until: dayjs(Date.now()).valueOf(),
      });
    }
    // eslint-disable-next-line
  }, [bannedInformation && bannedInformation.Mode]);

  //POST DE UN USUARIO EN LA VIEW DE EDIT MEMBER
  const handleSubmitdataBannedBanned = () => {
    Post(`/member/v1/ban/${id}`, bannedInformation)
      .then(({ data }) => {
        setUserInfo({ Banned: [data] });
        setBannedInformation(data);
        setOpen(false);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          NotifyUser.Warning(
            "El documento autorizante no debe coincidir con el miembro próximo a adherirse al programa."
          );
          return;
        }
      });
  };

  const unsusbribeMember = () => {
    Patch(`/member/v1/${id}`, [
      {
        op: "replace",
        path: `/Banned/${userData?.Banned?.lastIndexOf(
          userData.Banned[userData.Banned.length - 1]
        )}/FinishedAt`,
        value: dayjs(Date.now()).valueOf(),
      },
      {
        op: "replace",
        path: `/Banned/${userData.Banned.lastIndexOf(
          userData.Banned[userData.Banned.length - 1]
        )}/Motive`,
        value: inputMotive,
      },
    ]).then(({ data }) => {
      setBannedInformation({});
      setUserInfo({});
      setOpen(false);
      setDisableOption(false);
      setDialogMotive(false);
      setDisableComponents(false);
    });
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        {!userInfo && (
          <Button
            disabled={isUnauthorize}
            onClick={handleClickOpen}
            variant="contained"
          >
            PJR
          </Button>
        )}
        {userInfo && !userInfo.Banned && (
          <Button
            disabled={isUnauthorize}
            onClick={handleClickOpen}
            variant="contained"
          >
            PJR
          </Button>
        )}
        {userInfo && userInfo.Banned && userInfo.Banned[0]?.Mode && (
          <Button
            onClick={handleClickOpen}
            variant="contained"
            sx={{
              bgcolor: "success.light",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            SUSCRIPTO A PJR
          </Button>
        )}
        <Dialog maxWidth="md" open={open}>
          <DialogTitle id="alert-dialog-title">
            Programa de Juego Responsable
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <FormControl>
              <RadioGroup
                row
                name="row-radio-buttons-group"
                defaultValue={
                  (bannedInformation && bannedInformation.Mode) ||
                  (userInfo && userInfo.Banned && userInfo.Banned[0].Mode)
                }
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  disabled={disableComponents && disableComponents[1]}
                  label={
                    <>
                      Autoexcluido con
                      <br />
                      vencimiento automático
                    </>
                  }
                  onChange={handleRadioMood}
                  // onClick={handleChangeView}
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  disabled={disableComponents && disableComponents[2]}
                  label={
                    <>
                      Autoexcluido
                      <br />
                      revocable por un responsable
                    </>
                  }
                  onChange={handleRadioMood}
                  // onClick={handleChangeView}
                />
                <FormControlLabel
                  value={3}
                  control={<Radio />}
                  disabled={disableComponents && disableComponents[3]}
                  label={
                    <>
                      Juego
                      <br />
                      responsable
                    </>
                  }
                  onChange={handleRadioMood}
                />
              </RadioGroup>
            </FormControl>

            <DialogContentText
              sx={{
                height: bannedInformation &&
                  bannedInformation.Mode && { xl: "15vh", md: "20vh" },
                width: "42vw",
              }}
            >
              {bannedInformation &&
                bannedInformation.Mode &&
                bannedInformation.Mode === 1 && (
                  <>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {disableComponents &&
                      disableComponents.TextField ? null : (
                        <FormControl>
                          <FormLabel>Plazo</FormLabel>
                          <RadioGroup row defaultValue={term ? term : "Otro"}>
                            <FormControlLabel
                              value="15 day"
                              control={<Radio />}
                              label="15 días"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />
                            <FormControlLabel
                              value="1 month"
                              control={<Radio />}
                              label="1 mes"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />
                            <FormControlLabel
                              value="6 month"
                              control={<Radio />}
                              label="6 meses"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />
                            <FormControlLabel
                              value="1 year"
                              control={<Radio />}
                              label="1 año"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />

                            <FormControlLabel
                              value="2 year"
                              control={<Radio />}
                              label="2 años"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />

                            <FormControlLabel
                              value="Otro"
                              control={<Radio />}
                              label="Otro"
                              disabled={
                                disableComponents && disableComponents.TextField
                              }
                              onChange={handleRadioTerm}
                            />
                          </RadioGroup>
                        </FormControl>
                      )}

                      <DatePicker
                        id="Until"
                        disabled={disableOption}
                        minDate={new Date()}
                        label="Hasta"
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            sx={{
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor:
                                  disableComponents.Textfield && "red",
                              },
                              width: "50%",
                              marginY: "10px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor:
                                    disableComponents.Textfield && "red",
                                },
                              },
                            }}
                            value={bannedInformation.Until}
                            variant={
                              disableComponents.Textfield
                                ? "outlined"
                                : "standard"
                            }
                          />
                        )}
                        value={bannedInformation.Until}
                        onChange={(value) => {
                          const timeInSeconds = new Date(value);
                          setBannedInformation({
                            ...bannedInformation,
                            Until: timeInSeconds.getTime(),
                          });
                        }}
                      />
                    </Box>
                  </>
                )}

              {bannedInformation &&
                bannedInformation.Mode &&
                bannedInformation.Mode === 2 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      jusitfyContent: "center",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <CustomTextField
                        disabled={
                          disableComponents && disableComponents.TextField
                        }
                        variant="standard"
                        label="Nombre *"
                        onKeyPress={handleKeyPressOnlyLetters}
                        value={bannedInformation && bannedInformation.Name}
                        id="Name"
                        onChange={handleInputChange}
                      />
                      <CustomTextField
                        disabled={
                          disableComponents && disableComponents.TextField
                        }
                        sx={{ width: "50%" }}
                        onKeyPress={handleKeyPressOnlyLetters}
                        variant="standard"
                        label="Apellido *"
                        id="Lastname"
                        value={bannedInformation && bannedInformation.Lastname}
                        onChange={handleInputChange}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <CustomTextField
                        disabled={
                          disableComponents && disableComponents.TextField
                        }
                        variant="standard"
                        label="DNI *"
                        id="LegalID"
                        onKeyPress={handleKeyPressOnlyNumber}
                        value={bannedInformation && bannedInformation.LegalID}
                        onChange={handleInputChange}
                      />
                      <CustomTextField
                        disabled={
                          disableComponents && disableComponents.TextField
                        }
                        variant="standard"
                        label="Contacto"
                        id="Contact"
                        value={bannedInformation && bannedInformation.Contact}
                        onChange={handleInputChange}
                      />
                    </Box>
                  </Box>
                )}

              {bannedInformation &&
                bannedInformation.Mode &&
                bannedInformation.Mode === 3 && (
                  <>
                    <Typography
                      sx={{
                        color: "black",
                        marginTop: "5px",
                      }}
                    >
                      Cantidad maxima de...
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          marginLeft: "50px",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography>Dinero a apostar por día.</Typography>
                        <CustomTextField
                          disabled={
                            disableComponents && disableComponents.TextField
                          }
                          variant="standard"
                          sx={style.input}
                          size="small"
                          value={
                            bannedInformation?.Limits?.MoneyDailyLimit === 0
                              ? ""
                              : bannedInformation?.Limits?.MoneyDailyLimit
                          }
                          id="MoneyDailyLimit"
                          withoutEndAdorment={true}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPressOnlyNumber}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginLeft: "50px",
                        }}
                      >
                        <Typography>Dinero a apostar por mes.</Typography>
                        <CustomTextField
                          disabled={
                            disableComponents && disableComponents.TextField
                          }
                          variant="standard"
                          sx={style.input}
                          size="small"
                          value={
                            bannedInformation?.Limits?.MoneyMonthlyLimit === 0
                              ? ""
                              : bannedInformation?.Limits?.MoneyMonthlyLimit
                          }
                          id="MoneyMonthlyLimit"
                          withoutEndAdorment={true}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPressOnlyNumber}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginLeft: "50px",
                        }}
                      >
                        {/*xdia: 100, xmes:20000 */}
                        <Typography>
                          Horas diarias de permanencia por día.
                        </Typography>
                        <CustomTextField
                          disabled={
                            disableComponents && disableComponents.TextField
                          }
                          variant="standard"
                          sx={style.input}
                          size="small"
                          // eslint-disable-next-line
                          value={
                            // eslint-disable-next-line
                            bannedInformation?.Limits?.HoursDailyLimit === 0
                              ? // eslint-disable-next-line
                                ""
                              : bannedInformation?.Limits?.HoursDailyLimit
                          }
                          id="HoursDailyLimit"
                          withoutEndAdorment={true}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPressOnlyNumber}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginLeft: "50px",
                        }}
                      >
                        <Typography>
                          Cantidad máxima de horas diarias por mes.
                        </Typography>
                        <CustomTextField
                          disabled={
                            disableComponents && disableComponents.TextField
                          }
                          variant="standard"
                          sx={style.input}
                          size="small"
                          value={
                            bannedInformation?.Limits?.HoursMonthlyLimit === 0
                              ? ""
                              : bannedInformation?.Limits?.HoursMonthlyLimit
                          }
                          onChange={handleInputChange}
                          id="HoursMonthlyLimit"
                          withoutEndAdorment={true}
                          onKeyPress={handleKeyPressOnlyNumber}
                        />
                      </Box>
                      <Box
                        sx={{
                          flexDirection: "row",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          marginLeft: "50px",
                        }}
                      >
                        <Typography sx={{ marginBottom: "13px" }}>
                          Permitir reapuesta.
                        </Typography>
                        <FormControlLabel
                          disabled={
                            disableComponents && disableComponents.TextField
                          }
                          id="ReBet"
                          control={
                            <Switch
                              value={
                                bannedInformation && bannedInformation.ReBet
                              }
                              defaultChecked={bannedInformation.ReBet}
                            />
                          }
                          onChange={(e) => {
                            setBannedInformation({
                              ...bannedInformation,
                              ReBet: e.target.checked,
                            });
                          }}
                        />
                      </Box>
                    </Box>
                  </>
                )}
            </DialogContentText>

            <TextField
              sx={{ width: "100%" }}
              id="Comments"
              label="Comentarios e Instrucciones"
              multiline
              disabled={disableComponents && disableComponents.TextField}
              rows={2}
              value={bannedInformation && bannedInformation.Comments}
              onChange={handleInputChange}
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                !userInfo.Banned && setBannedInformation({});
                setTerm("");
                setOpen(false);
                if (!id) {
                  setDisableOption(false);
                }
              }}
            >
              Cancelar
            </Button>

            {userInfo && userInfo.Banned && userInfo.Banned[0].Mode ? (
              <Button
                variant="contained"
                autoFocus
                sx={{
                  backgroundColor: "success.light",
                  "&:hover": {
                    backgroundColor: "success.dark",
                  },
                }}
                onClick={() => setDialogMotive(true)}
              >
                Desuscribir
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (id) {
                    handleSubmitdataBannedBanned();
                  } else {
                    setOpen(false);
                  }
                }}
                variant="contained"
                autoFocus
                disabled={!validate()}
              >
                Activar
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      <MotiveModal
        title={"Ingresa el motivo de la desuscripción por favor"}
        open={dialogMotive}
        onClick={unsusbribeMember}
        onChange={setInputMotive}
        onClose={() => setDialogMotive(false)}
      />
    </>
  );
};

export default BannedForm;
