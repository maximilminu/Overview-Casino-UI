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
  Collapse,
  IconButton,
} from "@mui/material";
import DescribeText from "./DescribeText";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Fragment } from "react";

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

function CollapseTable(props) {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={props.open === props.idx} timeout="auto" unmountOnExit>
          <Table size="small" aria-label="purchases" sx={{ marginTop: "-5px" }}>
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell>Terminal</TableCell>
                {props.data &&
                  props.data.CheckIn &&
                  props.data.CheckIn.PrintQty && (
                    <TableCell>Reimpresiones</TableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data &&
                [...(props.data.Attempts || []), props.data.CheckIn || {}]
                  .filter((j) => j.CreatedAt)
                  .sort((a, b) => a.CreatedAt - b.CreatedAt)
                  .map((attempt, idx) => {
                    return (
                      <TableRow
                        key={idx}
                        sx={{
                          backgroundColor: !attempt.Reason && "success.light",
                        }}
                      >
                        <TableCell>
                          {
                            new Date(attempt.CreatedAt)
                              .toLocaleString("es-AR")
                              .split(",")[1]
                          }
                        </TableCell>
                        <TableCell>
                          {attempt.Reason === "ALREADY_REPORTED" ||
                          attempt.Reason ===
                            "This member has already checked-in today"
                            ? "Check-in ya realizado"
                            : attempt.Reason === "Banned" ||
                              attempt.Reason === "BANNED"
                            ? "Programa juego responsable"
                            : attempt.Reason === "UnderAge" ||
                              attempt.Reason === "UNDER_AGE"
                            ? "Menor de edad"
                            : !attempt.Reason
                            ? "Check-in"
                            : attempt.Reason}
                        </TableCell>
                        <TableCell>
                          <DescribeText
                            ID={attempt.UserID}
                            preFixApi={"user"}
                            style={style.typography}
                          />
                        </TableCell>
                        <TableCell>
                          <DescribeText
                            ID={attempt.NetworkDeviceID}
                            preFixApi={"network-device"}
                            style={style.typography}
                          />
                        </TableCell>
                        {attempt.PrintQty && (
                          <TableCell>{attempt.PrintQty}</TableCell>
                        )}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}

export default function ListActivityMember({ visits }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = (event, idx) => {
    setOpen(idx);
  };
  const { visitID } = useParams();
  useEffect(() => {
    if (visitID) {
      setOpen(visitID);
    }
  }, [visitID]);
  return (
    <TableContainer
      component={Paper}
      sx={{
        overflow: "auto",
        maxHeight: "95%",
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell align="left" sx={style.tableCell}>
              Fecha
            </StyledTableCell>
            <StyledTableCell align="center" sx={style.tableCell}>
              Actividad
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visits && visits.length === 0 && (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Sin actividades registradas.</TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}
          {visits &&
            visits.map((visit) => (
              <Fragment key={visit.ID}>
                <TableRow>
                  <TableCell>
                    {
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(event) => {
                          if (open === visit.ID) {
                            setOpen(false);
                          } else {
                            handleClickOpen(event, visit.ID);
                          }
                        }}
                      >
                        {open === visit.ID ? (
                          <KeyboardArrowUpIcon fontSize="small" />
                        ) : (
                          <KeyboardArrowDownIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                  </TableCell>
                  <TableCell>
                    {
                      new Date(visit.CreatedAt)
                        .toLocaleString("es-AR")
                        .split(",")[0]
                    }
                  </TableCell>
                  <TableCell align="center">
                    {visit.CheckIn
                      ? `Check-In${
                          visit.Attempts && visit.Attempts.length > 0
                            ? ` (${visit.Attempts.length} intentos)`
                            : ""
                        }`
                      : visit.Attempts && visit.Attempts.length > 0
                      ? `${visit.Attempts.length} intentos`
                      : ""}
                  </TableCell>
                </TableRow>
                <CollapseTable open={open} idx={visit.ID} data={visit} />
              </Fragment>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
