import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import { memo } from "react";
import TclPrinter from "../assests/escpos.svg";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const InteractionDevicesIcon = memo((props) => {
  const devices = props.media;
  // eslint-disable-next-line
  switch (devices) {
    case "Camera":
      return <VideoCameraFrontOutlinedIcon {...props} />;
    case "BarcodeScanner":
      return <QrCodeScannerIcon {...props} />;
    case "EscPosPrinter":
      return <PrintOutlinedIcon {...props} />;
    case "TclPrinter":
      return <TclPrinter {...props} />;
    case "MMCReader":
      return <SensorsOutlinedIcon {...props} />;
  }
});

export default InteractionDevicesIcon;
