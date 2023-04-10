import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import React from "react";
import { FormatLocalCurrency } from "../utils/Intl";

const style = {
  accordion: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};

const InformationAccordion = ({
  register,
  totalBills,
  showAccordionInformation,
  bills,
  totalBillsBySupervisor,
  showSupervisionAccordion,
  billsBySupervisor,
  showActualMoney,
  denominations,
  usdBills,
  usdDenomination,
  totalUsdBills,
}) => {
  return (
    <Grid item sx={{ flexGrow: 1, flexDirection: "column", overflow: "auto" }}>
      <Accordion disabled={!showAccordionInformation} sx={style.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ width: "33%", flexGrow: 1 }}>
            Aportes desde caja central
          </Typography>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Typography sx={{ color: "text.secondary" }}>
            {showAccordionInformation
              ? FormatLocalCurrency(register.TotalTreasureToCashier)
              : "---"}
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
                {register.TreasureToCashierHistory &&
                  register.TreasureToCashierHistory.map((ch) =>
                    ch.Deleted ? (
                      <TableRow
                        sx={{ backgroundColor: "red" }}
                        key={ch.CreatedAt}
                      >
                        <TableCell>
                          {new Date(ch.CreatedAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {ch.Description} por {ch.Treasurer.FullName}
                        </TableCell>
                        <TableCell>{FormatLocalCurrency(ch.Amount)}</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={ch.CreatedAt}>
                        <TableCell>
                          {new Date(ch.CreatedAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {ch.Description} por {ch.Treasurer.FullName}
                        </TableCell>
                        <TableCell>{FormatLocalCurrency(ch.Amount)}</TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled={!showAccordionInformation} sx={style.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ width: "33%", flexGrow: 1 }}>
            Pagos realizados
          </Typography>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Typography sx={{ color: "text.secondary" }}>
            {showAccordionInformation
              ? FormatLocalCurrency(register?.TotalPaidTickets)
              : "---"}
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
                {register.PaidTickets &&
                  register?.PaidTickets.map((ch) => (
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

      <Accordion disabled={!showAccordionInformation} sx={style.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ width: "33%", flexGrow: 1 }}>
            Tickets de vuelto
          </Typography>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Typography sx={{ color: "text.secondary" }}>
            {showAccordionInformation
              ? FormatLocalCurrency(register.TotalIssuedTickets)
              : "---"}
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
                {register.TotalIssuedTickets &&
                  register.IssuedTickets.map((ch) => (
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

      <Accordion disabled={!showActualMoney} sx={style.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ width: "33%", flexGrow: 1 }}>
            Dinero actual declarado ARS
          </Typography>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Typography sx={{ color: "text.secondary" }}>
            {showActualMoney ? FormatLocalCurrency(totalBills) : "---"}
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
                {denominations.map((denom) =>
                  bills[denom] * denom === 0 ? null : (
                    <TableRow key={denom}>
                      <TableCell>{denom}</TableCell>
                      <TableCell>$ {bills[denom] * denom}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled={!showActualMoney} sx={style.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography sx={{ width: "33%", flexGrow: 1 }}>
            Dinero actual declarado USD
          </Typography>
          <Box sx={{ flexGrow: "1" }}></Box>
          <Typography sx={{ color: "text.secondary" }}>
            {showActualMoney ? FormatLocalCurrency(totalUsdBills) : "---"}
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
                {usdDenomination.map((denom) =>
                  usdBills[denom] * denom === 0 ? null : (
                    <TableRow key={denom}>
                      <TableCell>{denom}</TableCell>
                      <TableCell>$ {usdBills[denom] * denom}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {showSupervisionAccordion && (
        <Accordion sx={style.accordion}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography sx={{ width: "33%", flexGrow: 1 }}>
              Dinero declarado por supervisor
            </Typography>
            <Box sx={{ flexGrow: "1" }}></Box>
            <Typography sx={{ color: "text.secondary" }}>
              {FormatLocalCurrency(totalBillsBySupervisor)}
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
                      <TableCell>
                        $ {billsBySupervisor[denom] * denom}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Grid>
  );
};

export default InformationAccordion;
