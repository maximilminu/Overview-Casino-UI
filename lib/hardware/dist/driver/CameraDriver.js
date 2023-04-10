"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCamera = exports.CameraContext = exports.CAMERA_STATUS_ONLINE = exports.CAMERA_STATUS_OFFLINE = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CAMERA_STATUS_OFFLINE = exports.CAMERA_STATUS_OFFLINE = false;
var CAMERA_STATUS_ONLINE = exports.CAMERA_STATUS_ONLINE = true;

var CameraContext = exports.CameraContext = _react2.default.createContext({});

var instances = {};

var useCamera = exports.useCamera = function useCamera(name) {
  var init = (0, _react.useRef)(false);
  var _videoConstraints = (0, _react.useRef)(false);
  var deviceID = (0, _react.useRef)(false);
  var statusRef = (0, _react.useRef)(CAMERA_STATUS_OFFLINE);
  var devices = (0, _react.useRef)([]);
  var listeners = (0, _react.useRef)([]);
  var stream = (0, _react.useRef)(false);

  (0, _react.useLayoutEffect)(function () {
    if (!init.current) {
      init.current = true;
      navigator.permissions.query({ name: "camera" }).then(function (st) {
        st.onchange = function (sst) {
          if (sst.target.state === "granted") {
            statusRef.current = CAMERA_STATUS_ONLINE;
            listeners.current.forEach(function (listener) {
              listener();
            });
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
          } else {
            statusRef.current = CAMERA_STATUS_OFFLINE;
            listeners.current.forEach(function (listener) {
              listener();
            });
          }
        };
        if (st.state === "granted") {
          statusRef.current = CAMERA_STATUS_ONLINE;
          listeners.current.forEach(function (listener) {
            listener();
          });
          navigator.mediaDevices.enumerateDevices().then(handleDevices);
        } else {
          statusRef.current = CAMERA_STATUS_OFFLINE;
          listeners.current.forEach(function (listener) {
            listener();
          });
        }
      });
    }

    // eslint-disable-next-line
  }, []);

  var handleDevices = _react2.default.useCallback(function (mediaDevices) {
    devices.current = mediaDevices.filter(function (_ref) {
      var kind = _ref.kind;
      return kind === "videoinput";
    });
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
  []);

  if (instances[name]) {
    return instances[name];
  }

  var statusChangedListener = function statusChangedListener(listener) {
    listeners.current.push(listener);
  };

  var select = function select(deviceId) {
    deviceID.current = deviceId;
    _videoConstraints.current = {
      width: 1280,
      height: 720,
      deviceId: deviceId
    };
  };

  var connect = function connect(filter) {
    var labelFilter = "(" + filter.vendorId.toString(16).replace('0x', '').padStart(4, "0") + ":" + filter.productId.toString(16).replace('0x', '').padStart(4, "0") + ")";
    for (var i = 0; i < devices.current.length; i++) {
      if (devices.current[i].label.indexOf(labelFilter) > -1) {
        select(devices.current[i].deviceId);
        return navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: devices.current[i].deviceId
          }
        }).then(function (st) {
          stream.current = st;
        }).catch(function (e) {
          console.log("ERROR GETTING STREAM FROM CAM");
          stream.current = false;
        });
      }
    }
    return new Promise(function (resolve, reject) {
      console.log('Camera requested:', labelFilter, devices.current);
      reject("Can't find the camera by filters");
    });
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

  var cameraName = function cameraName() {
    if (devices.current.length > 0 && deviceID.current) {
      return devices.current.filter(function (d) {
        return d.deviceId === deviceID.current;
      })[0].label.split(" (")[0];
    }

    return "Sin Conexion.";
  };

  var disconnect = function disconnect() {
    if (stream.current) {
      stream.current.getTracks().forEach(function (track) {
        track.stop();
      });
    }
  };

  instances[name] = {
    statusChangedListener: statusChangedListener,
    status: function status() {
      return statusRef.current;
    },
    name: cameraName,
    devices: devices,
    select: select,
    connect: connect,
    videoConstraints: function videoConstraints() {
      return _videoConstraints.current;
    },
    disconnect: disconnect
  };

  return instances[name];
};