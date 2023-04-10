import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TableContainer,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";
import Barcode from "react-barcode";
import { ApiContext } from "@oc/api-context";
import { NotifyUserContext } from "@oc/notify-user-context";
import MotiveModal from "./MotiveModal";
import { useNavigate, useParams } from "react-router-dom";
import CounterTable from "./CounterTable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const style = {
  topTableCell: {
    color: "rgb(65, 67, 82)",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 auto",
    lineHeight: "15px",
  },
};

const SingleTicketView = ({
  showButtons,
  backupTicket,
  originalTicket,
  setConfirmAuthorization,
  onContinue,
  showInformationTicket,
  notFoundContadores,
  counterInfo,
  setCounterInfo,
}) => {
  console.log(backupTicket);
  const { number } = useParams();
  const navigate = useNavigate();
  const NotifyUser = useContext(NotifyUserContext);
  const [unauthorizedMotive, setUnauthorizedMotive] = useState();
  const [showMotiveModal, setShowMotiveModal] = useState(false);
  const theme = useTheme();
  const { Post } = useContext(ApiContext);

  const expirationDate = (data) => {
    const parseado = new Date(data);
    parseado.setMonth(parseado.getMonth() + 1);
    return (
      parseado.getDate() +
      "/" +
      (parseado.getMonth() + 1) +
      "/" +
      parseado.getFullYear()
    );
  };

  const handleClose = () => {
    setShowMotiveModal(false);
    // setValue("")
  };

  const isTicketMuleto = (ticketNumber) => {
    return (
      ticketNumber.length === 18 &&
      ticketNumber[0] === "9" &&
      ticketNumber[1] === "9"
    );
  };

  const handleSubmitUnauthorizedTicket = () => {
    Post(`/ticket/v1/authorize-ticket/${backupTicket.ID}`, {
      Status: 6,
      Notes: unauthorizedMotive,
    }).then(({ data }) => {
      setShowMotiveModal(false);
      navigate("/egm-operation-auditor");
      onContinue();
      NotifyUser.Info("Se ha guardado la información en el sistema.");
    });
  };

  return (
    <>
      <Grid
        container
        sx={{
          height: "100%",
          justifyContent: "space-around",
        }}
      >
        <Grid
          xl={3}
          md={3.5}
          item
          sx={{
            marginTop: "25px",
            height: "90%",
            overflow: "auto",
          }}
        >
          <Accordion defaultExpanded={!isTicketMuleto(number)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>TICKET ORIGINAL</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: { xl: "30px" },
                }}
              >
                <Typography sx={{ fontSize: { xl: "35px", md: "30px" } }}>
                  CASINO CENTRAL
                </Typography>
                <Typography sx={{ textAlign: { xs: "center" } }}>
                  Av. Patricio Peralta Ramos 2100 Mar del Plata
                </Typography>
                <Barcode
                  height={25}
                  width={1}
                  value={originalTicket?.Barcode}
                />
                <Typography>
                  {new Date(originalTicket?.PrintedAt).toLocaleString("es-AR")}
                </Typography>
                <Typography variant="h3">
                  $
                  {originalTicket?.Amount.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
                <Grid
                  container
                  sx={{
                    dislay: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Grid item>
                    <Typography variant="body1">VÁLIDO POR 30 DÍAS </Typography>
                    <Typography variant="body1">
                      {expirationDate(originalTicket.PrintedAt)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography>MÁQUINA:</Typography>
                    <Typography>#{originalTicket?.PrintedIn}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {backupTicket && (
            <Accordion defaultExpanded={isTicketMuleto(number)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography>TICKET MULETO</Typography>
                  {showButtons && (
                    <Typography sx={{ fontWeight: 700 }}>
                      Pendiente de autorización
                    </Typography>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: { xl: "30px" },
                  }}
                >
                  <Typography sx={{ fontSize: { xl: "35px", md: "30px" } }}>
                    CASINO CENTRAL
                  </Typography>
                  <Typography sx={{ textAlign: { xs: "center" } }}>
                    Av. Patricio Peralta Ramos 2100 Mar del Plata
                  </Typography>
                  <Barcode
                    height={25}
                    width={1}
                    value={backupTicket?.Barcode}
                  />
                  <Typography>
                    {new Date(backupTicket?.PrintedAt).toLocaleString("es-AR")}
                  </Typography>
                  <Typography variant="h3">
                    $
                    {backupTicket?.Amount.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                  <Grid
                    container
                    sx={{
                      dislay: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Grid item>
                      <Typography variant="body1">
                        VÁLIDO POR 30 DÍAS{" "}
                      </Typography>
                      <Typography variant="body1">
                        {expirationDate(backupTicket.PrintedAt)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>MÁQUINA:</Typography>
                      <Typography>#{backupTicket?.PrintedIn}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
              <AccordionActions>
                {showButtons && (
                  <Grid
                    container
                    sx={{
                      marginTop: { xl: "5%", md: "2%" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        width: { xl: "40%", md: "45%" },
                        color: "third.main",
                      }}
                      onClick={() => {
                        setShowMotiveModal(true);
                      }}
                    >
                      Desautorizar
                    </Button>
                    <Button
                      sx={{
                        width: { xl: "40%", md: "45%" },
                        backgroundColor: theme.palette.success.main,
                        "&:hover": {
                          backgroundColor: theme.palette.success.dark,
                        },
                      }}
                      variant="contained"
                      onClick={() => {
                        setConfirmAuthorization(true);
                      }}
                    >
                      Autorizar
                    </Button>
                  </Grid>
                )}
              </AccordionActions>
              {showInformationTicket && (
                <Grid item>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow key={backupTicket.ID}>
                          <TableRow key={backupTicket.ID}>
                            <TableCell sx={style.topTableCell}>
                              {backupTicket.Status === 9
                                ? "Autorizado por"
                                : "Desautorizado por"}
                            </TableCell>
                            <TableCell sx={style.topTableCell}>
                              {backupTicket.AuthorizedBy}
                            </TableCell>
                          </TableRow>
                          <TableRow key={backupTicket.ID}>
                            <TableCell sx={style.topTableCell}>
                              Fecha:
                            </TableCell>
                            <TableCell sx={style.topTableCell}>
                              {new Date(backupTicket.AuthorizedAt)
                                .toLocaleString("es-AR")
                                .replace(",", "")}
                            </TableCell>
                          </TableRow>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Accordion>
          )}
        </Grid>

        <Grid md={8} item sx={{ height: "90%", marginTop: "25px" }}>
          <CounterTable
            counterInfo={counterInfo}
            setCounterInfo={setCounterInfo}
            data={originalTicket}
            notFoundContadores={notFoundContadores}
          />
        </Grid>
      </Grid>

      <MotiveModal
        title={"Ingresa el motivo por el cual desautorizas el ticket."}
        open={showMotiveModal}
        onClose={handleClose}
        onChange={setUnauthorizedMotive}
        onClick={handleSubmitUnauthorizedTicket}
        exitText={"Cancelar"}
        confirmText={"Confirmar"}
      />
    </>
  );
};

export default SingleTicketView;
