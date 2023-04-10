import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import TclPrinterButton from "./components/TclPrinterButton";
import EscPosPrinterButton from "./components/EscPosPrinterButton";
import CameraButton from "./components/CameraButton";
import RfIdButton from "./components/RfIdButton";
import BarcodeReaderButton from "./components/BarcodeReaderButton";
import { useContext, useLayoutEffect, useState } from "react";
import { SecureBrowserContext } from "@oc/secure-browser-context";
import Table from "@mui/material/Table";
import {
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  Checkbox,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { CameraContext } from "@oc/camera-context";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {
  BarcodeReaderContext,
  READER_STATUS_OFFLINE,
} from "./context/BarcodeReaderContext";
import { EscPosPrinterContext } from "./context/EscPosPrinterContext";
import { TclPrinterContext } from "./context/TclPrinterContext";
function Main() {
  const { TclPrinter } = useContext(TclPrinterContext);
  const [barcodeReaderDemo, setBarcodeReaderDemo] = useState(false);
  const { BarcodeReader } = useContext(BarcodeReaderContext);
  const { Printer } = useContext(EscPosPrinterContext);
  const SecureBrowser = useContext(SecureBrowserContext);
  const [peripheralsConfigs, setPeripheralsConfigs] = useState(
    SecureBrowser.Configs.Peripherals
  );

  const handleCheckboxClick = (device, peripheral) => {
    console.log(peripheral, "peripheral");
    console.log(device, "device");
    const port = peripheral.ID.split(":");
    const filter = {
      vendorId: Number(`0x${port[1]}`),
      productId: Number(`0x${port[2]}`),
    };

    if (peripheral.ID === "") {
      device.Context.disconnect();
    }
    if (peripheral.ID !== "" && device.Name === "Scanner") {
      BarcodeReader.connect(filter);
    }

    device.Name === "EscPos" && Printer.connect(filter);
    device.Name === "Tcl" && TclPrinter.connect(filter);

    const p = { ...peripheralsConfigs };
    Object.keys(p).forEach((key) => {
      p[key] === peripheral.ID && delete p[key];
    });
    p[device.Name] = peripheral.ID;
    setPeripheralsConfigs(p);
  };

  const Peripherals = [
    { ID: "", Name: "Sin uso" },
    ...SecureBrowser.Info.Properties.Peripherals,
  ];

  const DevicesLabel = [
    {
      Name: "Camera",
      Icon: <CameraButton />,
      Description: "Camara de fotos",
      Context: TclPrinter,
    },
    {
      Name: "Scanner",
      Icon: <BarcodeReaderButton />,
      Description: "Scanner Código de barras 2D",
      Context: BarcodeReader,
    },
    {
      Name: "EscPos",
      Icon: <EscPosPrinterButton />,
      Description: "Impresora de papel continuo",
      Context: Printer,
    },
    {
      Name: "Tcl",
      Icon: <TclPrinterButton />,
      Description: "Impresora de EGM (GEN2)",
      Context: TclPrinter,
    },
    // {
    //   Name: "Sin uso",
    //   Icon: <DoDisturbIcon sx={{ paddingTop: "20px" }} />,
    //   Description: "Dispositivo sin uso",
    // },
  ];

  const handleScannerButton = () => {
    BarcodeReader.status !== READER_STATUS_OFFLINE &&
      setBarcodeReaderDemo(true);
  };

  return (
    <>
      <Container component={Paper} sx={{ width: "90%", marginTop: "50px" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            padding: "15px",
          }}
        >
          <Typography variant="h6">
            Configuración de la terminal de trabajo
          </Typography>
        </Box>

        <TableContainer sx={{ width: "100%" }}>
          <Table size="small">
            <TableHead>
              <TableCell>Devices</TableCell>
              {DevicesLabel.map((device) => (
                <TableCell sx={{ textAlign: "center" }}>
                  <Typography xs={{ fontSize: "1" }}>
                    {device.Description}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      device.Name === "Scanner" && handleScannerButton();
                    }}
                    sx={{ color: "black" }}
                  >
                    {device.Icon}
                  </IconButton>
                </TableCell>
              ))}
            </TableHead>
            <TableBody>
              {Peripherals.map((peripheral) => (
                <TableRow key={peripheral.ID}>
                  <TableCell
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "10px",
                      lineHeight: "1px",
                      width: "250px !important",
                    }}
                  >
                    <Typography>{peripheral.Name || peripheral.ID}</Typography>
                    <Typography>{peripheral.Manufacturer}</Typography>
                    <Typography>{peripheral.Product}</Typography>
                  </TableCell>
                  {DevicesLabel.map((device) => (
                    <TableCell align="center" key={device.Name}>
                      <Checkbox
                        color="primary"
                        checked={
                          peripheralsConfigs[device.Name] === peripheral.ID
                        }
                        onClick={() => {
                          handleCheckboxClick(device, peripheral);
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <FormControl sx={{ display: "flex", flexDirection: "row" }}>
            <Box
              sx={{
                width: "80%",
                display: "flex",
                padding: "10px",
                flexDirection: "column",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Nombre de la terminal"
                variant="standard"
              />
            </Box>
            <Box
              sx={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
                padding: "21px",
              }}
            >
              <Button color="success" variant="contained">
                Guardar
              </Button>
            </Box>
          </FormControl>
        </TableContainer>
      </Container>

      <Dialog
        open={barcodeReaderDemo}
        onClose={() => {
          setBarcodeReaderDemo(false);
        }}
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
            {BarcodeReader.data}
          </DialogContentText>
          <DialogActions>
            <Button
              variant="contained"
              sx={{ marginBottom: "-15px" }}
              onClick={() => {
                BarcodeReader.clear();
                setBarcodeReaderDemo(false);
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

/*      {/* <TableBody>
            {Object.keys(SecureBrowser.Configs.Peripherals).map((key) =>
              SecureBrowser.Info.Properties.Peripherals.map(
                (subKey) =>
                  SecureBrowser.Configs.Peripherals[key] !== subKey.ID && (
                    <TableRow>
                      <TableCell
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "10px",
                          lineHeight: "1px",
                        }}
                      >
                        <Typography>
                          {SecureBrowser.Configs.Peripherals[key]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          color="primary"
                          // checked={checkboxStates[device.ID] === "Camera"}
                          // onClick={() => {
                          //   handleCheckboxClick(device, "Camera");
                          // }}
                        />
                      </TableCell>
                    </TableRow>
                  )
              )
            )}
          </TableBody>
                      <TableBody> */

export default Main;
