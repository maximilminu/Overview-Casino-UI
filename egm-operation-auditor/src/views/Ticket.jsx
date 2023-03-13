import { Backdrop } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Captcha from "../components/Captcha";
import SingleTicketView from "../components/SingleTicketView";
import Roulette from "../components/Spinner/Roulette";
import { NotifyUserContext } from "../context/NotifyUserContext";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";

const Ticket = () => {
  const [showInformationTicket, setShowInformationTicket] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [unauthorizedTicket, setUnauthorizedTicket] = useState();
  const AccessToken = localStorage.getItem("AccessToken");
  const TokenType = localStorage.getItem("TokenType");
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Post } = useContext(ApiContext);
  const [showButtons, setShowButtons] = useState(false);
  const [confirmAuthorization, setConfirmAuthorization] = useState(false);
  const [notFoundContadores, setNotFoundContadores] = useState(false)
  const [counterInfo, setCounterInfo] = useState();
  // eslint-disable-next-line
  const [valueTicket, setValueTicket] = useState("");
  const navigate = useNavigate();
  const { numberTiket } = useParams();
  useEffect(() => {
    setTicketNumber(numberTiket);
  }, [numberTiket]);

  const handleTicketNumberClean = () => {
    setTicketNumber("");
    setValueTicket("");
    setUnauthorizedTicket();
    setCounterInfo([]);
    setShowButtons(false);
  };

  const isTicketMuleto = (ticketNumber) => {
    return ticketNumber.length === 19 && ticketNumber[0] === "9";
  };

  useEffect(() => {
    if (ticketNumber?.length >= 13) {
      setLoadingTicket(true);
      setNotFoundContadores(false)
      Get(`/ticket/v1/by-number/${ticketNumber}`)
        .then((ticket) => {
          const { AuthorizedBy } = ticket;
          if (
            !AuthorizedBy &&
            ticket.Status === 0 &&
            isTicketMuleto(ticketNumber)
          ) {
            setShowInformationTicket(false);
            setShowButtons(true);
          } else if (
            isTicketMuleto(ticketNumber) &&
            (ticket.Status === 6 || ticket.Status === 9)
          ) {
            setShowInformationTicket(true);
          } else {
            setShowInformationTicket(false);
            setShowButtons(false);
          }

          setUnauthorizedTicket(ticket);
          setLoadingTicket(false);
          Get(`/egm-meter/v1/${ticket.PrintedIn}?Time=${ticket.PrintedAt}`).then((res) => {
            if(res.length === 0){
              setCounterInfo([]);
              setNotFoundContadores(true)
              return;
            }
            setCounterInfo(res);
          });
        })
        .catch((error) => {
          setLoadingTicket(false);
          if (error.response.status === 404) {
            setNotFoundContadores(true)
            NotifyUser.Warning("No se han encontrado tickets que coincidan con tu búsqueda.");
            setUnauthorizedTicket();
            return;
          }
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
        headers: { Authorization: `${TokenType} ${AccessToken}` },
      }
    )
      .then((res) => {
        navigate("/egm-operation-auditor");
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
              showInformationTicket={showInformationTicket}
              counterInfo={counterInfo}
              data={unauthorizedTicket}
              showButtons={showButtons}
              setConfirmAuthorization={setConfirmAuthorization}
              onContinue={handleTicketNumberClean}
              notFoundContadores={notFoundContadores}
            />
          )}
          <Captcha
            title={"Para confirmar la autorización del ticket clickeá el número"}
            onContinue={correctValidationCaptcha}
            open={confirmAuthorization}
            onCancel={() => {
              setConfirmAuthorization(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default Ticket;
