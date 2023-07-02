import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  ListItemAvatar,
  ListSubheader,
  Button,
  Grid,
  Fab,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import Avatar from "./Avatar";
import React, { useLayoutEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import { Link, useNavigate } from "react-router-dom";
import CakeIcon from "@mui/icons-material/Cake";
import InteractionChannelIcon from "./JsonForms/InteractionChannelIcon";
import usePaginationContact from "../hook/usePaginationContact";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { useContext } from "react";
import { ConfigContext } from "@oc/config-context";

const style = {
  list: {
    backgroundColor: "#e7ebf0",
    width: "80%",
    height: "80%",
  },
  avatar: {
    backgroundColor: "grey",
    width: { xl: 76, md: 65, xs: 70 },
    height: { xl: 76, md: 65, xs: 70 },
  },
};

const UserInformationTab = ({ user, img, isUnauthorize }) => {
  const theme = useTheme();
  const [nameLength, setNameLength] = useState(false);
  const navigate = useNavigate();
  const [maxNameLength, setMaxNameLength] = useState(false);
  const { currentPage, nextPage, prevPage } = usePaginationContact(
    2,
    user?.ContactMethods
  );
  const config = useContext(ConfigContext);

  useLayoutEffect(() => {
    if (
      user.Name.length + user.Lastname.length >= 20 &&
      user.Name.length + user.Lastname.length <= 24
    ) {
      setNameLength(true);
    }
    if (user.Name.length + user.Lastname.length >= 25) {
      setMaxNameLength(true);
    }
  }, [user]);

  const filteredCM = () => {
    if (user.ContactMethods) {
      if (user.ContactMethods?.length <= 2)
        return user.ContactMethods?.slice(0, 2);
      return user.ContactMethods?.slice(currentPage, currentPage + 2);
    }
  };

  const handleBirthday = () => {
    return dayjs(user.Birthdate).format(config.DisplayFormats.Date);
  };

  const capitalizer = (word) => {
    const result = word.split(" ").map((singleWord) => {
      return (
        singleWord.charAt(0).toUpperCase() + singleWord.slice(1).toLowerCase()
      );
    });
    return result.join(" ");
  };

  return (
    user.Name && (
      <>
        <Grid
          container
          component={Paper}
          sx={{
            height: { xl: "85%", md: "95%", xs: "75%" },
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            border:
              isUnauthorize && isUnauthorize.Banned
                ? `3px solid  ${theme.palette.error.dark}`
                : isUnauthorize &&
                  isUnauthorize.UnderAge &&
                  `3px solid ${theme.palette.warning.dark}`,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent:
                (isUnauthorize && isUnauthorize.Banned) ||
                (isUnauthorize && isUnauthorize.UnderAge)
                  ? "space-between"
                  : "flex-end",
            }}
          >
            {isUnauthorize && isUnauthorize.Banned && (
              <Typography
                sx={{
                  fontSize: "10px",
                  marginLeft: "5px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  color: "grey",
                }}
              >
                Suscripto al programa juego responsable
              </Typography>
            )}

            {isUnauthorize && isUnauthorize.UnderAge && (
              <Typography
                sx={{
                  fontSize: "10px",
                  marginLeft: "5px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: "grey",
                }}
              >
                Menor de edad
              </Typography>
            )}
            <Button
              disabled={
                (isUnauthorize && isUnauthorize.AlreadyReported) ||
                (isUnauthorize && isUnauthorize.UnderAge) ||
                (isUnauthorize && isUnauthorize.Banned)
              }
              sx={{ marginRight: "15px" }}
              elevation={4}
              onClick={() =>
                navigate(`/front-desk/check-in/confirm/${user.ID}`)
              }
              variant="contained"
            >
              Check-in
            </Button>
          </Box>
          <Grid
            item
            sx={{
              width: "90%",
              maxHeight: { xl: "15%", lg: "10%", md: "20%", xs: "20%" },
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: " flex-start",
              }}
            >
              <Avatar sx={style.avatar} subject={user} />
              <Box
                sx={{
                  marginLeft: "20px",
                  display: "flex",
                  flexDirection: maxNameLength ? "column" : "row",
                  justifyContent: "center",
                  alignItems: maxNameLength ? "left" : "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xl: nameLength ? "20px" : maxNameLength ? "16px" : "30px",
                      lg: nameLength ? "20px" : maxNameLength ? "18px" : "25px",
                      md: nameLength ? "15px" : maxNameLength ? "17px" : "20px",
                      xs: nameLength ? "20px" : maxNameLength ? "18px" : "25px",
                    },
                  }}
                >
                  {capitalizer(user.Name)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: {
                      xl: nameLength ? "20px" : maxNameLength ? "16px" : "30px",
                      xs: nameLength ? "20px" : maxNameLength ? "18px" : "25px",
                      lg: nameLength ? "20px" : maxNameLength ? "18px" : "25px",
                      md: nameLength ? "15px" : maxNameLength ? "17px" : "20px",
                    },
                    marginLeft: !maxNameLength && { xs: "5px", md: "5px" },
                  }}
                >
                  {capitalizer(user.Lastname)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid
            item
            sx={{
              width: "90%",
              height: { xs: "60%", md: "65%" },
              overflow: "auto",
              marginTop: "5px",
            }}
          >
            <List
              dense={true}
              subheader={
                <ListSubheader
                  sx={{
                    lineHeight: "30px",
                    marginRight: "auto",
                  }}
                >
                  Datos personales:
                </ListSubheader>
              }
            >
              <ListItem sx={{ paddingY: "1px" }}>
                <ListItemAvatar>
                  <FingerprintOutlinedIcon />
                </ListItemAvatar>
                <ListItemText primary="Dni:" secondary={user.LegalID} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <CakeIcon />
                </ListItemAvatar>
                <ListItemText
                  primary="Nacimiento:"
                  secondary={handleBirthday()}
                />
              </ListItem>
              <ListSubheader
                sx={{
                  lineHeight: "30px",
                  marginRight: "auto",
                }}
              >
                Datos de Contacto:
              </ListSubheader>
              {user && user.Email && (
                <ListItem>
                  <ListItemAvatar>
                    <AlternateEmailIcon />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Correo Electrónico:"
                    secondary={user.Email}
                  />
                </ListItem>
              )}

              {(filteredCM() || []).map((cm, cmIdx) => (
                <ListItem sx={{ paddingY: "1px" }} key={cmIdx}>
                  <ListItemAvatar>
                    <InteractionChannelIcon media={cm} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      cm.Type === "landphone" || cm.Type === "cellphone"
                        ? "Teléfono"
                        : cm.Type
                    }
                    secondary={
                      cm.Type === "landphone" || cm.Type === "cellphone"
                        ? `${cm.Value.Country}-${cm.Value.Region}-${cm.Value.Number}`
                        : cm.Value
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid
            item
            sx={{
              width: "100%",
              height: { xs: "15%" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onClick={prevPage}>
                <ArrowBackIosIcon fontSize="small" />
              </Button>
              <Button onClick={nextPage}>
                <ArrowForwardIosIcon fontSize="small" />
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={`edition`}
              >
                <Fab
                  sx={{
                    backgroundColor: "primary.main",
                    color: "third.main",
                    width: { lg: "50px", md: "40px", xs: "35px" },
                    height: { lg: "50px", md: "40px", xs: "35px" },
                    marginRight: "3px",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    marginBottom: "5px",
                  }}
                >
                  <EditIcon />
                </Fab>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </>
    )
  );
};

export default UserInformationTab;
