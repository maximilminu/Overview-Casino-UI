"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CameraProvider = exports.CameraContext = exports.CAMERA_STATUS_ONLINE = exports.CAMERA_STATUS_OFFLINE = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactUseLocalstorage = require("react-use-localstorage");

var _reactUseLocalstorage2 = _interopRequireDefault(_reactUseLocalstorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CAMERA_STATUS_OFFLINE = exports.CAMERA_STATUS_OFFLINE = false;
var CAMERA_STATUS_ONLINE = exports.CAMERA_STATUS_ONLINE = true;

var CameraContext = exports.CameraContext = _react2.default.createContext({});

var CameraProvider = exports.CameraProvider = function CameraProvider(_ref) {
	var children = _ref.children;

	var init = (0, _react.useRef)(false);

	var _useState = (0, _react.useState)(CAMERA_STATUS_OFFLINE),
	    _useState2 = _slicedToArray(_useState, 2),
	    status = _useState2[0],
	    setStatus = _useState2[1];

	var _React$useState = _react2.default.useState(false),
	    _React$useState2 = _slicedToArray(_React$useState, 2),
	    videoConstraints = _React$useState2[0],
	    setVideoConstraints = _React$useState2[1];

	var _React$useState3 = _react2.default.useState([]),
	    _React$useState4 = _slicedToArray(_React$useState3, 2),
	    devices = _React$useState4[0],
	    setDevices = _React$useState4[1];

	var _useLocalStorage = (0, _reactUseLocalstorage2.default)("CameraDeviceId"),
	    _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
	    cameraDeviceId = _useLocalStorage2[0],
	    setCameraDeviceId = _useLocalStorage2[1];

	var handleDevices = _react2.default.useCallback(function (mediaDevices) {
		setDevices(mediaDevices.filter(function (_ref2) {
			var kind = _ref2.kind;
			return kind === "videoinput";
		}));
		if (cameraDeviceId) {
			setVideoConstraints({
				width: 1280,
				height: 720,
				deviceId: cameraDeviceId
			});
		} else {
			select(mediaDevices.filter(function (_ref3) {
				var kind = _ref3.kind;
				return kind === "videoinput";
			})[0].deviceId);
		}
	},
	// eslint-disable-next-line
	[setDevices]);

	(0, _react.useLayoutEffect)(function () {
		if (!init.current) {
			init.current = true;

			navigator.permissions.query({ name: "camera" }).then(function (st) {
				st.onchange = function (sst) {
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

	var select = function select(deviceId) {
		setCameraDeviceId(deviceId);
		setVideoConstraints({
			width: 1280,
			height: 720,
			deviceId: deviceId
		});
	};

	var name = function name() {
		if (devices.length > 0 && cameraDeviceId) {
			return devices.filter(function (d) {
				return d.deviceId === cameraDeviceId;
			})[0].label.split(" (")[0];
		}

		return "Sin Conexion.";
	};

	var Camera = {
		status: status,
		name: name,
		devices: devices,
		select: select,
		videoConstraints: videoConstraints
	};

	return _react2.default.createElement(
		CameraContext.Provider,
		{ value: { Camera: Camera } },
		children
	);
};