import * as React from "react";
import {
  TableHead,
  TableContainer,
  TableCell,
  tableCellClasses,
  TableBody,
  Table,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "black",
    textTransform: "uppercase",
    margin: "0 auto",
  },
  typography: {
    fontWeight: "700",
    fontSize: "12px",
    marginLeft: "25px",
    marginBottom: "10px",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ListActivityMember = ({ visits }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        overflow: "auto",
        height: { xl: 650, lg: 650, md: 700 },
      }}
    >
      <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" sx={style.tableCell}>
              Fecha y Hora
            </StyledTableCell>
            <StyledTableCell align="center" sx={style.tableCell}>
              Actividad
            </StyledTableCell>
            <StyledTableCell align="center" sx={style.tableCell}>
              Información de la Actividad
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visits?.length < 1 && (
            <TableRow
              key={2}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                Sin datos
              </TableCell>
              <TableCell align="center">Sin datos</TableCell>
              <TableCell align="center">Sin datos</TableCell>
            </TableRow>
          )}
          {(visits || []).map((visit) => (
            <TableRow
              key={visit?.ID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                {new Date(visit.CreatedAt).toLocaleString().split(",")}
              </TableCell>
              <TableCell align="center">Check-In</TableCell>
              <TableCell align="center">
                Origen : {visit?.AreaID.slice(20, -1)} <br />
                Responsable: {visit.ID.slice(20, -1)}
                <br />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListActivityMember;
