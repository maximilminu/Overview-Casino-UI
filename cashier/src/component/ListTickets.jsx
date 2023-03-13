import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton, Paper } from "@mui/material";
import { Delete } from "@mui/icons-material";

import {
  FormatLocalCurrency,
  FormatLocalDateTime,
  FormatLocalDate,
  FormatLocalTime,
} from "../utils/Intl";
const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
  },
};

const ListTickets = ({ tickets, removeTicket }) => {
  return (
    <>
      <TableContainer
        sx={{
          backgroundColor: "third.main",
          marginTop: "30px",
          marginBottom: "100px",
        }}
        component={Paper}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={style.tableCell}>Ticket ID</TableCell>
              <TableCell sx={style.tableCell}>Código de Barras</TableCell>
              <TableCell sx={style.tableCell}>Fecha y Hora</TableCell>
              <TableCell sx={style.tableCell}>Máquina</TableCell>
              <TableCell align="right" sx={style.tableCell}>
                Monto
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.ID}>
                <TableCell>{ticket.ID}</TableCell>
                <TableCell>{ticket.Barcode}</TableCell>
                <TableCell>{FormatLocalDateTime(ticket.PrintedAt)}</TableCell>
                <TableCell>{ticket.PrintedIn}</TableCell>
                <TableCell sx={{ padding: "1px" }} align="right">
                  {FormatLocalCurrency(ticket.Amount)}
                </TableCell>
                <TableCell sx={{ padding: "1px" }} align="right">
                  <IconButton
                    onClick={() => {
                      removeTicket(ticket);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListTickets;
