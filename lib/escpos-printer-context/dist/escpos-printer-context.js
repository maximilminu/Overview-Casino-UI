"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EscPosPrinterProvider = exports.EscPosPrinterContext = exports.PRINTER_STATUS_ONLINE = exports.PRINTER_STATUS_OFFLINE = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _escpos = require("escpos");

var _escpos2 = _interopRequireDefault(_escpos);

var _qrcode = require("qrcode");

var _qrcode2 = _interopRequireDefault(_qrcode);

var _ndarray = require("ndarray");

var _ndarray2 = _interopRequireDefault(_ndarray);

var _USBAdapter = require("./USBAdapter");

var _USBAdapter2 = _interopRequireDefault(_USBAdapter);

var _jsbarcode = require("jsbarcode");

var _jsbarcode2 = _interopRequireDefault(_jsbarcode);

var _PrinterDemo = require("./PrinterDemo");

var _PrinterDemo2 = _interopRequireDefault(_PrinterDemo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_escpos2.default.Adapter = _USBAdapter2.default;

var PRINTER_STATUS_OFFLINE = exports.PRINTER_STATUS_OFFLINE = false;
var PRINTER_STATUS_ONLINE = exports.PRINTER_STATUS_ONLINE = true;
var EscPosPrinterContext = exports.EscPosPrinterContext = _react2.default.createContext({});

var EscPosPrinterProvider = exports.EscPosPrinterProvider = function EscPosPrinterProvider(_ref) {
	var children = _ref.children;

	var init = (0, _react.useRef)(false);
	var printerUSBDevice = (0, _react.useRef)(false);
	var printerDevice = (0, _react.useRef)(false);
	var printer = (0, _react.useRef)(false);

	var _useState = (0, _react.useState)(PRINTER_STATUS_OFFLINE),
	    _useState2 = _slicedToArray(_useState, 2),
	    status = _useState2[0],
	    setStatus = _useState2[1];

	(0, _react.useLayoutEffect)(function () {
		if (!init.current) {
			init.current = true;

			navigator.usb && navigator.usb.addEventListener("disconnect", function (event) {
				if (printerUSBDevice.current && event.device.serialNumber === printerUSBDevice.current.serialNumber) {
					printerUSBDevice.current.forget();
					setStatus(PRINTER_STATUS_OFFLINE);
				}
			});
		}
	}, []);

	var connect = function connect() {
		navigator.usb.requestDevice({
			filters: [{
				classCode: 0x07
			}]
		}).then(function (device) {
			printerUSBDevice.current = device;
			printerDevice.current = new _escpos2.default.Adapter(device);
			setStatus(PRINTER_STATUS_ONLINE);
			printer.current = new _escpos2.default.Printer(printerDevice.current, {
				width: 20,
				encoding: "850"
			});
			printer.current.model("qsprinter");
		});
	};

	var name = function name() {
		if (printerUSBDevice.current) {
			return printerUSBDevice.current.manufacturerName + " " + printerUSBDevice.current.productName;
		} else {
			return "Sin conexion.";
		}
	};

	var barcode = function barcode(value) {
		var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "ITF";
		var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 800;
		var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 300;
		var displayValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		var canvasBC = document.createElement("canvas");
		canvasBC.width = width;
		canvasBC.height = height;

		(0, _jsbarcode2.default)(canvasBC, "" + value, {
			format: format,
			displayValue: displayValue,
			fontSize: 20,
			margin: 10
		});

		var ctx = canvasBC.getContext("2d");

		var pixelsBC = ctx.getImageData(0, 0, canvasBC.width, canvasBC.height);
		var bcImg = (0, _ndarray2.default)(new Uint8Array(pixelsBC.data), [canvasBC.width, canvasBC.height, 4], [4, 4 * canvasBC.width, 1], 0);
		return new _escpos2.default.Image(bcImg, "dhdw");
	};

	var printImg = function printImg(img) {
		var wd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
		var hg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;
		return new Promise(function (resolve, reject) {
			img.onerror = function (err) {
				console.error("ERROR READING IMG:", err);
				reject(err);
			};
			img.onload = function () {
				var canvas = document.createElement("canvas");
				canvas.width = wd;
				canvas.height = hg;
				var context = canvas.getContext("2d");
				context.drawImage(img, 0, 0, canvas.width, canvas.height);
				var pixelImg = context.getImageData(0, 0, canvas.width, canvas.height);
				var ImagenTo = (0, _ndarray2.default)(new Uint8Array(pixelImg.data), [canvas.width, canvas.height, 4], [4, 4 * canvas.width, 1], 0);
				resolve(new _escpos2.default.Image(ImagenTo));
			};
		});
	};

	var print = function print(printFunc, errorFunc) {
		if (status === PRINTER_STATUS_OFFLINE) {
			errorFunc("Sin conexión.");
			return;
		}
		if (printerDevice.current) {
			printerDevice.current.open(function (error) {
				if (!error) {
					printer.current.font("a").align("lt").style("normal").size(0, 0);
					printFunc(printer.current).then(function () {
						printer.current.feed(5).cut().close();
					});
				} else {
					errorFunc(error);
				}
			});
		}
	};

	var makeQr = function makeQr(txt) {
		return new Promise(function (resolve, reject) {
			_qrcode2.default.toDataURL(txt, { type: "png", errorCorrectionLevel: "Q", version: 9 }, function (err, url) {
				if (err) {
					console.error("ERROR CREATING QR", err);
					reject(err);
				}
				var img = new Image();
				img.crossOrigin = "Anonymous";
				img.onerror = function (err) {
					console.error("ERROR READING IMG:", err);
					reject(err);
				};
				img.onload = function () {
					var canvas = document.createElement("canvas");
					canvas.width = img.width * 2.5;
					canvas.height = img.height * 2.5;
					var context = canvas.getContext("2d");
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
					var pixels = context.getImageData(2, 2, canvas.width, canvas.height);

					var qrImg = (0, _ndarray2.default)(new Uint8Array(pixels.data), [canvas.width, canvas.height, 4], [4, 4 * canvas.width, 1], 0);
					resolve(new _escpos2.default.Image(qrImg));
				};
				img.src = url;
			});
		});
	};

	var demo = (0, _PrinterDemo2.default)(printerDevice, printImg, _qrcode2.default, barcode, _ndarray2.default, printer, _escpos2.default);

	var Printer = {
		status: status,
		connect: connect,
		name: name,
		demo: demo,
		print: print,
		makeQr: makeQr,
		barcode: barcode,
		printImg: printImg
	};

	return _react2.default.createElement(
		EscPosPrinterContext.Provider,
		{ value: { Printer: Printer } },
		children
	);
};