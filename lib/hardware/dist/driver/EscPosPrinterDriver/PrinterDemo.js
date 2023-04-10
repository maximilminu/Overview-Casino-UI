"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrinterDemo = undefined;

var _logo = require("./logo");

var _logo2 = _interopRequireDefault(_logo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var PrinterDemo = exports.PrinterDemo = function PrinterDemo(printerDevice, makeImg, QRCode, makeBarcode, ndarray, printer, escpos) {
  var demo = function demo(text) {
    console.log("Printing demo for %s", text, printerDevice.current);
    if (printerDevice.current) {
      printerDevice.current.open(function (error) {
        if (!error) {
          QRCode.toDataURL(text, { type: "png", errorCorrectionLevel: "M", version: 4 }, function (err, url) {
            if (err) {
              console.error("ERROR CREATING QR", err);
              return;
            }
            var img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var canvas, context, pixels, qrImg, logoImage;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      canvas = document.createElement("canvas");

                      canvas.width = img.width;
                      canvas.height = img.height;
                      context = canvas.getContext("2d");

                      context.drawImage(img, 0, 0);
                      pixels = context.getImageData(2, 2, img.width, img.height);
                      qrImg = ndarray(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4 * img.width, 1], 0);
                      logoImage = new Image();

                      logoImage.src = _logo2.default;
                      makeImg(logoImage, 300, 80).then(function (imgToPrint) {
                        var p = printer.current;
                        p.align("ct").raster(imgToPrint).feed(1).raster(makeBarcode("-01234-DEMO-56789-", "CODE128")).feed(2).size(1, 1).style("b").tableCustom([{ text: "Columna I", align: "LEFT", width: 0.5 }, { text: "Columna II", align: "RIGHT", width: 0.5 }], "cp857").style("normal").feed(1).tableCustom([{ text: "Dato I", align: "LEFT", width: 0.5 }, { text: "Dato II", align: "RIGHT", width: 0.5 }], "cp857").feed(1).size(1, 1).raster(new escpos.Image(qrImg), "dhdw").drawLine().size(0, 0).text("0x0 " + text).feed(1).size(1, 0).text("1x0 " + text).feed(1).size(0, 1).text("0x1 " + text).feed(1).size(1, 1).text("1x1 " + text).feed(1).size(2, 2).text("2x2 " + text).feed(1).size(3, 3).text("3x3 " + text).feed(1).size(4, 4).text("4x4 " + text).size(1, 1).style("b").drawLine().feed(2).cut().close();
                      });

                    case 10:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));
            img.onerror = function (err) {
              console.error("ERROR READING IMG:", err);
            };

            img.src = url;
          });
        } else {
          console.error("Printer error", error);
        }
      });
    }
  };

  return demo;
};