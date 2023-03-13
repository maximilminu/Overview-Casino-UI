import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ApiContext } from "../context/ApiContext";
import { NotifyUserContext } from "../context/NotifyUserContext";
import { BarcodeReaderContext } from "../context/BarcodeReaderContext";
import SingleTicketView from "../components/SingleTicketView";
import Roulette from "../components/Spinner/Roulette";
import { Backdrop, Box } from "@mui/material";
import Captcha from "../components/Captcha";
import { useLocation } from "react-router-dom";

const Home = () => {
  const url = useLocation().pathname;
  const { BarcodeReader } = useContext(BarcodeReaderContext);
  const [ticketNumber, setTicketNumber] = useState("");
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [unauthorizedTicket, setUnauthorizedTicket] = useState();
  const AccessToken = localStorage.getItem("AccessToken");
  const TokenType = localStorage.getItem("TokenType");
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Post } = useContext(ApiContext);
  const [showButtons, setShowButtons] = useState(false);
  const [confirmAuthorization, setConfirmAuthorization] = useState(false);
  const [counterInfo, setCounterInfo] = useState();

  const handleTicketNumberClean = () => {
    setTicketNumber("");
    setUnauthorizedTicket();
    setCounterInfo([]);
  };

  const isTicketMuleto = (ticketNumber) => {
    return ticketNumber.length > 18 && ticketNumber[0] === "9";
  };

  useEffect(() => {
    if (BarcodeReader.data) {
      console.log(BarcodeReader.data);
      if (BarcodeReader.data.length < 18) {
        NotifyUser.Info("Error leyendo el ticket, reintente.");
      } else {
        setTicketNumber(BarcodeReader.data);
        setLoadingTicket(true);
      }
      BarcodeReader.clear();
    }
    // eslint-disable-next-line
  }, [BarcodeReader.data]);

  useEffect(() => {
    if (ticketNumber?.length >= 18) {
      setLoadingTicket(true);
      Get(`/ticket/v1/by-number/${ticketNumber}`)
        .then((ticket) => {
          console.log(ticket.PrintedIn);
          const { AuthorizedBy } = ticket;

          !AuthorizedBy && ticket.Status === 0 && isTicketMuleto(ticketNumber)
            ? setShowButtons(true)
            : setShowButtons(false);

          setUnauthorizedTicket(ticket);
          setLoadingTicket(false);

          Get(
            `/egm-meter/v1/${ticket.PrintedIn}?Time=${ticket.PrintedAt}`
          ).then((res) => {
            if (res.length === 0) {
              setCounterInfo([]);
              NotifyUser.Warning(
                "No se encontraron contadores que coincidan con tu búsqueda."
              );
              return;
            }
            setCounterInfo(res);
          });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            NotifyUser.Warning(
              "No se han encontrado tickets que coincidan con tu búsqueda."
            );
            setUnauthorizedTicket();
            setLoadingTicket(false);
            return;
          }
          setLoadingTicket(false);
        });
    }
    // eslint-disable-next-line
  }, [ticketNumber]);

  function correctValidationCaptcha() {
    const { ID } = unauthorizedTicket;
    Post(
      `/ticket/v1/authorize-ticket/${ID}`,
      { Status: 9 },
      {
        headers: {
          Authorization: `${TokenType} ${AccessToken}`,
        },
      }
    )
      .then((res) => {
        setConfirmAuthorization(false);
        setUnauthorizedTicket();
        setTicketNumber("");
        NotifyUser.Info("¡El ticket fue autorizado con éxito!");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          NotifyUser.Error("El ticket ya fue autorizado previamente.");
          setConfirmAuthorization(false);
        }
      });
  }

  return (
    <>
      <Navbar
        handleTicketNumberClean={handleTicketNumberClean}
        ticketNumber={ticketNumber}
        setTicketNumber={setTicketNumber}
        setUnauthorizedTicket={setUnauthorizedTicket}
      />
      <Box
        sx={{
          position: "fixed",
          top: "65px",
          bottom: "49px",
          left: 0,
          right: 0,
          overflow: "auto",
          backgroundColor: unauthorizedTicket && "#eeeeeeb0",
        }}
      >
        {loadingTicket ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 100 }}
            open={true}
          >
            <Roulette />
          </Backdrop>
        ) : (
          <>
            {unauthorizedTicket && (
              <SingleTicketView
                counterInfo={counterInfo}
                data={unauthorizedTicket}
                showButtons={showButtons}
                setConfirmAuthorization={setConfirmAuthorization}
                onContinue={handleTicketNumberClean}
              />
            )}
            <Captcha
              title={
                "Para confirmar la autorización del ticket clickeá el número"
              }
              onContinue={correctValidationCaptcha}
              open={confirmAuthorization}
              onCancel={() => {
                setConfirmAuthorization(false);
              }}
            />
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Home;
