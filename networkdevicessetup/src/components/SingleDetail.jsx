import {
  Fab,
  Grid,
  Paper,
  Table,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  TableBody,
  styled,
  FormControl,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";

import React from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  tableCell: {
    width: "250px",
    fontWeight: "700",
    color: "rgb(123, 128, 154)",
    textTransform: "uppercase",
    textAlign: "left",
    backgroundColor: "#ffffff",
  },
  table: {
    [`& .${tableCellClasses.root}`]: {
      borderBottom: "none",
    },
  },
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    // opacity: "80%",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function createData(name, quantity) {
  return { name, quantity };
}

const rol = [
  createData("Caja", 50),
  createData("CPU", 40),
  createData("Terminal de Autogestión", 33),
  createData("Cajero Automático", 0),
];

const NewDeviceRegister = ({ device }) => {
  const [role, setRole] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [configMode, setConfigMode] = useState(false);
  // eslint-disable-next-line
  const [name, setName] = useState("");
  // eslint-disable-next-line
  const [area, setArea] = useState("");

  return (
    device && (
      <>
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginTop: "10px",
            marginBottom: "5px",
            height: "100%",
          }}
        >
          <Grid item sx={{ width: "90%", height: "100%", margin: "0 auto" }}>
            <Paper sx={{ height: "95%", overflow: "auto" }}>
              <TableContainer>
                <Table size="small" sx={style.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell colSpan={8}>
                        Configuración
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Nombre</TableCell>
                      {editMode ? (
                        <TextField
                          onChange={(e) => setName(e.target.value)}
                          variant="standard"
                          sx={{ marginLeft: "10px", width: "300px" }}
                          defaultValue={device["Config"]["Name"]}
                        />
                      ) : (
                        <TableCell>{device["Config"]["Name"]}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Área</TableCell>
                      {editMode ? (
                        <TextField
                          variant="standard"
                          sx={{ marginLeft: "10px", width: "300px" }}
                          defaultValue={device["Config"]["AreaID"]}
                        />
                      ) : (
                        <TableCell>{device["Config"]["AreaID"]}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Rol</TableCell>
                      {editMode ? (
                        <FormControl
                          size="small"
                          variant="standard"
                          sx={{
                            marginLeft: "10px",
                            marginTop: "-2px",
                            width: "300px",
                          }}
                        >
                          <Select
                            size="small"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            label="role"
                          >
                            {rol.map((oneRole) => (
                              <MenuItem value={oneRole.name} key={oneRole.name}>
                                {oneRole.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TableCell>{device["Config"]["Profile"]}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Url</TableCell>
                      {editMode ? (
                        <TextField
                          size="small"
                          variant="standard"
                          sx={{ marginLeft: "10px", width: "300px" }}
                          defaultValue={device["Config"]["Url"]}
                        />
                      ) : (
                        <TableCell>{device["Config"]["Url"]}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>
                        IdlSecondsTimeout
                      </TableCell>
                      <TableCell>
                        {device["Config"]["IdleSecondsTimeout"]}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>IdleForceUrl</TableCell>
                      <TableCell>{device["Config"]["IdleForceUrl"]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Perisfericos</TableCell>
                      <TableRow>
                        {device["Config"]["Peripherals"]
                          ? Object.keys(device["Config"]["Peripherals"]).map(
                              (key) => {
                                return (
                                  <>
                                    <TableRow
                                      key={device["Config"]["Peripherals"][key]}
                                    >
                                      <TableCell>{key}:</TableCell>
                                      <TableCell>
                                        {device["Config"]["Peripherals"][key]}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                );
                              }
                            )
                          : null}
                      </TableRow>
                    </TableRow>
                  </TableRow>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setConfigMode(true)}
                  sx={{ marginLeft: "15px" }}
                >
                  Modo de Configuración
                </Button>

                {editMode ? (
                  <Fab
                    sx={{ marginBottom: "5px", marginRight: "5px" }}
                    color="primary"
                    aria-label="like"
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    <CheckIcon />
                  </Fab>
                ) : (
                  <Fab
                    onClick={() => {
                      setEditMode(true);
                    }}
                    sx={{ marginBottom: "5px", marginRight: "5px" }}
                    color="primary"
                    aria-label="like"
                  >
                    <EditIcon />
                  </Fab>
                )}
              </Box>
              <TableContainer>
                <Table size="small" sx={style.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell colSpan={8}>Detalle</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key={device.ID}>
                      <TableRow key={device.ID}>
                        <TableCell sx={style.tableCell}>Marca</TableCell>
                        <TableCell>{device["Properties"]["Brand"]}</TableCell>
                      </TableRow>
                      <TableRow key={device.ID}>
                        <TableCell sx={style.tableCell}>Modelo</TableCell>
                        <TableCell>{device["Properties"]["Model"]}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell sx={style.tableCell}>
                          Número de Serie
                        </TableCell>
                        <TableCell>{device["SerialNumber"]}</TableCell>
                      </TableRow>
                      {device.Type !== 1 && (
                        <>
                          <TableRow key={device.ID}>
                            <TableCell sx={style.tableCell}>
                              Arquitectura
                            </TableCell>
                            <TableCell>
                              {device["Properties"]["Arch"]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={style.tableCell}>RAM</TableCell>
                            <TableCell>{device["Properties"]["RAM"]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={style.tableCell}>CPU</TableCell>
                            <TableCell>{device["Properties"]["CPU"]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={style.tableCell}>
                              Sistema Operativo
                            </TableCell>
                            <TableCell>{device["Properties"]["OS"]}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={style.tableCell}>Hostname</TableCell>
                            <TableCell>
                              {device["Properties"]["Hostname"]}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={style.tableCell}>Usuario</TableCell>
                            <TableCell>
                              {device["Properties"]["User"]}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table sx={style.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>NICs</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableRow key={device.ID}>
                    {Object.keys(device["Properties"]["NICs"]).map((key) => (
                      <TableRow>
                        <TableCell sx={style.tableCell}>
                          {key.toUpperCase()}
                        </TableCell>
                        {Object.keys(device["Properties"]["NICs"][key]).map(
                          (subKey) => (
                            <TableCell>
                              {subKey.toUpperCase()}
                              {device["Properties"]["NICs"][key][subKey]}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableRow>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table sx={style.table} size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Periféricos</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableRow>
                    {device["Properties"]["Peripherals"].map((e) => {
                      return (
                        <TableRow>
                          <TableCell sx={style.tableCell}>{e.ID}</TableCell>
                          <TableCell>Nombre: {e.Name || "Sin datos"}</TableCell>
                          <TableCell>
                            Manufactura: {e?.Manufacturer || "Sin datos"}
                          </TableCell>
                          <TableCell>
                            Producto: {e.Product || " Sin datos"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableRow>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        <Dialog sx={{ zIndex: 250 }} open={configMode}>
          <DialogTitle>Dispositivo en modo de configuración</DialogTitle>
          <DialogContent>
            Verifique de reiniciar el dispositivo seleccionado para poder
            configurarlo correctamente.
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfigMode(false);
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default NewDeviceRegister;
