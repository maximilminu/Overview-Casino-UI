import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import fakeListUser from "../mock-data.json";
import { useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import ConfirmDialog from "./ConfirmDialog";
import {
  PrinterContext,
  PRINTER_STATUS_OFFLINE,
} from "../context/EscPosPrinterContext";

const UserCard = () => {
  const url = useLocation().pathname.split("/")[3];

  const [user, setUser] = useState();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { Printer } = React.useContext(PrinterContext);
  useEffect(() => {
    setUser(fakeListUser.filter((key) => key.id === parseInt(url)));
  }, [url]);

  const handleClickButton = () => {
    setShowConfirmDialog(true);
  };

  useEffect(() => {
    console.log(Printer.status);
  }, [Printer.status]);

  return (
    <>
      <Container>
        <Paper
          sx={{
            elevation: 3,
            width: "60%",
            backgroundColor: "white",
            display: "flex",
            margin: "0 auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
            }}
          >
            {user?.map((key) => {
              return (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "20px",
                      marginTop: "50px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 86,
                        height: 86,
                        fontSize: "30px",
                      }}
                    >
                      {key?.firstName.slice(0, 1)}
                      {key?.lastName.slice(0, 1)}
                    </Avatar>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        justifyContent: "left",
                      }}
                    >
                      <Typography sx={{ fontSize: "30px" }}>
                        {key.firstName} {key.lastName},
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          color: "grey",
                          marginTop: "-10px",
                        }}
                      >
                        {key.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "grey",
                      marginTop: "50px",
                    }}
                  >
                    <Tabs
                      sx={{
                        backgroundColor: "none",
                        color: "grey",
                      }}
                      value={0}
                      color="light.main"
                      aria-label="basic tabs example"
                    >
                      <Tab
                        sx={{
                          backgroundColor: "none",
                          color: "grey",
                        }}
                        label="Información Personal"
                      />
                    </Tabs>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "20px",
                      gap: "80px",
                    }}
                  >
                    <Box>
                      <List sx={{ gap: "50px" }}>
                        <ListItem key={1}>
                          <ListItemIcon>
                            <MailOutlineIcon />
                          </ListItemIcon>
                          <ListItemText primary="Email" secondary={key.email} />
                        </ListItem>

                        <ListItem key={2}>
                          <ListItemIcon>
                            <FeedOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Legajo"
                            secondary={key.legajo}
                          />
                        </ListItem>
                      </List>
                    </Box>

                    <Box>
                      <List>
                        <ListItem key={3}>
                          <ListItemIcon>
                            <FingerprintOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText primary="DNI" secondary={key.DNI} />
                        </ListItem>

                        <ListItem key={4}>
                          <ListItemIcon>
                            <FeedOutlinedIcon />
                          </ListItemIcon>
                          <ListItemText
                            key={4}
                            primary="Contacto"
                            secondary={key.contactNumber}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>

                  <Button
                    sx={{
                      marginBottom: "50px",
                      marginTop: "50px",
                      color: "primary",
                    }}
                    variant="outlined"
                    disabled={Printer.status === PRINTER_STATUS_OFFLINE}
                    onClick={handleClickButton}
                  >
                    Modificar clave
                  </Button>
                </>
              );
            })}
          </Box>
          {showConfirmDialog === true && (
            <ConfirmDialog
              showConfirmDialog={showConfirmDialog}
              setShowConfirmDialog={setShowConfirmDialog}
            />
          )}
        </Paper>{" "}
      </Container>
    </>
  );
};

export default UserCard;
