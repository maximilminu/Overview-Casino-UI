import React, { useLayoutEffect, useRef, useState } from "react";
import escpos from "escpos";
import QRCode from "qrcode";
import ndarray from "ndarray";
import USBAdapter from "./USBAdapter";
import JsBarcode from "jsbarcode";
import { PrinterDemo } from "./PrinterDemo";

escpos.Adapter = USBAdapter;

export const PRINTER_STATUS_OFFLINE = false;
export const PRINTER_STATUS_ONLINE = true;

const instances = {};

const makeBarcode = (
  value,
  format = "ITF",
  width = 800,
  height = 300,
  displayValue = false
) => {
  const canvasBC = document.createElement("canvas");
  canvasBC.width = width;
  canvasBC.height = height;

  JsBarcode(canvasBC, `${value}`, {
    format,
    displayValue,
    fontSize: 20,
    margin: 10,
  });

  const ctx = canvasBC.getContext("2d");

  const pixelsBC = ctx.getImageData(0, 0, canvasBC.width, canvasBC.height);
  const bcImg = ndarray(
    new Uint8Array(pixelsBC.data),
    [canvasBC.width, canvasBC.height, 4],
    [4, 4 * canvasBC.width, 1],
    0
  );
  return new escpos.Image(bcImg, "dhdw");
};

const makeImg = (img, wd = 200, hg = 300) =>
  new Promise((resolve, reject) => {
    img.onerror = function (err) {
      console.error("ERROR READING IMG:", err);
      reject(err);
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = wd;
      canvas.height = hg;
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pixelImg = context.getImageData(0, 0, canvas.width, canvas.height);
      const ImagenTo = ndarray(
        new Uint8Array(pixelImg.data),
        [canvas.width, canvas.height, 4],
        [4, 4 * canvas.width, 1],
        0
      );
      resolve(new escpos.Image(ImagenTo));
    };
  });

const makeQr = (txt) =>
  new Promise((resolve, reject) => {
    QRCode.toDataURL(
      txt,
      { type: "png", errorCorrectionLevel: "Q", version: 9 },
      (err, url) => {
        if (err) {
          console.error("ERROR CREATING QR", err);
          reject(err);
        }
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onerror = function (err) {
          console.error("ERROR READING IMG:", err);
          reject(err);
        };
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width * 2.5;
          canvas.height = img.height * 2.5;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pixels = context.getImageData(
            2,
            2,
            canvas.width,
            canvas.height
          );

          const qrImg = ndarray(
            new Uint8Array(pixels.data),
            [canvas.width, canvas.height, 4],
            [4, 4 * canvas.width, 1],
            0
          );
          resolve(new escpos.Image(qrImg));
        };
        img.src = url;
      }
    );
  });

export const usePrinter = (name) => {
  const init = useRef(false);
  const printerUSBDevice = useRef(false);
  const printerDevice = useRef(false);
  const printer = useRef(false);
  const statusRef = useRef(PRINTER_STATUS_OFFLINE);
  const listeners = useRef([]);
  const filterRef = useRef({});

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.usb &&
        navigator.usb.addEventListener("disconnect", (event) => {
          if (event.device.name === name) {
            event.device.forget();
            statusRef.current = PRINTER_STATUS_OFFLINE;
            printerUSBDevice.current = false;
            listeners.current.forEach((listener) => {
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

  const statusChangedListener = (listener) => {
    listeners.current.push(listener);
  };

  const connect = (filter) => {
    filterRef.current = filter;
    return navigator.usb
      .requestDevice({
        filters: [filter],
      })
      .then((device) => {
        device.name = name;
        printerUSBDevice.current = device;
        printerDevice.current = new escpos.Adapter(device);
        statusRef.current = PRINTER_STATUS_ONLINE;
        printer.current = new escpos.Printer(printerDevice.current, {
          width: 20,
          encoding: "850",
        });
        printer.current.model("qsprinter");
        listeners.current.forEach((listener) => {
          listener();
        });
      })
      .catch(err => {
        console.error(err);
      })
  };

  const printerName = () => {
    if (printerUSBDevice.current) {
      return (
        printerUSBDevice.current.manufacturerName +
        " " +
        printerUSBDevice.current.productName
      );
    } else {
      return "Sin conexion.";
    }
  };

  const print = (printFunc, errorFunc) => {
    if (statusRef.current === PRINTER_STATUS_OFFLINE) {
      errorFunc("Sin conexión.");
      return;
    }
    if (printerDevice.current) {
      printerDevice.current.open((error) => {
        if (!error) {
          printer.current.font("a").align("lt").style("normal").size(0, 0);
          printFunc(printer.current).then(() => {
            printer.current.feed(5).cut().close();
          });
        } else {
          errorFunc(error);
        }
      });
    }
  };

  const disconnect = () => {
    if (printerUSBDevice.current) {
      printerUSBDevice.current.forget();
      statusRef.current = PRINTER_STATUS_OFFLINE;
      printerUSBDevice.current = false;
      listeners.current.forEach((listener) => {
        listener();
      });
    }
  };

  const demo = PrinterDemo(
    printerDevice,
    makeImg,
    QRCode,
    makeBarcode,
    ndarray,
    printer,
    escpos
  );

  instances[name] = {
    statusChangedListener,
    status: () => {
      return statusRef.current;
    },
    connect,
    name: printerName,
    demo,
    print,
    makeQr,
    makeBarcode,
    makeImg,
    disconnect,
  };

  return instances[name];
};
// if (peripheral.ID !== "" && device.Name === "Scanner") {
//   // BarcodeReader.connect(filter);
// }
