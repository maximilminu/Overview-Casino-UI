import { Backdrop } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Captcha from "../components/Captcha";
import SingleTicketView from "../components/SingleTicketView";
import Roulette from "../components/Spinner/Roulette";
import { NotifyUserContext } from "@oc/notify-user-context";
import { ApiContext } from "@oc/api-context";
import { useNavigate } from "react-router-dom";

const Ticket = () => {
  const [showInformationTicket, setShowInformationTicket] = useState(false);
  const [counterInfo, setCounterInfo] = useState([]);

  const [ticketNumber, setTicketNumber] = useState("");
  const [loadingTicket, setLoadingTicket] = useState(false);
  const AccessToken = localStorage.getItem("AccessToken");
  const TokenType = localStorage.getItem("TokenType");
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Post } = useContext(ApiContext);
  const [showButtons, setShowButtons] = useState(false);
  const [confirmAuthorization, setConfirmAuthorization] = useState(false);
  const [originalTicket, setOriginalTicket] = useState();
  const [backupTicket, setBackupTicket] = useState();
  // eslint-disable-next-line
  const [valueTicket, setValueTicket] = useState("");
  const navigate = useNavigate();
  const { number } = useParams();

  useEffect(() => {
    setTicketNumber(number);
    setValueTicket(number);
    setShowButtons(false);
    setShowInformationTicket(false);
  }, [number]);

  const handleTicketNumberClean = () => {
    setTicketNumber("");
    setValueTicket("");
    setOriginalTicket({});
    setBackupTicket({});
    setCounterInfo([]);
    setShowButtons(false);
  };

  useEffect(() => {
    if (ticketNumber.length >= 13) {
      setLoadingTicket(true);
      Get(`/ticket/v1/by-number/${ticketNumber}`)
        .then((ticket) => {
          console.log("TICKET,", ticket);
          const { ReplaceBy, BarcodeOriginal } = ticket.data;
          if (ReplaceBy) {
            setOriginalTicket(ticket.data);
            Get(`/ticket/v1/by-number/${ReplaceBy}`).then((backup) => {
              const { AuthorizedBy, Status } = backup.data;
              if (!AuthorizedBy && Status === 13) {
                setShowButtons(true);
              } else if (Status === 6 || Status === 9) {
                setShowInformationTicket(true);
              }
              setBackupTicket(backup.data);
              setLoadingTicket(false);
            });
          }
          if (BarcodeOriginal) {
            const { AuthorizedBy, Status, AuthorizedAt } = ticket.data;
            if (!AuthorizedBy && !AuthorizedAt && Status === 13) {
              setShowButtons(true);
            } else if (Status === 6 || Status === 9) {
              setShowInformationTicket(true);
            }
            setBackupTicket(ticket.data);
            Get(`/ticket/v1/by-number/${BarcodeOriginal}`).then((original) => {
              setOriginalTicket(original.data);
              setLoadingTicket(false);
            });
          } else {
            setOriginalTicket(ticket.data);
            setShowButtons(false);
            setShowInformationTicket(false);
          }
        })
        .catch((error) => {
          setLoadingTicket(false);
          if (error.response.status === 404) {
            NotifyUser.Warning(
              "No se han encontrado tickets que coincidan con tu búsqueda."
            );
            setOriginalTicket();
            setBackupTicket();
            return;
          }
        });
    }
    // eslint-disable-next-line
  }, [ticketNumber]);

  function correctValidationCaptcha() {
    const { ID } = backupTicket;
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
          {originalTicket && (
            <SingleTicketView
              setCounterInfo={setCounterInfo}
              counterInfo={counterInfo}
              backupTicket={backupTicket}
              originalTicket={originalTicket}
              showInformationTicket={showInformationTicket}
              showButtons={showButtons}
              setConfirmAuthorization={setConfirmAuthorization}
              onContinue={handleTicketNumberClean}
            />
          )}
          <Captcha
            title={"Confirme la autorización seleccionando el número:"}
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
