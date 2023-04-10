"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePrinter = exports.PRINTER_STATUS_ONLINE = exports.PRINTER_STATUS_OFFLINE = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_escpos2.default.Adapter = _USBAdapter2.default;

var PRINTER_STATUS_OFFLINE = exports.PRINTER_STATUS_OFFLINE = false;
var PRINTER_STATUS_ONLINE = exports.PRINTER_STATUS_ONLINE = true;

var instances = {};

var makeBarcode = function makeBarcode(value) {
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

var makeImg = function makeImg(img) {
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

var usePrinter = exports.usePrinter = function usePrinter(name) {
  var init = (0, _react.useRef)(false);
  var printerUSBDevice = (0, _react.useRef)(false);
  var printerDevice = (0, _react.useRef)(false);
  var printer = (0, _react.useRef)(false);
  var statusRef = (0, _react.useRef)(PRINTER_STATUS_OFFLINE);
  var listeners = (0, _react.useRef)([]);
  var filterRef = (0, _react.useRef)({});

  (0, _react.useLayoutEffect)(function () {
    if (!init.current) {
      init.current = true;

      navigator.usb && navigator.usb.addEventListener("disconnect", function (event) {
        if (event.device.name === name) {
          event.device.forget();
          statusRef.current = PRINTER_STATUS_OFFLINE;
          printerUSBDevice.current = false;
          listeners.current.forEach(function (listener) {
            listener();
          });
        }
      });

      // navigator.usb &&
      //   navigator.usb.addEventListener("connect", (event) => {
      //     if (
      //       statusRef.current === PRINTER_STATUS_OFFLINE &&
      //       Object.keys(filterRef.current).filter(
      //         (f) => event.device[f] === filterRef.current[f]
      //       ).length === Object.keys(filterRef.current).length
      //     ) {
      //       connect(filterRef.current);
      //     }
      //   });
    }
  }, []);

  if (instances[name]) {
    return instances[name];
  }

  var statusChangedListener = function statusChangedListener(listener) {
    listeners.current.push(listener);
  };

  var connect = function connect(filter) {
    filterRef.current = filter;
    return navigator.usb.requestDevice({
      filters: [filter]
    }).then(function (device) {
      device.name = name;
      printerUSBDevice.current = device;
      printerDevice.current = new _escpos2.default.Adapter(device);
      statusRef.current = PRINTER_STATUS_ONLINE;
      printer.current = new _escpos2.default.Printer(printerDevice.current, {
        width: 20,
        encoding: "850"
      });
      printer.current.model("qsprinter");
      listeners.current.forEach(function (listener) {
        listener();
      });
    }).catch(function (err) {
      console.error(err);
    });
  };

  var printerName = function printerName() {
    if (printerUSBDevice.current) {
      return printerUSBDevice.current.manufacturerName + " " + printerUSBDevice.current.productName;
    } else {
      return "Sin conexion.";
    }
  };

  var print = function print(printFunc, errorFunc) {
    if (statusRef.current === PRINTER_STATUS_OFFLINE) {
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

  var disconnect = function disconnect() {
    if (printerUSBDevice.current) {
      printerUSBDevice.current.forget();
      statusRef.current = PRINTER_STATUS_OFFLINE;
      printerUSBDevice.current = false;
      listeners.current.forEach(function (listener) {
        listener();
      });
    }
  };

  var demo = (0, _PrinterDemo.PrinterDemo)(printerDevice, makeImg, _qrcode2.default, makeBarcode, _ndarray2.default, printer, _escpos2.default);

  instances[name] = {
    statusChangedListener: statusChangedListener,
    status: function status() {
      return statusRef.current;
    },
    connect: connect,
    name: printerName,
    demo: demo,
    print: print,
    makeQr: makeQr,
    makeBarcode: makeBarcode,
    makeImg: makeImg,
    disconnect: disconnect
  };

  return instances[name];
};
// if (peripheral.ID !== "" && device.Name === "Scanner") {
//   // BarcodeReader.connect(filter);
// }