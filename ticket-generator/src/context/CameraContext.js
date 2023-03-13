import React, { useLayoutEffect, useRef, useState } from "react";
import useLocalStorage from "react-use-localstorage";

export const CAMERA_STATUS_OFFLINE = false;
export const CAMERA_STATUS_ONLINE = true;

export const CameraContext = React.createContext({});

export const CameraProvider = ({ children }) => {
  const init = useRef(false);
  const [status, setStatus] = useState(CAMERA_STATUS_OFFLINE);
  const [videoConstraints, setVideoConstraints] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const [cameraDeviceId, setCameraDeviceId] = useLocalStorage("CameraDeviceId");

  const handleDevices = React.useCallback(
    (mediaDevices) => {
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));
      if (cameraDeviceId) {
        setVideoConstraints({
          width: 1280,
          height: 720,
          deviceId: cameraDeviceId,
        });
      } else {
        select(
          mediaDevices.filter(({ kind }) => kind === "videoinput")[0].deviceId
        );
      }
    },
    // eslint-disable-next-line
    [setDevices]
  );

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.permissions.query({ name: "camera" }).then((st) => {
        st.onchange = (sst) => {
          if (sst.target.state === "granted") {
            setStatus(CAMERA_STATUS_ONLINE);
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
          } else {
            setStatus(CAMERA_STATUS_OFFLINE);
          }
        };
        if (st.state === "granted") {
          setStatus(CAMERA_STATUS_ONLINE);
          navigator.mediaDevices.enumerateDevices().then(handleDevices);
        } else {
          setStatus(CAMERA_STATUS_OFFLINE);
        }
      });
    }

    // eslint-disable-next-line
  }, []);

  const select = (deviceId) => {
    setCameraDeviceId(deviceId);
    setVideoConstraints({
      width: 1280,
      height: 720,
      deviceId: deviceId,
    });
  };

  const name = () => {
    if (devices.length > 0 && cameraDeviceId) {
      return devices
        .filter((d) => d.deviceId === cameraDeviceId)[0]
        .label.split(" (")[0];
    }

    return "Sin Conexion.";
  };

  const Camera = {
    status,
    name,
    devices,
    select,
    videoConstraints,
  };

  return (
    <CameraContext.Provider value={{ Camera }}>
      {children}
    </CameraContext.Provider>
  );
};
