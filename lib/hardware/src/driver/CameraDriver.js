import React, { useLayoutEffect, useRef } from "react";

export const CAMERA_STATUS_OFFLINE = false;
export const CAMERA_STATUS_ONLINE = true;

export const CameraContext = React.createContext({});

const instances = {};

export const useCamera = (name) => {
  const init = useRef(false);
  const videoConstraints = useRef(false);
  const deviceID = useRef(false);
  const statusRef = useRef(CAMERA_STATUS_OFFLINE);
  const devices = useRef([]);
  const listeners = useRef([]);
  const stream = useRef(false);

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;
      navigator.permissions.query({ name: "camera" }).then((st) => {
        st.onchange = (sst) => {
          if (sst.target.state === "granted") {
            statusRef.current = CAMERA_STATUS_ONLINE;
            listeners.current.forEach((listener) => {
              listener();
            });
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
          } else {
            statusRef.current = CAMERA_STATUS_OFFLINE;
            listeners.current.forEach((listener) => {
              listener();
            });
          }
        };
        if (st.state === "granted") {
          statusRef.current = CAMERA_STATUS_ONLINE;
          listeners.current.forEach((listener) => {
            listener();
          });
          navigator.mediaDevices.enumerateDevices().then(handleDevices);
        } else {
          statusRef.current = CAMERA_STATUS_OFFLINE;
          listeners.current.forEach((listener) => {
            listener();
          });
        }
      });
    }

    // eslint-disable-next-line
  }, []);

  const handleDevices = React.useCallback(
    (mediaDevices) => {
      devices.current = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      //   if (cameraDeviceId) {
      //     setVideoConstraints({
      //       width: 1280,
      //       height: 720,
      //       deviceId: cameraDeviceId,
      //     });
      //   } else {
      //     select(
      //       mediaDevices.filter(({ kind }) => kind === "videoinput")[0].deviceId
      //     );
      //   }
    },
    // eslint-disable-next-line
    []
  );

  if (instances[name]) {
    return instances[name];
  }

  const statusChangedListener = (listener) => {
    listeners.current.push(listener);
  };

  const select = (deviceId) => {
    deviceID.current = deviceId;
    videoConstraints.current = {
      width: 1280,
      height: 720,
      deviceId: deviceId,
    };
  };

  const connect = (filter) => {
    const labelFilter = `(${filter.vendorId
      .toString(16).replace('0x','')
      .padStart(4, "0")}:${filter.productId.toString(16).replace('0x','').padStart(4, "0")})`;
    for (let i = 0; i < devices.current.length; i++) {
      if (devices.current[i].label.indexOf(labelFilter) > -1) {
        select(devices.current[i].deviceId);
        return navigator.mediaDevices
          .getUserMedia({
            video: {
              deviceId: devices.current[i].deviceId,
            },
          })
          .then((st) => {
            stream.current = st;
          })
          .catch((e) => {
            console.log("ERROR GETTING STREAM FROM CAM");
            stream.current = false;
          });
      }
    }
    return new Promise((resolve, reject) => {
      console.log('Camera requested:', labelFilter, devices.current);
      reject("Can't find the camera by filters");
    })


  };
  // new Promise((resolve, reject) => {
  //   if (devices.length > 0) {
  //     return navigator.mediaDevices.getUserMedia({
  //       video: true,
  //     });
  //   } else {
  //     reject();
  //   }
  // });

  const cameraName = () => {
    if (devices.current.length > 0 && deviceID.current) {
      return devices.current
        .filter((d) => d.deviceId === deviceID.current)[0]
        .label.split(" (")[0];
    }

    return "Sin Conexion.";
  };

  const disconnect = () => {
    if (stream.current) {
      stream.current.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  };

  instances[name] = {
    statusChangedListener,
    status: () => {
      return statusRef.current;
    },
    name: cameraName,
    devices,
    select,
    connect,
    videoConstraints: () => {
      return videoConstraints.current;
    },
    disconnect,
  };

  return instances[name];
};
