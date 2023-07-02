import {
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import HardwareButton from "@oc/hardware-context/dist/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { HardwareContext } from "@oc/hardware-context";
import Table from "@mui/material/Table";
import Webcam from "react-webcam";
import {
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  Checkbox,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { ApiContext } from "./context/ApiContext";

function Main() {
  const [barcodeReaderDemo, setBarcodeReaderDemo] = useState(false);
  const Hardware = useContext(HardwareContext);
  const [checkboxChecked, setCheckboxChecked] = useState({});
  const [deviceStatus, setDeviceStatus] = useState({});
  const [iconIsDisabled, setIconIsDisabled] = useState({});
  const [scannerDemoData, setScannerDemoData] = useState("");
  const listenersRef = useRef({});
  const [currentCameraConstraints, setCurrentCameraConstraints] =
    useState(false);
  const [cameraDemoOpen, setCameraDemoOpen] = useState(false);
  const { Post, Loading, Delete } = useContext(ApiContext);
  const [inicializate, setInicializate] = useState(false);
  const handleCheckboxClick = ({ peripheralID, driverName }) => {
    if (peripheralID === checkboxChecked[driverName]) {
      return;
    }
    const hw = Hardware.Device[driverName];
    if (!hw && !hw.Driver) {
      return;
    }
    setIconIsDisabled((p) => ({ ...p, [driverName]: peripheralID === "" }));
    if (peripheralID !== "") {
      const filter = {
        vendorId: Number(`0x${peripheralID.split(":")[1]}`),
        productId: Number(`0x${peripheralID.split(":")[2]}`),
      };

      hw.connect(filter)
        .then(() => {
          setDeviceStatus((p) => ({ ...p, [driverName]: hw.status() }));
          hw.statusChangedListener(() => {
            setDeviceStatus((p) => ({
              ...p,
              [driverName]: hw.status(),
            }));
          });

          if (hw.onDataListener) {
            listenersRef[driverName] = hw.onDataListener((data) => {
              setScannerDemoData(data);
            });
          }
        })
        .catch((e) => {
          setCheckboxChecked((p) => ({ ...p, [driverName]: "" }));
        });
    }
    if (!hw.status()) {
      hw.disconnect();
    } else {
      if (listenersRef[driverName]) {
        listenersRef[driverName]();
      }
      hw.disconnect();
    }
    setCheckboxChecked((p) => ({ ...p, [driverName]: peripheralID }));
  };

  const handleInformationDB = ({ peripheralID, driverName }) => {
    if (peripheralID === "") {
      Delete(`/hw/v1/delete-peripherals/${driverName}`).then((res) =>
        console.log(res)
      );
    } else {
      Post(`/hw/v1/peripherals/`, {
        [driverName]: {
          Filter: {
            vendorId: `0x${peripheralID.split(":")[1]}`,
            productId: `0x${peripheralID.split(":")[2]}`,
          },
        },
      }).then((res) => console.log(res));
    }
  };

  const Peripherals = [
    { ID: "", Name: "No configurado" },
    ...Hardware.Info.Properties.Peripherals,
  ];

  useEffect(() => {
    if (inicializate) {
      let filters = {};
      let data;
      if (Peripherals && Hardware.Configs.Peripherals) {
        // eslint-disable-next-line
        Peripherals.map((peripheral) => {
          // eslint-disable-next-line
          Object.keys(Hardware.Configs.Peripherals).map((device) => {
            if (Hardware.Configs.Peripherals[device].Filter) {
              if (device === "BarcodeScanner") {
                data = `serial:${Hardware.Configs.Peripherals[
                  device
                ].Filter.vendorId.substring(2)}:${Hardware.Configs.Peripherals[
                  device
                ].Filter.productId.substring(2)}`;
              } else {
                data = `usb:${Hardware.Configs.Peripherals[
                  device
                ].Filter.vendorId.substring(2)}:${Hardware.Configs.Peripherals[
                  device
                ].Filter.productId.substring(2)}`;
              }
              if (data === peripheral.ID) {
                filters = { ...filters, [device]: peripheral.ID };
              }
            }
          });
        });
      }
      // eslint-disable-next-line
      Object.keys(filters).map((filtro) => {
        setCheckboxChecked((p) => ({ ...p, [filtro]: filters[filtro] }));
        handleCheckboxClick({
          peripheralID: filters[filtro],
          driverName: filtro,
        });
      });

      Object.keys(Hardware.Configs.Peripherals)
        .filter((p) => Object.keys(filters).indexOf(p) < 0)
        .forEach((filtro) => {
          iconIsDisabled[filtro] = true;
          handleCheckboxClick({ peripheralID: "", driverName: filtro });
        });
    }
    // eslint-disable-next-line
  }, [Hardware.Device, inicializate]);

  const handleExitConfigMode = () => {
    Post("/hw/v1/exit-config-mode").then((res) => {
      window.close();
    });
  };

  return (
    <Box
      component="main"
      sx={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eeeeeeb0",
      }}
    >
      {inicializate ? (
        <>
          <Container
            component={Paper}
            sx={{
              width: "95%",
              height: "90%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "5px",
              }}
            >
              <Typography variant="h6">
                Configuración de la terminal de trabajo
              </Typography>
              <Button variant="contained" onClick={handleExitConfigMode}>
                Terminar y reiniciar
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                marginY: "15px",
              }}
            ></Box>
            {Loading && <LinearProgress />}

            <Box
              sx={{
                display: "flex",
                paddingButtom: "10px",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {Hardware.Configs.Name}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                -- {Hardware.Configs.Profile} --
              </Typography>
            </Box>

            <TableContainer
              sx={{ width: "100%", height: "75%", overflow: "auto" }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Dispositivos</TableCell>
                    {Object.keys(Hardware.Configs.Peripherals).map(
                      (name, idx) => {
                        if (Hardware.Device[name]) {
                          return (
                            <TableCell key={idx} sx={{ textAlign: "center" }}>
                              <Typography xs={{ fontSize: "1" }}>
                                {Hardware.Configs.Peripherals[name].Name}
                              </Typography>
                              <HardwareButton
                                name={name}
                                label={Hardware.Device[name].name()}
                                driver={
                                  Hardware.Configs.Peripherals[name].Driver
                                }
                                disabled={iconIsDisabled[name]}
                                status={deviceStatus[name]}
                                onClick={() => {
                                  console.log(
                                    "NAME",
                                    Hardware.Configs.Peripherals[name]
                                  );
                                  if (!Hardware.Device[name].status()) {
                                    Hardware.Device[name]
                                      .connect(
                                        Hardware.Configs.Peripherals[name]
                                          .Filter
                                      )
                                      .then((res) => {
                                        if (Hardware.Device[name].status()) {
                                          setDeviceStatus((p) => ({
                                            ...p,
                                            [Hardware.Configs.Peripherals[name]
                                              .Driver]:
                                              Hardware.Device[name].status(),
                                          }));
                                          Hardware.Device[
                                            name
                                          ].statusChangedListener(() => {
                                            setDeviceStatus((p) => ({
                                              ...p,
                                              [Hardware.Configs.Peripherals[
                                                name
                                              ]]:
                                                Hardware.Device[name].status(),
                                            }));
                                          });

                                          if (
                                            Hardware.Device[name].onDataListener
                                          ) {
                                            listenersRef[
                                              Hardware.Configs.Peripherals[name]
                                            ] = Hardware.Device[
                                              name
                                            ].onDataListener((data) => {
                                              setScannerDemoData(data);
                                            });
                                          }
                                        }
                                      })
                                      .catch((err) => {
                                        console.log(err, "ERR");
                                      });
                                  }
                                  switch (
                                    Hardware.Configs.Peripherals[name].Driver
                                  ) {
                                    case "BarcodeScanner":
                                      setBarcodeReaderDemo(
                                        Hardware.Device[name]
                                      );
                                      break;
                                    case "Camera":
                                      if (
                                        Hardware.Device.BarcodeScanner.status()
                                      ) {
                                        setCameraDemoOpen(true);
                                        setCurrentCameraConstraints(
                                          Hardware.Device[
                                            name
                                          ].videoConstraints()
                                        );
                                      }
                                      break;
                                    default:
                                      Hardware.Device[name].demo(
                                        Hardware.Configs.Peripherals[name].Name
                                      );
                                  }
                                }}
                              />
                            </TableCell>
                          );
                        } else {
                          return false;
                        }
                      }
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Peripherals.map((peripheral, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "10px",
                          lineHeight: "1px",
                          width: "250px !important",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "black",
                            textDecoration: "uppercase",
                          }}
                        >
                          {peripheral.ID}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 300,
                            color: "black",
                          }}
                        >
                          {peripheral.Name && peripheral.Name}
                        </Typography>
                        <Typography>{peripheral.Manufacturer}</Typography>
                        <Typography>{peripheral.Product}</Typography>
                      </TableCell>
                      {Object.keys(Hardware.Configs.Peripherals).map((name) => {
                        if (Hardware.Device[name]) {
                          return (
                            <TableCell align="center" key={idx + name}>
                              <Checkbox
                                color="primary"
                                checked={
                                  checkboxChecked[name] === peripheral.ID
                                }
                                onClick={() => {
                                  handleCheckboxClick({
                                    peripheralID: peripheral.ID,
                                    driverName: name,
                                  });
                                  handleInformationDB({
                                    peripheralID: peripheral.ID,
                                    driverName: name,
                                  });
                                }}
                              />
                            </TableCell>
                          );
                        } else {
                          return false;
                        }
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
          <Dialog
            open={barcodeReaderDemo && Hardware.Device.BarcodeScanner.status()}
          >
            <DialogTitle sx={{ textAlign: "center" }}>
              ¡Escanea para probar que funciona!
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                sx={{
                  textAlign: "center",
                  color: "red",
                  textTransform: "uppercase",
                }}
              >
                {scannerDemoData}
              </DialogContentText>
              <DialogActions>
                <Button
                  variant="contained"
                  sx={{ marginBottom: "-15px" }}
                  onClick={() => {
                    setBarcodeReaderDemo(false);
                    setScannerDemoData("");
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          <Dialog open={cameraDemoOpen}>
            <DialogContent>
              <DialogContentText
                sx={{
                  textAlign: "center",
                  color: "red",
                  textTransform: "uppercase",
                }}
              >
                <Webcam
                  audio={false}
                  height={72}
                  width={128}
                  screenshotFormat="image/jpeg"
                  videoConstraints={currentCameraConstraints}
                />
              </DialogContentText>
              <DialogActions>
                <Button
                  variant="contained"
                  sx={{ marginBottom: "-15px" }}
                  onClick={() => {
                    setCameraDemoOpen(false);
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ height: "10vh" }}
            onClick={handleExitConfigMode}
          >
            Reiniciar terminal
          </Button>
          <Button variant="outlined" onClick={() => setInicializate(true)}>
            Configurar perisfericos
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Main;
