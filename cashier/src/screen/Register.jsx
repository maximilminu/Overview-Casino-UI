import { ExpandMore } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ApiContext } from "../context/ApiContext";
import {
  FormatLocalCurrency,
  FormatLocalDateTime,
  FormatLocalDate,
  FormatLocalTime,
} from "../utils/Intl";
import { EscPosPrinterContext } from "../context/EscPosPrinterContext";
import { NotifyUserContext } from "../context/NotifyUserContext";

const printTitle = (printer, title) => {
  printer
    .align("ct")
    .style("normal")
    .size(0, 0)
    .text("─".repeat(45))
    .size(1, 0)
    .style("b");
  (Array.isArray(title) ? title : [title]).forEach((t) => printer.text(t));
  printer.style("normal").size(0, 0).text("─".repeat(45));
};

const printSignature = (printer, name, title) => {
  printer
    .align("ct")
    .style("normal")
    .size(0, 0)
    .feed(7)
    .text("-".repeat(30))
    .size(1, 0)
    .style("b")
    .text(name)
    .style("normal")
    .size(0, 0)
    .text(title)
    .size(0, 0);
};

const printFailure = (printer, data) => {
  if (data.OverTolerance) {
    printer
      .feed(2)
      .style("b")
      .size(1, 1)
      .align("ct")
      .text("FALLO - SOBRANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer.text("Tolerancia: " + FormatLocalCurrency(data.Tolerance));
    }
  }
  if (data.UnderTolerance) {
    printer
      .feed(2)
      .style("b")
      .size(1, 1)
      .align("ct")
      .text("FALLO - FALTANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer.text("Tolerancia: " + FormatLocalCurrency(data.Tolerance));
    }
  }
};

const printDescValue = (
  printer,
  description,
  value,
  style = "normal",
  width = 48,
  sign = false
) => {
  let val;
  if (!sign) {
    val =
      FormatLocalCurrency(Math.abs(value)) + (value < 0 ? " ".repeat(15) : "");
  } else {
    val = FormatLocalCurrency(value);
  }
  const w = width - (description.length + val.length);
  printer
    .style(style)
    .align("lt")
    .text(
      (w < 1 ? description.substring(0, w - 1) : description) +
        (w > 0 ? " ".repeat(w) : "") +
        val
    );
};

const print = (data, qr, url) => (printer) =>
  new Promise((resolve) => {
    printFailure(printer, data);

    printTitle(printer, [
      "Arqueo de caja",
      "",
      data.RegisteredBy.FullName,
      data.Qty + "° del " + FormatLocalDate(new Date(data.WorkingDate)),
      FormatLocalDateTime(new Date(data.CreatedAt)),
    ]);

    printTitle(printer, "Estado actual");

    printer
      .align("lt")
      .style("b")
      .text(
        `${" Denomin. x Cantidad".padEnd(20, " ")}${" ".repeat(
          6
        )}${"SubTotal".padStart(20, " ")}`
      )
      .style("normal");

    Object.keys(data.Bills)
      .sort((a, b) => b - a)
      .forEach((denom) =>
        printer.text(
          `${`$ ${String(denom).padStart(7, " ")} x ${String(
            data.Bills[denom]
          ).padStart(8, " ")}`}${" ".repeat(6)}${FormatLocalCurrency(
            denom * data.Bills[denom]
          ).padStart(20, " ")}`
        )
      );

    printTitle(printer, "Movimientos");
    printer.text("Descripción               Haber         Debe");
    data.RegisterHistory.forEach((ch) => {
      printDescValue(
        printer,
        `Arqueo parcial ${FormatLocalTime(ch.CreatedAt)}`,
        ch.Balance
      );
    });
    data.TreasureToCashierHistory.forEach((ch) =>
      printDescValue(
        printer,
        `${ch.Description} por ${ch.Treasurer.FullName}`,
        ch.Amount
      )
    );

    printDescValue(
      printer,
      "TOTAL PAGADOS",
      -data.PaidTickets.reduce((tot, cur) => (tot += cur.Amount), 0)
    );
    printDescValue(
      printer,
      "TOTAL EMITIDOS",
      data.IssuedTickets.reduce((tot, cur) => (tot += cur.Amount), 0)
    );

    printTitle(printer, "Resumen");
    printDescValue(printer, "Entradas", data.TotalIn);
    printDescValue(printer, "Salidas", -data.TotalOut);
    printDescValue(printer, "En caja", -data.TotalBills);
    printer.align("lt").style("b").size(1, 0).text("-".repeat(24));
    printDescValue(printer, "BALANCE", data.Balance, "b", 24, true);

    printFailure(printer, data);

    printer.size(0, 0).raster(qr).align("ct").text(url);

    printSignature(printer, data.RegisteredBy.FullName, "Cajero");
    if (data.Authorizing) {
      printSignature(printer, data.Authorizing.FullName, data.Authorizing.Role);
    }

    printFailure(printer, data);

    resolve();
  });

