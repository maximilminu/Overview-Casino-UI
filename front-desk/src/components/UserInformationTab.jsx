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
import Avatar from "./Avatar";
import React, { useLayoutEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import PlaceIcon from "@mui/icons-material/Place";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import { Link } from "react-router-dom";
import CakeIcon from "@mui/icons-material/Cake";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import InteractionChannelIcon from "./JsonForms/InteractionChannelIcon";
import usePaginationContact from "../hook/usePaginationContact";

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

const UserInformationTab = ({ user, img }) => {
  const theme = useTheme();
  const [nameLength, setNameLength] = useState(false);
  const [maxNameLength, setMaxNameLength] = useState(false);
  const { currentPage, nextPage, prevPage } = usePaginationContact(
    2,
    user?.ContactMethods
  );

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
            padding: "15px",
          }}
        >
          <Grid
            item
            sx={{
              width: "90%",
              height: { xl: "15%", lg: "10%", md: "15%", xs: "20%" },
              display: "flex",
              alignItems: "center",
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
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
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
                    marginLeft: { xs: "5px", md: "5px" },
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
                  secondary={user.Birthdate}
                />
              </ListItem>
              {user.Address.Area ? (
                <ListItem sx={{ paddingY: "1px" }}>
                  <ListItemAvatar>
                    <PlaceIcon />
                  </ListItemAvatar>
                  <ListItemText
                    primary="Area:"
                    secondary={capitalizer(user.Address.Area)}
                  />
                </ListItem>
              ) : null}
              <ListSubheader
                sx={{
                  lineHeight: "30px",
                  marginRight: "auto",
                }}
              >
                Datos de Contacto:
              </ListSubheader>
              <ListItem sx={{ paddingY: "1px" }}>
                <ListItemAvatar>
                  <ContactMailIcon />
                </ListItemAvatar>
                <ListItemText primary={"Email:"} secondary={user.Email} />
              </ListItem>
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
