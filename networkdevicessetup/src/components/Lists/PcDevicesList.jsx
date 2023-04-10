import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import InteractionDevicesIcon from "../InteractionDevicesIcon";

const style = {
  tableCell: {
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    height: "50px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PcDevicesList = ({ pcs }) => {
  const navigate = useNavigate();

  const handleClick = (device) => {
    navigate(`setup/${device.ID}`);
  };

  return (
    <TableContainer
      component={Paper}
      id="hola"
      sx={{
        overflow: "auto",
        maxHeight: "100%",
      }}
    >
      <Table
        stickyHeader
        aria-label="sticky table"
        size="small"
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <StyledTableCell sx={style.tableCell}>Nombre</StyledTableCell>
            <StyledTableCell sx={style.tableCell}>Descripción</StyledTableCell>
            <StyledTableCell sx={style.tableCell}>Ubicación</StyledTableCell>
            <StyledTableCell sx={style.tableCell}>IP</StyledTableCell>
            <StyledTableCell sx={style.tableCell}>Rol</StyledTableCell>
            <StyledTableCell sx={style.tableCell}>Periféricos</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pcs.map((device) => (
            <StyledTableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                " &:hover": {
                  backgroundColor: "#e5e5e5",
                },
                cursor: "pointer",
                transition: "all .2s ease-in",
              }}
              onClick={() => {
                handleClick(device);
              }}
              key={device.ID}
            >
              <TableCell align="center">{device["Config"]["Name"]}</TableCell>
              <TableCell align="center">
                {device["Properties"]["Brand"]} {device["Properties"]["Model"]}
              </TableCell>
              <TableCell align="center">{device["Config"]["AreaID"]}</TableCell>
              <TableRow align="center">
                {Object.keys(device["Properties"]["NICs"]).map((key) => (
                  <TableCell>
                    {Object.keys(device["Properties"]["NICs"][key]).map(
                      (subKey) => (
                        <Typography sx={{ fontSize: "15px" }}>
                          {subKey}:{device["Properties"]["NICs"][key][subKey]}
                        </Typography>
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableCell align="center">
                {device["Config"]["Profile"]}
              </TableCell>
              <TableCell align="center">
                {Object.keys(device["Config"]["Peripherals"]).map((key) => (
                  <Tooltip
                    key={device["Config"]["Peripherals"][key]}
                    title={device["Config"]["Peripherals"][key]}
                  >
                    <i>
                      <InteractionDevicesIcon
                        media={key}
                        width={24}
                        height={24}
                      />
                    </i>
                  </Tooltip>
                ))}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PcDevicesList;