const Register = ({ userMenuRef }) => {
  const theme = useTheme();
  const { Printer } = useContext(EscPosPrinterContext);
  const NotifyUser = useContext(NotifyUserContext);
  const { Get, Post } = useContext(ApiContext);
  const [denominations, setDenominations] = useState([]);
  const [tolerance, setTolerance] = useState(0);
  const [bills, setBills] = useState({});
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [register, setRegister] = useState({
    TreasureToCashierHistory: [],
    PaidTickets: [],
    IssuedTickets: [],
    RegisterHistory: [],
  });

  const [balance, setBalance] = useState(0);
  const [totalTreasureToCashierHistory, setTotalTreasureToCashierHistory] =
    useState(0);
  const [totalPaidTickets, setTotalPaidTickets] = useState(0);
  const [totalIssuedTickets, setTotalIssuedTickets] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [showConfirmButton, setShowConfirmButton] = useState(true);
  const [showAccordion, setShowAccordion] = useState(true);

  const DeletedEntry = styled(TableRow)(({ theme }) => ({
    "&": {
      backgroundColor: theme.palette.error.light,
    },
  }));

  useLayoutEffect(() => {
    const denoms = [1000, 500, 200, 100, 50, 20, 10];
    setDenominations(denoms);
    setTolerance(0);
    const bls = {};
    denoms.forEach((d) => (bls[d] = 0));
    setBills(bls);
  }, []);

  const handleBillChange = (denom, amount) => {
    const b = Object.assign({}, bills, {
      [denom]: Number.parseInt(amount) || 0,
    });
    const t = denominations.reduce((sum, deno) => (sum += deno * b[deno]), 0);
    setTotalBills(t);
    setBills(b);
    setBalance(
      totalTreasureToCashierHistory - totalPaidTickets + totalIssuedTickets - t
    );
  };

  const handleSave = () => {
    register.CreatedAt = Date.now();
    register.WorkingDate = Date.now();
    register.Bills = bills;
    register.Authorizing = { FullName: "Juan Pomo", Role: "Jefe de cajas" };
    register.RegisterHistory = [
      {
        ID: "6a345f90-3cbd-4446-8779-64c2fc52480b",
        CreatedAt: Date.now(),
        Balance: 0.0,
      },
      {
        ID: "6a345f90-3cbd-4446-8779-64c2fc52480c",
        CreatedAt: Date.now(),
        Balance: -158.65,
      },
      {
        ID: "6a345f90-3cbd-4446-8779-64c2fc52480a",
        CreatedAt: Date.now(),
        Balance: 500.25,
      },
    ];
    register.Qty = 3;
    register.Round = 2;

    register.TotalIn = parseFloat(
      (
        register.TreasureToCashierHistory.reduce(
          (sum, ch) => sum + ch.Amount,
          0
        ) + register.IssuedTickets.reduce((tot, cur) => (tot += cur.Amount), 0)
      ).toFixed(register.Round)
    );

    register.TotalOut = parseFloat(
      register.PaidTickets.reduce((tot, cur) => (tot += cur.Amount), 0).toFixed(
        register.Round
      )
    );
    register.TotalBills = parseFloat(
      Object.keys(register.Bills)
        .reduce((sum, denom) => sum + register.Bills[denom] * denom, 0)
        .toFixed(register.Round)
    );

    register.Balance = balance;
    // register.Balance = parseFloat(
    //   Number(
    //     register.RegisterHistory.reduce((sum, r) => (sum += r.Balance), 0)
    //   ) +
    //     register.TotalIn -
    //     register.TotalOut -
    //     register.TotalBills
    //   //   register.TotalCurrent
    // ).toFixed(register.Round);

    register.Tolerance = Number(tolerance);
    register.OverTolerance = register.Balance > register.Tolerance;
    register.UnderTolerance = register.Balance < -register.Tolerance;
    const url =
      "https://audit.overview.casino/cashier-register/6a345f90-3cbd-4446-8779-64c2fc52480b";
    Printer.makeQr(url).then((qr) => {
      Printer.print(print(register, qr, url), (err) =>
        NotifyUser.Error("Problemas para imprimir: " + err)
      );
    });
  };

  const handleConfirmBalance = () => {
    Post(`/register/v1/current`, {
      Bills: bills,
      TotalAmount: totalBills,
    })
      .then((register) => {
        const tt = register.TreasureToCashierHistory.reduce(
          (sum, ch) => (sum += ch.Amount),
          0
        );
        const tp = register.PaidTickets.reduce(
          (sum, ch) => (sum += ch.Amount),
          0
        );
        const tm = register.IssuedTickets.reduce(
          (sum, ch) => (sum += ch.Amount),
          0
        );
        setShowAccordion(false);
        setShowConfirmButton(false);
        setTotalTreasureToCashierHistory(tt);
        setTotalPaidTickets(tp);
        setTotalIssuedTickets(tm);
        setDisabledInputs(true);
        setBalance(tt - tp + tm - totalBills);
        return register;
      })
      .then(setRegister)
      .then(() => {
        Get("/register/v1/register_history").then((res) => console.log(res));
      })

      .catch((err) => {
        if (err.response.status === 500) {
          NotifyUser.Warning(
            "Primero debes completar los datos del arqueo para continuar."
          );
        }
      });
  };

  return (
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
      <Grid lg={4} sx={{ marginTop: "30px", marginLeft: "30px" }} item>
        <Paper sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {denominations.map((denom, idx) => (
              <FormControl key={denom} fullWidth sx={{ marginY: 1 }}>
                <TextField
                  disabled={disabledInputs}
                  id={`input-${denom}`}
                  autoFocus={idx === 0}
                  label={`Billetes de $${denom}`}
                  value={bills[denom]}
                  size="small"
                  onChange={(event) => {
                    handleBillChange(denom, event.target.value);
                  }}
                  onFocus={(event) => {
                    event.target.select();
                  }}
                />
              </FormControl>
            ))}
          </Box>
        </Paper>
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
        <Grid
          item
          sx={{ flexGrow: 1, flexDirection: "column", overflow: "auto" }}
        >
          <Accordion
            disabled={showAccordion}
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
            >
              <Typography sx={{ width: "33%", flexGrow: 1 }}>
                Aportes desde caja central
              </Typography>
              <Box sx={{ flexGrow: "1" }}></Box>
              <Typography sx={{ color: "text.secondary" }}>
                {FormatLocalCurrency(totalTreasureToCashierHistory)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hora</TableCell>
                      <TableCell>Otorga</TableCell>
                      <TableCell>Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {register.TreasureToCashierHistory.map((ch) =>
                      ch.Deleted ? (
                        <DeletedEntry key={ch.CreatedAt}>
                          <TableCell>
                            {new Date(ch.CreatedAt).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {ch.Description} por {ch.Treasurer.FullName}
                          </TableCell>
                          <TableCell>
                            {FormatLocalCurrency(ch.Amount)}
                          </TableCell>
                        </DeletedEntry>
                      ) : (
                        <TableRow key={ch.CreatedAt}>
                          <TableCell>
                            {new Date(ch.CreatedAt).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            {ch.Description} por {ch.Treasurer.FullName}
                          </TableCell>
                          <TableCell>
                            {FormatLocalCurrency(ch.Amount)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disabled={showAccordion}
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
            >
              <Typography sx={{ width: "33%", flexGrow: 1 }}>
                Pagos realizados
              </Typography>
              <Box sx={{ flexGrow: "1" }}></Box>
              <Typography sx={{ color: "text.secondary" }}>
                {FormatLocalCurrency(totalPaidTickets)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hora</TableCell>
                      <TableCell>Número/Máquina</TableCell>
                      <TableCell>Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {register.PaidTickets.map((ch) => (
                      <TableRow key={ch.ID}>
                        <TableCell>
                          {new Date(ch.PrintedAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {ch.Barcode} / {ch.PrintedIn}
                        </TableCell>
                        <TableCell>{FormatLocalCurrency(ch.Amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion
            disabled={showAccordion}
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
            >
              <Typography sx={{ width: "33%", flexGrow: 1 }}>
                Tickets de vuelto
              </Typography>
              <Box sx={{ flexGrow: "1" }}></Box>
              <Typography sx={{ color: "text.secondary" }}>
                {FormatLocalCurrency(totalIssuedTickets)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hora</TableCell>
                      <TableCell>Número</TableCell>
                      <TableCell>Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {register.IssuedTickets.map((ch) => (
                      <TableRow key={ch.ID}>
                        <TableCell>
                          {new Date(ch.PrintedAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{ch.Barcode}</TableCell>
                        <TableCell>{FormatLocalCurrency(ch.Amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>

          <Accordion
            sx={{
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
            >
              <Typography sx={{ width: "33%", flexGrow: 1 }}>
                Dinero actual declarado
              </Typography>
              <Box sx={{ flexGrow: "1" }}></Box>
              <Typography sx={{ color: "text.secondary" }}>
                {FormatLocalCurrency(totalBills)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Denominación</TableCell>
                      <TableCell>Monto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {denominations.map((denom) => (
                      <TableRow key={denom}>
                        <TableCell>{denom}</TableCell>
                        <TableCell>$ {bills[denom] * denom}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item sx={{ flexDirection: "column" }} container>
          <Grid item>
            <Typography>Balance</Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h3"
              sx={{
                color:
                  Math.abs(balance) < tolerance
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
            >
              {register.TreasureToCashierHistory
                ? FormatLocalCurrency(balance)
                : "ERROR"}
            </Typography>
          </Grid>
          <Grid item>
            {showConfirmButton ? (
              <Button
                variant="contained"
                sx={{
                  padding: "15px",
                  fontSize: "15px",
                  backgroundColor:
                    Math.abs(balance) < tolerance
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
                onClick={() => {
                  handleConfirmBalance();
                }}
              >
                Confirmar arqueo
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  padding: "15px",
                  fontSize: "15px",
                  backgroundColor:
                    Math.abs(balance) < tolerance
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
                onClick={handleSave}
              >
                Imprimir resultado
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;
