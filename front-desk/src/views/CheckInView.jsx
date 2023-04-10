import {
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import { MemberContext } from "../context/MemberContext";
import { LoadingButton } from "@mui/lab";
import { Outlet, useNavigate, useOutlet } from "react-router-dom";

const style = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: { xl: "40%", lg: "40%", md: "40%", sm: "80%" },
    padding: "50px",
  },
  input: {
    'input[type="number"]::-webkit-inner-spin-button': {
      WebkitAppearance: "none",
      margin: 0,
    },
    'input[type="number"]::-webkit-outer-spin-button': {
      WebkitAppearance: "none",
      margin: 0,
    },
    width: "80%",
    input: {
      color: "black",
      borderColor: "black",
    },
    label: {
      color: "black",
    },
    margin: "2rem",
  },
};

export default function CheckInView() {
  const [loading, setLoading] = useState();
  const { Get } = useContext(ApiContext);
  const navigate = useNavigate();
  const [dni, setDni] = useState();
  const NotifyUser = useContext(NotifyUserContext);
  const { setMember, member } = useContext(MemberContext);
  const ifOutlet = useOutlet();
  const [disabledButton, setDisabledButton] = useState(true);
  const [checkIn, setCheckIn] = useState(false);

  useEffect(() => {
    if (member?.Name) {
      Get(
        `/visit/v1/status/?AreaID=6a523ecd-4b69-477c-ad29-8aee337ff05f&MemberID=${member.ID}`
      ).then(({ data }) => {
        const { AlreadyReported, Banned, UnderAge } = data;
        if (AlreadyReported || UnderAge || Banned) {
          setCheckIn(data);
        } else {
          setCheckIn(false);
        }
      });
    }
    // eslint-disable-next-line
  }, [member]);

  const getUserWithDni = (dni) => {
    setLoading(true);
    if (dni) {
      Get(`/member/v1/search/${dni}`)
        .then(({ data }) => {
          if (data.length === 0) {
            navigate(`/front-desk/add-member/`);
            setDisabledButton(true);
            setLoading(false);
          } else {
            setMember(data[0]);
            navigate("confirm");
            setLoading(false);
            setDisabledButton(true);
          }
        })
        .catch(async (err) => {
          setLoading(false);
          NotifyUser.Error(
            `Problemas con el servicio de registro de usuarios. Notifique al servicio técnicos (${err.request.status}).`
          );
        });
    }
  };

  return ifOutlet ? (
    <Outlet context={[checkIn, setCheckIn]} />
  ) : (
    <Container sx={style.container}>
      <Paper sx={style.paper}>
        <Typography variant="h4" sx={{ color: "secondary.main" }} gutterBottom>
          Check-In
        </Typography>
        <TextField
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (!disabledButton) {
                getUserWithDni(e.target.value);
              }
            }
          }}
          label="DNI"
          autoComplete="off"
          type="number"
          inputProps={{
            inputMode: "numeric",
            pattern: "/^-?d+(?:.d+)?$/g",
          }}
          onChange={(e) => {
            if (e.target.value.length >= 7) {
              setDisabledButton(false);
              setDni(e.target.value);
            }
          }}
          variant="outlined"
          sx={style.input}
        />
        {loading ? (
          <LoadingButton sx={{ width: "80%" }}>
            <CircularProgress color="inherit" />
          </LoadingButton>
        ) : (
          <Button
            variant="contained"
            disabled={disabledButton}
            color="primary"
            sx={{ width: "80%" }}
            onClick={() => getUserWithDni(dni)}
          >
            Buscar
          </Button>
        )}
      </Paper>
    </Container>
  );
}
