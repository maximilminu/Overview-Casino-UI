import React, { useContext } from "react";
import { Videocam } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Webcam from "react-webcam";
import {
  CameraContext,
  CAMERA_STATUS_OFFLINE,
} from "../../context/CameraContext";

const CameraButton = ({}) => {
  const webcamRef = React.useRef(null);
  const { Camera } = useContext(CameraContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const down600px = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ flexDirection: "column" }}>
        <Videocam
          sx={{
            fill: Camera.status === CAMERA_STATUS_OFFLINE ? "red" : "green",
          }}
        />
        <Typography
          sx={{ color: down600px ? "black" : "white" }}
          fontSize="xx-small"
        >
          {Camera.name()}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {Camera.devices.map((device, key) => (
          <MenuItem key={key} sx={{ flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Checkbox
                checked={
                  Camera.videoConstraints &&
                  Camera.videoConstraints.deviceId === device.deviceId
                }
                onClick={() => {
                  Camera.select(device.deviceId);
                }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
              />
              <Webcam
                audio={false}
                height={72}
                width={128}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: device.deviceId }}
              />
            </Box>
            {device.label.split("(")[0] || `Cámara ${key + 1}`}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CameraButton;
