"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HardwareProvider = exports.HardwareContext = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _EscPosPrinterDriver = require("./driver/EscPosPrinterDriver");

var _CameraDriver = require("./driver/CameraDriver");

var _BarcodeScannerDriver = require("./driver/BarcodeScannerDriver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HardwareContext = exports.HardwareContext = _react2.default.createContext({});

var HardwareProvider = exports.HardwareProvider = (0, _react.memo)(function (_ref) {
	var children = _ref.children;

	var EscPosPrinter = [(0, _EscPosPrinterDriver.usePrinter)(0), (0, _EscPosPrinterDriver.usePrinter)(1), (0, _EscPosPrinterDriver.usePrinter)(2), (0, _EscPosPrinterDriver.usePrinter)(3), (0, _EscPosPrinterDriver.usePrinter)(4), (0, _EscPosPrinterDriver.usePrinter)(5)];

	var Camera = [(0, _CameraDriver.useCamera)(0), (0, _CameraDriver.useCamera)(1), (0, _CameraDriver.useCamera)(2), (0, _CameraDriver.useCamera)(3), (0, _CameraDriver.useCamera)(4), (0, _CameraDriver.useCamera)(5)];

	var BarcodeScanner = [(0, _BarcodeScannerDriver.useBarcodeScanner)(0), (0, _BarcodeScannerDriver.useBarcodeScanner)(1), (0, _BarcodeScannerDriver.useBarcodeScanner)(2), (0, _BarcodeScannerDriver.useBarcodeScanner)(3), (0, _BarcodeScannerDriver.useBarcodeScanner)(4), (0, _BarcodeScannerDriver.useBarcodeScanner)(5)];

	var _useState = (0, _react.useState)(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    hardware = _useState2[0],
	    setHardware = _useState2[1];

	var _useState3 = (0, _react.useState)(false),
	    _useState4 = _slicedToArray(_useState3, 2),
	    init = _useState4[0],
	    setInit = _useState4[1];

	var drivers = {
		EscPosPrinter: EscPosPrinter,
		BarcodeScanner: BarcodeScanner,
		// TclPrinter,
		Camera: Camera
	};

	var checkSecureBrowserInit = function checkSecureBrowserInit() {
		if (window.SecureBrowser && window.SecureBrowser.Configs && window.SecureBrowser.Configs.Peripherals) {
			var driversFree = {
				EscPosPrinter: 0,
				BarcodeScanner: 0,
				Camera: 0
			};
			var h = Object.assign({}, window.SecureBrowser, { Device: {} });

			Object.keys(window.SecureBrowser.Configs.Peripherals).forEach(function (Name) {
				try {
					var d = drivers[window.SecureBrowser.Configs.Peripherals[Name].Driver][driversFree[window.SecureBrowser.Configs.Peripherals[Name].Driver]];
					driversFree[window.SecureBrowser.Configs.Peripherals[Name].Driver]++;
					h.Device[Name] = d;
				} catch (e) {
					console.error("Can't instance driver:", Name, window.SecureBrowser.Configs.Peripherals[Name], e);
				}
			});
			h.ConnectAll = function () {
				return new Promise(function (resolve) {
					if (!init) {
						setInit(true);
						var count = Object.keys(h.Device).length;
						var qty = 0;
						Object.keys(h.Device).forEach(function (name) {
							if (h.Configs.Peripherals[name].Filter) {
								h.Device[name].connect(h.Configs.Peripherals[name].Filter).then(function () {
									qty++;
								}).catch(function (err) {
									console.error(err);
								}).finally(function () {
									count--;
									if (count === 0) {
										resolve({ Total: Object.keys(h.Device).length, Init: qty });
									}
								});
							}
						});
					} else {
						resolve({ Total: 0, Init: 0 });
					}
				});
			};

			setHardware(h);
		} else {
			setTimeout(checkSecureBrowserInit, 250);
		}
	};

	(0, _react.useLayoutEffect)(function () {
		checkSecureBrowserInit();
	}, []);

	return _react2.default.createElement(
		HardwareContext.Provider,
		{ value: hardware },
		hardware && children || "Esperando configuración del secure browser"
	);
});