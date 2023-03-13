import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Paper,
  ListItemAvatar,
  ListSubheader,
  Button,
} from "@mui/material";
import Avatar from "./Avatar";
import React from "react";
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

const UserInformationTab = ({ user, img }) => {
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const down900px = useMediaQuery(theme.breakpoints.down("md"));
  const { currentPage, nextPage, prevPage } = usePaginationContact(
    2,
    user?.ContactMethods
  );

  const filteredCM = () => {
    if (user.ContactMethods) {
      if (user.ContactMethods?.length <= 2)
        return user.ContactMethods?.slice(0, 2);
      return user.ContactMethods?.slice(currentPage, currentPage + 2);
    }
  };

  const style = {
    list: {
      backgroundColor: "#e7ebf0",
      minHeight: { xl: "500px" },
      width: "90%",
      padding: "2px",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
    },
    avatar: {
      backgroundColor: "grey",
      width: 76,
      height: 76,
      fontSize: "30px",
      marginLeft: { lg: "20px" },
      marginBottom: { lg: "5px", xl: "-20px" },
    },
  };
  return (
    user.Name && (
      <Paper
        sx={{
          width: { sm: "100%", lg: "80%" },
          height: { xl: 650, lg: "650px", md: 700 },
        }}
      >
        <Box
          sx={{
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: "10px",
              marginBottom: { xs: "5px", xl: "20px" },
              marginTop: down600px ? "none" : "20px",
              paddingTop: down600px && "25px",
            }}
          >
            <Box
              sx={{
                width: { lg: "20%" },
                marginLeft: { md: "15px" },
                marginBottom: { md: "15px" },
                marginRight: { lg: "30px" },
              }}
            >
              <Avatar sx={style.avatar} subject={user} />
            </Box>
            <Box
              sx={{
                width: { lg: "50%" },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: down900px ? "20px" : "20px",
                  marginLeft: { lg: "10px" },
                }}
              >
                {user.Name} {user.Lastname}
              </Typography>
            </Box>
          </Box>
          {down900px ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <List
                  dense={true}
                  sx={style.list}
                  subheader={
                    <ListSubheader
                      sx={{
                        lineHeight: "30px",
                        backgroundColor: "#e7ebf0",
                        marginRight: "auto",
                      }}
                    >
                      Datos personales:
                    </ListSubheader>
                  }
                >
                  <ListItem>
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
                  <ListItem>
                    <ListItemAvatar>
                      <PlaceIcon />
                    </ListItemAvatar>
                    <ListItemText primary="Area:" secondary={user.Area} />
                  </ListItem>
                </List>
                <List
                  dense={true}
                  sx={style.list}
                  subheader={
                    <ListSubheader
                      sx={{
                        lineHeight: "30px",
                        backgroundColor: "#e7ebf0",
                        marginRight: "auto",
                      }}
                    >
                      Datos de Contacto:
                    </ListSubheader>
                  }
                >
                  <ListItem>
                    <ListItemAvatar>
                      <ContactMailIcon />
                    </ListItemAvatar>
                    <ListItemText primary={"Email:"} secondary={user.Email} />
                  </ListItem>
                  {(filteredCM() || []).map((cm) => (
                    <ListItem>
                      <ListItemAvatar>
                        <InteractionChannelIcon media={cm.Type} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          cm.Type === "landphone" || cm.Type === "cellphone"
                            ? "Telefono"
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
              </Box>
            </>
          ) : (
            <>
              <List
                dense={true}
                sx={style.list}
                subheader={
                  <ListSubheader
                    sx={{
                      lineHeight: "30px",
                      backgroundColor: "#e7ebf0",
                      marginRight: "auto",
                    }}
                  >
                    Datos personales:
                  </ListSubheader>
                }
              >
                <ListItem>
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
                <ListItem>
                  <ListItemAvatar>
                    <PlaceIcon />
                  </ListItemAvatar>
                  <ListItemText primary="Area:" secondary={user.Area} />
                </ListItem>
                <ListSubheader
                  sx={{
                    lineHeight: "30px",
                    backgroundColor: "#e7ebf0",
                    marginRight: "auto",
                  }}
                >
                  Datos de Contacto:
                </ListSubheader>

                <ListItem>
                  <ListItemAvatar>
                    <ContactMailIcon />
                  </ListItemAvatar>
                  <ListItemText primary={"Email:"} secondary={user.Email} />
                </ListItem>
                {(filteredCM() || []).map((cm) => (
                  <ListItem>
                    <ListItemAvatar>
                      <InteractionChannelIcon media={cm.Type} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        cm.Type === "landphone" || cm.Type === "cellphone"
                          ? "Telefono"
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Button onClick={prevPage}>
                    <ArrowBackIosIcon fontSize="small" />
                  </Button>
                  <Button onClick={nextPage}>
                    <ArrowForwardIosIcon fontSize="small" />
                  </Button>
                </Box>
              </List>
            </>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to={`edition`}
            >
              <IconButton
                sx={{ color: "primary.main", borderRadius: "50px" }}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
            </Link>
          </Box>
        </Box>
      </Paper>
    )
  );
};

export default UserInformationTab;
