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
  Autocomplete,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "@oc/api-context";
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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const NewDeviceRegister = ({ device, setDispatchGet }) => {
  const { id } = useParams();
  const { Get, Post, Patch } = useContext(ApiContext);
  const [selectedRol, setSelectedRol] = useState({});
  const [area, setArea] = useState("");
  const [inputAutocomplete, setInputAutocomplete] = useState();
  const [areaResults, setAreaResults] = useState([]);
  const [areaDescription, setAreaDescription] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [networkProfile, setNetworkProfile] = useState([])
  const [selectedPeriferals, setSelectedPeriferals] = useState([])
  const [networkDevicePayload, setNetworDevicePayload] = useState({
      Name:null,
      ProfileID:null,
      AreaID :null,
  })

  useEffect(()=>{
    Get(`/network-device/v1/get-profiles`)
    .then(({ data }) => { 
      setNetworkProfile(data)
      
    })
    .catch((err) => console.log(err));
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    if (inputAutocomplete) {
      setArea(inputAutocomplete);
    } // eslint-disable-next-line
  }, [inputAutocomplete]);

  useEffect(() => {
    if (area?.length >= 3) {
      setLoadingApi(true);
      Get(`/area/v1/autocomplete/?Name=${area}`)
        .then(({ data }) => {
          const areaDescribe = data.map((area) => area.Describe);
          console.log(data)
          setNetworDevicePayload({...networkDevicePayload, AreaID:data[0].ID})
          setAreaResults(areaDescribe.flat());
        })
        .catch((err) => console.log(err));
    } else {
      setArea("");
      setAreaResults([]);
    }
    // eslint-disable-next-line
  }, [area]);

  const handleConfirmEdition = () => {
    console.log(networkDevicePayload)
    Post(`/network-device/v1/config-network-device/${id}`, networkDevicePayload)
    .then(({ data }) => {
      console.log(data)
      Patch(`/network-device/v1/config-update/${id}`, [
        {
          op: "add",
          path: `/Config/ConfigMode`,
          value: true,
        },
      ]).then(({ data }) => console.log(data));

      setDispatchGet(true);
    });
  };

  const selectedProfile = (e) =>{
    if(networkProfile){
      const selected = networkProfile.find(profile=>profile.Name===e.target.value)
      console.log(selected)
      setNetworDevicePayload({
        ...networkDevicePayload,
        ProfileID:selected.Id,
      })
      setSelectedRol(selected)
      setSelectedPeriferals(selected.Peripherals)
    }
  }


  return (
    device && (
      <>
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            marginTop: "25px",
            marginBottom: "5px",
            height: "100%",
          }}

        >
          <Grid item sx={{ width: "90%", height: "100%", margin: "0 auto" }}>
            <Paper sx={{ height: "90%", overflow: "auto" }}>
              <TableContainer>
                <Table size="small" sx={style.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell colSpan={8}>Configuración</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Nombre</TableCell>
                      <TableCell>
                        <TextField
                          sx={{ marginLeft: "10px", width: "300px" }}
                          onChange={(e) => setNetworDevicePayload({...networkDevicePayload, Name:e.target.value})}
                          size="small"
                          variant="standard"
                        />
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell sx={style.tableCell}>Área</TableCell>
                      <TableCell>
                        <Autocomplete
                          id="Area"
                          size="small"
                          options={areaResults}
                          includeInputInList
                          sx={{ marginLeft: "10px", width: "300px" }}
                          value={areaDescription}
                          onChange={(e, newValue) => {
                            setAreaDescription(newValue);
                            setArea(newValue);
                          }}
                          noOptionsText="Sin resultados"
                          inputValue={inputAutocomplete}
                          onInputChange={(e, newInputValue) => {
                            setInputAutocomplete(newInputValue);
                          }}
                          loading={loadingApi}
                          loadingText="Buscando..."
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              variant="standard"
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Perfil</TableCell>
                      <TableCell>
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
                            value={selectedRol.Name}
                            onChange={selectedProfile}
                            label="role"
                          >
                            {networkProfile.map((oneRole,index) => (
                              <MenuItem
                                size="small"
                                value={oneRole.Name}
                                key={index}
                              >
                                {oneRole.Name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={style.tableCell}>IP</TableCell>
                      <TableCell>
                        <TextField
                          sx={{ marginLeft: "10px", width: "300px" }}
                          onChange={(e) => setNetworDevicePayload({...networkDevicePayload, IP:e.target.value})}
                          size="small"
                          variant="standard"
                        />
                      </TableCell>
                    </TableRow>


                    <TableRow>
                      <TableCell sx={style.tableCell}>Tempo de Sesión</TableCell>
                      <TableCell>{selectedRol.IdleSecondsTimeout && selectedRol.IdleSecondsTimeout}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Url Forzada</TableCell>
                      <TableCell>{selectedRol.IdleForceUrl && selectedRol.IdleForceUrl}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Url</TableCell>
                      <TableCell>{selectedRol.DefaultUrl && selectedRol.DefaultUrl}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={style.tableCell}>Periféricos</TableCell>
                      <TableCell>
                        {selectedPeriferals?.length>0 ? null : Object.keys(selectedPeriferals).map(
                          (Key,index) =>
                            (selectedPeriferals[Key].Name + (index+1 === Object.keys(selectedPeriferals)?.length ? " ":", "))) }
                      </TableCell>
                    </TableRow>
                  </TableRow>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Fab
                  onClick={handleConfirmEdition}
                  sx={{ marginBottom: "5px", marginRight: "5px" }}
                  color="primary"
                  aria-label="like"
                >
                  <CheckIcon />
                </Fab>
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
                        <TableCell sx={style.tableCell}>Número de Serie</TableCell>
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
                            <TableCell sx={style.tableCell}>Sistema Operativo</TableCell>
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
                          <TableCell>Manufactura: {e?.Manufacturer || "Sin datos"}</TableCell>
                          <TableCell>Producto: {e.Product || " Sin datos"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableRow>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  );
};

export default NewDeviceRegister;
