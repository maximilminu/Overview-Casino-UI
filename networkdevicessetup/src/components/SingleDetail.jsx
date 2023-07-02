import {Fab,Grid,Paper,Table,Autocomplete,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  TableBody,
  styled,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import { ApiContext } from "@oc/api-context";
import { useParams } from "react-router-dom";
import * as jsonpatch from "fast-json-patch/index.mjs";
import InteractionDevicesIcon from "./InteractionDevicesIcon";
import DescribeText from "./DescribeText";
import { NotifyUserContext } from "@oc/notify-user-context";

const style = {
  tableCell: {
    width: "20%",
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




const NewDeviceRegister = (props) => {
  const { id } = useParams();
  const { Patch } = useContext(ApiContext);
  const { Get } = useContext(ApiContext);
  const [editMode, setEditMode] = useState(false);
  const [configMode, setConfigMode] = useState(false);
  const [device, setDevice] = useState(props?.device);
  // eslint-disable-next-line
  const [data, setData] = useState(device.Config);
  const [area, setArea] = useState("");
  const [profileData,setProfileData] = useState({})
  const NotifyUser = useContext(NotifyUserContext)

  const [areaOptios, setImputOptions] = useState();
  const [areaResults, setAreaResults] = useState([]);
  const [areaDescription, setAreaDescription] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [networkProfile, setNetworkProfile] = useState([])



  useEffect(()=>{
    if(device){
      Get(`/network-device/v1/NetworkDeviceProfile/${device.Config.ProfileID}`).then(({ data }) => {
        setProfileData({ 
          ...data,
          url: data.DefaultUrl,
          ConfigUrl:data.ConfigUrl,
          IdleSecondsTimeout:data.IdleSecondsTimeout
        });
      });
      
    }
    // eslint-disable-next-line
  },[device])
  
  useEffect(()=>{
    Get(`/network-device/v1/get-profiles`)
    .then(({ data }) => { 
      setNetworkProfile(data)
    })
    .catch((err) => console.log(err));
    // eslint-disable-next-line
  },[])

  useEffect(() => {
    if (!device) {
      Get(`/network-device/v1/by-id/${id}`).then(({ data }) => {
        setDevice(data);
      });
    }
    Get(`/network-device/v1/describe-area/${device.Config.AreaID}`).then(({data})=>{
      setAreaDescription(data[0])
    }) 
    // eslint-disable-next-line
  }, []);

  const handleModifiedDevice = () => {
    const patch = jsonpatch.compare(device.Config, data);    
    patch.forEach((key) => {
      key.path = `/Config` + key.path;
    });
    const updateName = patch.find(pat=> pat.path === "/Config/Name")
    Get(`/network-device/v1/device-config-name/${device.Config.AreaID}/?Name=${encodeURIComponent(updateName!==undefined ? updateName.value : "")}`).then(({data})=>{
      if(data.length === 0){
      Patch(`/network-device/v1/config-update/${id}`, patch).then(({ data })=>
        { 
          setDevice(data)
        })
      }else{
        NotifyUser.Error("El Nombre que quiere ingresar para este dispositivo ya existe");
        return;
      }
    })
  };


const handleChangueSelect = (e, newValue)=>{
  // console.log("BUENAAAAAAAAAAAAAAS: ", newValue)
  // console.log(areaResults)
  const selectedArea = areaOptios.find(area => area.Describe[0] === newValue)
  setData({ ...data, AreaID: selectedArea.ID });
  //console.log("SOY EL AREA SELECCIONADA:   ",selectedArea)
}

  useEffect(() => {
    if (area?.length >= 3) {
      setLoadingApi(true);
      Get(`/area/v1/autocomplete/?Name=${area}`)
        .then(({ data }) => {
          const areaDescribe = data.map((area) => area.Describe);
          setImputOptions(data)
          setAreaResults(areaDescribe.flat());
        })
        .catch((err) => console.log(err));
    } else {
      setArea("");
      setAreaResults([]);
    }
    // eslint-disable-next-line
  }, [area]);

  const handleConfigModePatchActivate = () => {
    Patch(`/network-device/v1/config-update/${id}`, [
      {
        op: "replace",
        path: `/Config/ConfigMode`,
        value: true,
      },
    ]).then(({ data }) => {
      setDevice(data)
    
    });
  };
  const handleConfigModePatchDesactivate = () => {
    Patch(`/network-device/v1/config-update/${id}`, [
      {
        op: "replace",
        path: `/Config/ConfigMode`,
        value: false,
      },
    ]).then(({ data }) => setDevice(data));
  };

  return (
    device && (
      <>
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            height: "100%",
            alignItems: "center",
          }}
        >
          <Grid
            component={Paper}
            item
            sx={{
              width: "70%",
              height: "95%",
              margin: "0 auto",
              overflow: "auto",
            }}
          >
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
                    {editMode ? (
                      <TextField
                        onChange={(e) =>
                          setData({ ...data, Name: e.target.value })
                        }
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
                      <Autocomplete
                        id="Area"
                        size="small"
                        options={areaResults}
                        includeInputInList
                        sx={{ marginLeft: "10px", width: "300px" , padding:"5px 1px"}}
                        value={areaDescription}
                        onChange={handleChangueSelect}
                        noOptionsText="Sin resultados"
                        onInputChange={(e, newInputValue) => {
                          setArea(newInputValue);
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
                    ) : (
                      <Typography style={{padding:"6px 16px"}}>
                          <DescribeText
                            otherPath={`/network-device/v1/describe-area/${device.Config.AreaID}`}
                          />
                      </Typography>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={style.tableCell}>Perfil</TableCell>
                    {editMode ? (
                       <TableCell
                        sx={{
                          display:"flex",
                          justifyContent:"flex-start",
                          marginLeft:"-0.9rem"
                        }}
                       >
                         <Select
                            variant="standard"
                            sx={{ marginLeft: "10px", width: "300px" }}
                            value={data.ProfileID}
                            onChange={(e)=> setData({ ...data, ProfileID: e.target.value })}
                            label="Perfil"
                          >
                           {networkProfile.map((oneRole,index) => (
                             <MenuItem value={oneRole.Id} key={index}> {oneRole.Name} </MenuItem>
                           ))}
                         </Select>
                     </TableCell>


                    ) : (
                      <Typography style={{padding:"6px 16px"}}>
                        <DescribeText
                          otherPath={`/network-device/v1/describe-profile/${device.Config.ProfileID}`}
                        />
                      </Typography>
                    )}
                  </TableRow>

                  <TableRow>
                    <TableCell sx={style.tableCell}>IP</TableCell>
                    {editMode ? (
                      <TextField
                        onChange={(e) =>
                          setData({ ...data, IP: e.target.value })
                        }
                        variant="standard"
                        sx={{ marginLeft: "10px", width: "300px" }}
                        defaultValue={device["Config"]["IP"]}
                      />
                    ) : (
                      <TableCell>{device["Config"]["IP"]}</TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={style.tableCell}>Url</TableCell>
                    <TableCell>{profileData.url}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={style.tableCell}>Url de configuracion</TableCell>
                    <TableCell>{profileData.ConfigUrl}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={style.tableCell}>Tiempo de Sesión inactivo</TableCell>
                    <TableCell>{profileData.IdleSecondsTimeout +" Segundos"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={style.tableCell}>Perisfericos</TableCell>
                    <TableRow>
                      {device["Config"]["Peripherals"] && device["Config"]["Peripherals"].length !== 0? 
                        Object.keys(device["Config"]["Peripherals"]).map(
                          (peripherals,index)=> {
                            return(
                            <TableRow key={index}>
                              <TableCell>
                              <InteractionDevicesIcon
                                  media={peripherals}
                                  width={20}
                                  height={20}
                                />
                              </TableCell>
                            
                              <TableCell>
                                {peripherals}
                              </TableCell>
                              {peripherals && 
                              <TableCell>
                                
                                {device["Config"]["Peripherals"][peripherals].Filter === undefined ? "Sin Configurar": 
                                <>
                                  {device["Config"]["Peripherals"][peripherals].Filter.length === 0  ? null : device["Config"]["Peripherals"][peripherals].Filter.productId}: 
                                  {device["Config"]["Peripherals"][peripherals].Filter.length === 0 ? null : device["Config"]["Peripherals"][peripherals].Filter.vendorId}
                                </>}
                                
                              </TableCell>}
                            </TableRow>
                          )}
                        )
                        : 
                          <TableRow>
                              <TableCell>
                                Sin perisfericos Asignados
                              </TableCell>
                          </TableRow>
                        }
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
                variant={device.Config.ConfigMode ? "contained" : "outlined"}
                disabled={editMode}
                onClick={() => {
                  if (!device.Config.ConfigMode) {
                    setConfigMode(true);
                    handleConfigModePatchActivate();
                  } else {
                    setConfigMode(true);
                    handleConfigModePatchDesactivate();
                  }
                }}
                sx={{ marginLeft: "15px" }}
              >
                {device.Config.ConfigMode
                  ? "Modo de configuración activado"
                  : "Modo de Configuración desactivado"}
              </Button>

              {editMode ? (




                <Fab
                  sx={{ marginBottom: "5px", marginRight: "5px" }}

                  color={"primary"}
                  aria-label="like"
                  onClick={() => {
                    handleModifiedDevice();
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
                  disabled={device.Config.ConfigMode}
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
                          <TableCell>{device["Properties"]["Arch"]}</TableCell>
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
                          <TableCell>{device["Properties"]["User"]}</TableCell>
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
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default NewDeviceRegister;
