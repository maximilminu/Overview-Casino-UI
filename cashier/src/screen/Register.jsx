import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useLayoutEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { ApiContext } from "@oc/api-context";
import { FormatLocalCurrency } from "../utils/Intl";
import { EscPosPrinterContext } from "@oc/escpos-printer-context";
import { print } from "../utils/PrintUtils";
import { NotifyUserContext } from "@oc/notify-user-context";
import { Link, useOutletContext } from "react-router-dom";
import InformationAccordion from "../component/InformationAccordion";
import DialogLogInSupervisor from "../component/DialogLogInSupervisor";
import ConfirmDialog from "../component/ConfirmDialog";
import Tokens from "../component/Tokens";

const Register = (props) => {
  const theme = useTheme();
  const { Printer } = useContext(EscPosPrinterContext);
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Post, logInSupervisor } = useContext(ApiContext);
  const [denominations, setDenominations] = useState([]);
  const [tolerance, setTolerance] = useState(500);
  const [bills, setBills] = useState({});
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [showAccordionInformation, setShowAccordionInformation] =
    useState(false);
  const [register, setRegister] = useState({});
  const [supervisionModal, setSupervisionModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showConfirmTicketDialog, setShowConfirmTicketDialog] = useState(false);
  const [balanceMadeBySupervisor, setBalanceMadeBySupervisor] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [showConfirmButton, setShowConfirmButton] = useState(true);
  const [showSupervisionAccordion, setShowSupervisionAccordion] =
    useState(false);
  // eslint-disable-next-line
  const [disable, setDisable] = useOutletContext();
  const [showAlertFailedBalance, setShowAlertFailedBalance] = useState(false);
  const [totalBillsBySupervisor, setTotalBillsBySupervisor] = useState(0);
  const [billsBySupervisor, setBillsBySupervisor] = useState(0);
  const [closeWithoutFail, setCloseWithoutFail] = useState(false);
  const [closeWithFail, setCloseWithFail] = useState(false);
  const [handleChangePassword, setHandleChangePassword] = useState("");
  const [handleChangeEmail, setHandleChangeEmail] = useState("");
  const [supervisorToken, setSupervisorToken] = useState();
  const [showFinishOperationButtons, setShowFinishOperationButtons] =
    useState(false);
  const [showActualMoney, setShowActualMoney] = useState(true);
  const [supervisorName, setSupervisorName] = useState();
  const [usdDenomination, setUsdDenomination] = useState([]);
  const [usdBills, setUsdBills] = useState(0);
  const [totalUsdBills, setTotalUsdBills] = useState(0);

  useLayoutEffect(() => {
    //Get("/api/config")
    const denoms = [1000, 500, 200, 100, 50, 20, 10];
    const usdDenoms = [100, 50, 10, 5, 1];
    setUsdDenomination(usdDenoms);
    setDenominations(denoms);
    setTolerance(500);
    const bls = {};
    const usdBls = {};
    usdDenoms.forEach((d) => {
      usdBls[d] = 0;
    });
    denoms.forEach((d) => (bls[d] = 0));
    setBills(bls);
    setUsdBills(usdBls);
    setBillsBySupervisor(bls);
  }, []);
  console.log(usdBills);

  const handleBillChange = (denom, amount) => {
    const b = Object.assign({}, bills, {
      [denom]: Number.parseInt(amount) || 0,
    });
    const t = denominations.reduce((sum, deno) => (sum += deno * b[deno]), 0);
    setTotalBills(t);
    setBills(b);
  };

  const handleBillBySupervisorChange = (denom, amount) => {
    const b = Object.assign({}, billsBySupervisor, {
      [denom]: Number.parseInt(amount) || 0,
    });
    const t = denominations.reduce((sum, deno) => (sum += deno * b[deno]), 0);
    setTotalBillsBySupervisor(t);
    setBillsBySupervisor(b);
  };

  const handleUsdBills = (denom, amount) => {
    console.log(denom, "denom");
    console.log(amount, "amount");
    const b = Object.assign({}, usdBills, {
      [denom]: Number.parseInt(amount) || 0,
    });
    const t = usdDenomination.reduce((sum, deno) => (sum += deno * b[deno]), 0);
    setTotalUsdBills(t);
    setUsdBills(b);
  };
  console.log(totalUsdBills);
  const handleSubmitSupervisorLogin = () => {
    logInSupervisor({
      Email: handleChangeEmail,
      Password: handleChangePassword,
    })
      .then(({ data }) => {
        setSupervisorName(jwt_decode(data.access_token).Profile.FullName);
        setSupervisorToken(data.access_token);
        setSupervisionModal(false);
        setDisabledInputs(true);
        setShowSupervisionAccordion(true);
        setShowAlertFailedBalance(false);
        setShowConfirmButton(true);
      })
      .catch((error) => {
        if (error.message === "401") {
          NotifyUser.Warning(
            "Credenciales inválidas, verifique los datos ingresados"
          );
        }
      });
  };
  // eslint-disable-next-line
  const sortFn = (a, b) => {
    return a.CreatedAt - b.CreateAt;
  };

  const handleSave = () => {
    register.CreatedAt = Date.now();
    register.WorkingDate = Date.now();
    register.Bills = balanceMadeBySupervisor ? billsBySupervisor : bills;
    if (balanceMadeBySupervisor) {
      register.Authorizing = {
        FullName: supervisorName,
        Role: "Jefe de cajas",
      };
    }
    register.Qty = 3;
    register.Round = 2;
    register.TotalIn = parseFloat(
      (register.TotalTreasureToCashier + register.TotalIssuedTickets).toFixed(
        register.Round
      )
    );
    register.TotalOut = parseFloat(
      register.TotalPaidTickets.toFixed(register.Round)
    );
    register.TotalBills = balanceMadeBySupervisor
      ? register.FailedBalance.TotalAmount
      : register.TotalAmount;

    register.Tolerance = Number(tolerance);
    register.OverTolerance = Math.abs(register.Balance) > register.Tolerance;
    register.UnderTolerance = Math.abs(register.Balance) < -register.Tolerance;
    if (register?.FailedBalance?.BalanceBySupervisor) {
      register.OverToleranceBySupervisor =
        Math.abs(register.FailedBalance.BalanceBySupervisor) >
        register.Tolerance;
      register.UnderToleranceBySupervisor =
        Math.abs(register.FailedBalance.BalanceBySupervisor) <
        -register.Tolerance;
    }

    const url =
      "https://audit.overview.casino/cashier-register/6a345f90-3cbd-4446-8779-64c2fc52480b";

    Printer.makeQr(url).then((qr) => {
      Printer.print(print(register, qr, url), (err) =>
        NotifyUser.Error("Problemas para imprimir: " + err)
      );
    });
  };

  const handleConfirmBalance = async () => {
    Post(`/register/v1/current`, {
      Bills: bills,
    })
      .then((currentResponse) => {
        Get("/register/v1/register-history")
          .then((historyResponse) => {
            // const result = historyResponse.data
            //   .concat(currentResponse.data.TreasureToCashierHistory)
            //   .sort(sortFn);

            // setRegister({
            //   ...currentResponse.data,
            //   RegisterHistory: result,
            // });
            setRegister({
              ...currentResponse.data,
              RegisterHistory: historyResponse.data,
            });
            setShowAccordionInformation(true);
            setBalance(currentResponse.Balance);
            setShowConfirmButton(false);
            setDisabledInputs(true);
            if (Math.abs(currentResponse.Balance) >= tolerance) {
              setShowAlertFailedBalance(true);
            } else {
              setCloseWithoutFail(true);
            }
          })
          .catch((err) => {
            NotifyUser.Warning(
              "Error para obtener el registro de balances del día."
            );
          });
      })
      .catch((err) => {
        if (err.response.status === 500) {
          NotifyUser.Warning(
            "Primero debes completar los datos del arqueo para continuar."
          );
        }
      });
  };

  const handleConfirmBalanceBySupervisor = async () => {
    Post("/register/v1/balance-authorization", {
      BillsBySupervisor: billsBySupervisor,
      SupervisorToken: supervisorToken,
      BalanceID: register.ID,
    }).then(({ data }) => {
      setRegister({ ...register, FailedBalance: data.FailedBalance });
      register.BalanceBySupervisor = data.FailedBalance.BalanceBySupervisor;
      setBalanceMadeBySupervisor(data.FailedBalance.BalanceBySupervisor);
      Math.abs(data.FailedBalance.BalanceBySupervisor) <= tolerance
        ? setCloseWithoutFail(true)
        : setCloseWithFail(true);
    });
  };

  return (
    <>
      <Grid
        container
        sx={{
          flexWrap: "nowrap",
          justifyContent: "space-around",
          paddingBottom: 2,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Grid
          lg={4}
          md={5}
          sx={{
            marginTop: "30px",
            marginLeft: "30px",
            height: "90%",
          }}
          item
        >
          <Tokens
            denominations={denominations}
            showSupervisionAccordion={showSupervisionAccordion}
            disabledInputs={disabledInputs}
            handleBillBySupervisorChange={handleBillBySupervisorChange}
            billsBySupervisor={billsBySupervisor}
            bills={bills}
            handleBillChange={handleBillChange}
            usdBills={usdBills}
            handleUsdBills={handleUsdBills}
            usdDenomination={usdDenomination}
          />
        </Grid>

        <Grid
          item
          sx={{
            flexGrow: 1,
            padding: "30px",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
          container
        >
          <InformationAccordion
            totalBillsBySupervisor={totalBillsBySupervisor}
            totalBills={totalBills}
            bills={bills}
            billsBySupervisor={billsBySupervisor}
            showSupervisionAccordion={showSupervisionAccordion}
            denominations={denominations}
            usdBills={usdBills}
            usdDenomination={usdDenomination}
            register={register}
            showActualMoney={showActualMoney}
            showAccordionInformation={showAccordionInformation}
            totalUsdBills={totalUsdBills}
          />

          <Grid item sx={{ flexDirection: "column" }} container>
            <Grid item>
              <Typography>Balance</Typography>
            </Grid>
            <Grid item>
              {showSupervisionAccordion ? (
                <Typography
                  variant="h3"
                  sx={{
                    color:
                      Math.abs(
                        balanceMadeBySupervisor
                          ? balanceMadeBySupervisor
                          : totalBillsBySupervisor
                      ) <= tolerance
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {balanceMadeBySupervisor
                    ? FormatLocalCurrency(balanceMadeBySupervisor)
                    : FormatLocalCurrency(totalBillsBySupervisor)}
                </Typography>
              ) : (
                <Typography
                  variant="h3"
                  sx={{
                    color:
                      Math.abs(balance) <= tolerance
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {register.TreasureToCashierHistory
                    ? FormatLocalCurrency(balance)
                    : FormatLocalCurrency(totalBills + totalUsdBills)}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {showConfirmButton && (
                <Button
                  variant="contained"
                  sx={{
                    padding: "15px",
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    if (showSupervisionAccordion) {
                      handleConfirmBalanceBySupervisor();
                      setShowActualMoney(true);
                      setShowConfirmButton(false);
                      setDisabledInputs(false);
                      setShowAccordionInformation(true);
                    } else {
                      handleConfirmBalance();
                      setDisable(true);
                    }
                  }}
                >
                  Confirmar arqueo
                </Button>
              )}

              {showAlertFailedBalance && (
                <Button
                  onClick={() => {
                    setSupervisionModal(true);
                    setShowAccordionInformation(false);
                    setShowActualMoney(false);
                  }}
                  variant="contained"
                >
                  Llamar supervisor
                </Button>
              )}

              {showFinishOperationButtons && (
                <Box
                  sx={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  <Link
                    style={{ textDecoration: "none" }}
                    onClick={setDisable(false)}
                    to="/cashier/pay"
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        color: "secondary.main",
                        borderColor: "secondary.main",
                        "&:hover": {
                          borderColor: "secondary.main",
                          color: "secondary.main",
                        },
                      }}
                    >
                      Seguir trabajando
                    </Button>
                  </Link>
                  <Link
                    style={{ textDecoration: "none" }}
                    onClick={setDisable(false)}
                    to="/cashier"
                  >
                    <Button variant="contained">Cerrar caja</Button>
                  </Link>
                </Box>
              )}

              <ConfirmDialog
                open={showConfirmTicketDialog}
                title={"¡Arqueo realizado con éxito!"}
                textFirstButton={"Re imprimir ticket"}
                textSecondButton={"Terminar"}
                onConfirm={handleSave}
                onFinishOperation={() => {
                  setShowConfirmTicketDialog(false);
                  setShowFinishOperationButtons(true);
                }}
              />

              {closeWithoutFail && (
                <Button
                  onClick={() => {
                    handleSave();
                    setShowConfirmTicketDialog(true);
                    setCloseWithoutFail(false);
                  }}
                  sx={{
                    backgroundColor: theme.palette.success.main,
                    "&:hover": { backgroundColor: theme.palette.success.main },
                  }}
                  variant="contained"
                >
                  Cerrar caja sin fallo
                </Button>
              )}

              {closeWithFail && (
                <Button
                  onClick={() => {
                    handleSave();
                    setCloseWithFail(false);
                    setShowConfirmTicketDialog(true);
                  }}
                  variant="contained"
                >
                  Cerrar caja con fallo
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <DialogLogInSupervisor
        open={supervisionModal}
        emailChange={setHandleChangeEmail}
        passwordChange={setHandleChangePassword}
        onContinue={() => handleSubmitSupervisorLogin()}
      />
    </>
  );
};

export default Register;
