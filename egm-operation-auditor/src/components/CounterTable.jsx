import {
  Alert,
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tooltipClasses,
  tableCellClasses,
  TextField,
  Tooltip,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ApiContext } from "@oc/api-context";
import { FormatLocalCurrency } from "../utils/Intl";
import dayjs from "dayjs";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
    margin: "0 auto",
    lineHeight: "15px",
  },
  typography: {
    fontWeight: "700",
    fontSize: "12px",
    marginLeft: "25px",
    marginBottom: "10px",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
  },
  paper: {
    backgroundColor: "white",
    color: "black",
    maxWidth: "700px",
    height: { xl: "100%", lg: "50%" },
    position: "relative",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "30px",
    marginTop: "15px",
  },
  topTableCell: {
    color: "rgb(65, 67, 82)",
    fontWeight: "700",
    textTransform: "uppercase",
    margin: "0 auto",
    lineHeight: "15px",
  },
};

const styledTexFieldData = {
  dateTimePicket: {
    width: "25%",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff !important",
      borderRadius: "0px",
      border: "none",
      borderBottom: "solid 1px",
    },

    ".MuiInputBase-input": {
      WebkitTextFillColor: "#fff",
    },
    ".MuiInputLabel-root": {
      WebkitTextFillColor: "#fff",
    },
    ".MuiSvgIcon-root": {
      WebkitTextFillColor: "#fff",
      color: "#fff",
    },
  },
  autocomplete: {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff !important",
      borderRadius: "0px",
      border: "none",
      borderBottom: "solid 1px",
    },

    ".MuiInputBase-input": {
      WebkitTextFillColor: "#fff",
    },

    ".MuiSvgIcon-root": {
      WebkitTextFillColor: "#fff",
      color: "#fff",
    },
  },
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    fontWeight: 600,
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: "15px",
    border: "1px solid #dadde9",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const CounterTable = ({ data, counterInfo, setCounterInfo }) => {
  const [valueTimeFrom, setValueTimeFrom] = useState();
  const [valueTimeUntil, setValueTimeUntil] = useState();
  const [time1, setTime1] = useState();
  const [time2, setTime2] = useState();
  const { Get } = useContext(ApiContext);
  const [valueLimitCounter, setValueLimitCout] = useState(10);
  const [notFoundContadores, setNotFoundContadores] = useState(false);

  useLayoutEffect(() => {
    setTime1(data?.PrintedAt - 60 * 60000);
    setTime2(data?.PrintedAt + 10 * 60000);
    setValueTimeFrom(dayjs(new Date(data?.PrintedAt - 60 * 60000)));
    setValueTimeUntil(dayjs(new Date(data?.PrintedAt + 10 * 60000)));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getCounter();
    // eslint-disable-next-line
  }, [valueTimeFrom, valueTimeUntil, valueLimitCounter, time1, time2]);

  const getCounter = () => {
    if (data) {
      Get(
        `/egm-meter/v1/by-date/${data?.PrintedIn}?Time1=${time1}&Time2=${time2}&Limit=${valueLimitCounter}`
      )
        .then(({ data }) => {
          if (data.length === 0) {
            setCounterInfo(data);
            setNotFoundContadores(true);
          } else {
            setNotFoundContadores(false);
            setCounterInfo(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleChangeTimeFrom = (newValue) => {
    const timeInSeconds = new Date(newValue);
    setTime1(timeInSeconds.getTime());
    setValueTimeFrom(newValue);
  };

  const handleChangeTimeUntil = (value) => {
    const timeInSeconds = new Date(value);
    setTime2(timeInSeconds.getTime());
    setValueTimeUntil(value);
  };

  const handleChangeValueCouter = (e) => {
    setValueLimitCout(e.target.value);
  };

  return (
    <TableContainer component={Paper} sx={{ height: "100%" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" colSpan={15}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <h1>Contadores</h1>

                <DateTimePicker
                  label="Desde"
                  maxDate={new Date()}
                  value={valueTimeFrom}
                  onChange={handleChangeTimeFrom}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      disableUnderline
                      sx={styledTexFieldData.dateTimePicket}
                      {...params}
                    />
                  )}
                />

                <DateTimePicker
                  label="Hasta"
                  maxDate={new Date()}
                  value={valueTimeUntil}
                  onChange={handleChangeTimeUntil}
                  renderInput={(params) => (
                    <TextField
                      type="number"
                      size="small"
                      sx={styledTexFieldData.dateTimePicket}
                      {...params}
                    />
                  )}
                />
                <FormControl sx={{ width: { xl: "10%", md: "15%" } }}>
                  <InputLabel sx={{ color: "white" }}>Cantidad</InputLabel>
                  <Select
                    sx={styledTexFieldData.autocomplete}
                    size="small"
                    value={valueLimitCounter}
                    onChange={handleChangeValueCouter}
                    defaultValue={10}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={style.tableCell} align="left">
              Fecha
            </TableCell>
            <TableCell sx={style.tableCell} align="center">
              Evento
            </TableCell>
            <TableCell sx={style.tableCell} align="center">
              Total IN
            </TableCell>
            <TableCell sx={style.tableCell} align="center">
              Total OUT + <br /> HandPay
            </TableCell>
            <TableCell sx={style.tableCell} align="center">
              Bet
            </TableCell>
            <TableCell sx={style.tableCell} align="center">
              Jackpot + <br /> Win
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notFoundContadores ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                position: "relative",
                left: "60%",
                marginTop: "35%",
              }}
            >
              <Alert severity="warning">
                No se han encontrado contadores para este Ticket
              </Alert>
            </Box>
          ) : (
            <>
              {counterInfo?.map((contador) => (
                <TableRow
                  key={contador.Date}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {new Date(contador.Date)
                      .toLocaleString("es-AR")
                      .replace(",", "")}
                  </TableCell>
                  <TableCell component="th" align="center" scope="row">
                    {contador.Events || "Sin datos"}
                  </TableCell>
                  <TableCell component="th" align="center" scope="row">
                    {FormatLocalCurrency(contador.TotalIn) || "Sin datos"}
                  </TableCell>
                  <HtmlTooltip
                    title={
                      `TOTALOUT: ${FormatLocalCurrency(
                        contador.TotalOut
                      )} + HANDPAY: ${FormatLocalCurrency(contador.Handpay)}` ||
                      "Sin datos"
                    }
                  >
                    <TableCell align="center" component="th" scope="row">
                      {FormatLocalCurrency(
                        contador.TotalOut + contador.Handpay
                      ) || "Sin datos"}
                    </TableCell>
                  </HtmlTooltip>
                  <TableCell align="center" component="th" scope="row">
                    {FormatLocalCurrency(contador.Bets) || "Sin datos"}
                  </TableCell>
                  <HtmlTooltip
                    title={
                      `JACKPOT: ${FormatLocalCurrency(
                        contador.Jackpot
                      )} + WIN: ${FormatLocalCurrency(contador.Wins)} ` ||
                      "Sin datos"
                    }
                  >
                    <TableCell align="center" component="th" scope="row">
                      {FormatLocalCurrency(contador.Jackpot + contador.Wins) ||
                        "Sin datos"}
                    </TableCell>
                  </HtmlTooltip>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CounterTable;
