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
import DescribeText from "./DescribeText";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "black",
    textTransform: "uppercase",
    margin: "0 auto",
  },
  typography: {
    fontSize: 14,
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
        height: "95%",
      }}
    >
      <Table sx={{ minWidth: 650 }} stickyHeader size="small">
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
                {new Date(visit.CreatedAt).toLocaleString("es-AR").split(",")}
              </TableCell>
              <TableCell align="center">Check-In</TableCell>
              <TableCell align="center">
                <DescribeText
                  ID={visit.UserID}
                  preFixApi={"user"}
                  style={style.typography}
                />
                <DescribeText
                  ID={visit.NetworkDeviceID}
                  preFixApi={"network-device"}
                  style={style.typography}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListActivityMember;
