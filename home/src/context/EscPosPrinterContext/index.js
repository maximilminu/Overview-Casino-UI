import React, { useLayoutEffect, useRef, useState } from "react";
import escpos from "escpos";
import QRCode from "qrcode";
import ndarray from "ndarray";
import USBAdapter from "./USBAdapter";

escpos.Adapter = USBAdapter;

export const PRINTER_STATUS_OFFLINE = false;
export const PRINTER_STATUS_ONLINE = true;

export const EscPosPrinterContext = React.createContext({});

export const EscPosPrinterProvider = ({ children }) => {
  const init = useRef(false);
  const printerUSBDevice = useRef(false);
  const printerDevice = useRef(false);
  const printer = useRef(false);
  const [status, setStatus] = useState(PRINTER_STATUS_OFFLINE);

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.usb?.addEventListener("disconnect", (event) => {
        if (
          printerUSBDevice.current &&
          event.device.serialNumber === printerUSBDevice.current.serialNumber
        ) {
          printerUSBDevice.current.forget();
          setStatus(PRINTER_STATUS_OFFLINE);
        }
      });
    }
  }, []);

  const connect = () => {
    navigator.usb
      .requestDevice({
        filters: [
          {
            classCode: 0x07,
          },
        ],
      })
      .then((device) => {
        printerUSBDevice.current = device;
        printerDevice.current = new escpos.Adapter(device);
        setStatus(PRINTER_STATUS_ONLINE);
        printer.current = new escpos.Printer(printerDevice.current, {
          width: 20,
          encoding: "850",
        });
        printer.current.model(null);
      });
  };

  const name = () => {
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

  const demo = () => {
    if (printerDevice.current) {
      printerDevice.current.open((error) => {
        console.log("After open", error);
        if (!error) {
          QRCode.toDataURL(
            "This is a demo QR",
            { type: "png", errorCorrectionLevel: "M", version: 4 },
            (err, url) => {
              if (err) {
                console.error("ERROR CREATING QR", err);
                return;
              }
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.onload = function () {
                var canvas = document.createElement("canvas");

                canvas.width = img.width;
                canvas.height = img.height;
                var context = canvas.getContext("2d");
                context.drawImage(img, 0, 0);
                var pixels = context.getImageData(2, 2, img.width, img.height);

                const qrImg = ndarray(
                  new Uint8Array(pixels.data),
                  [img.width, img.height, 4],
                  [4, 4 * img.width, 1],
                  0
                );

                let p = printer.current;
                p.size(1, 1)
                  .text("Texto 1x1")
                  .text("123456789012345678901234567890")

                  .feed(1)

                  .size(2, 2)
                  .text("Texto 2x2")
                  .text("12345678901234567890")

                  .feed(1)

                  .size(3, 3)
                  .style("b")
                  .text("Texto 3x3")
                  .text("1234567890")

                  .feed(2)

                  .size(4, 4)
                  .style("B")
                  .text("Texto 3 - 4x4")
                  .text("123456789012")

                  .feed(2)

                  .size(5, 5)
                  .text("Texto 4 - 5x5")
                  .text("1234567890")

                  .feed(2)

                  .barcode("-01234-DEMO-56789-", "CODE39", {
                    width: 500,
                  })
                  .feed(2)

                  .size(1, 1)

                  .style("b")
                  .tableCustom(
                    [
                      { text: "Columna I", align: "LEFT", width: 0.5 },
                      { text: "Columna II", align: "RIGHT", width: 0.5 },
                    ],
                    "cp857"
                  )
                  .style("normal")
                  .feed(1)
                  .tableCustom(
                    [
                      { text: "Dato I", align: "LEFT", width: 0.5 },
                      { text: "Dato II", align: "RIGHT", width: 0.5 },
                    ],
                    "cp857"
                  )

                  .feed(1)
                  .size(3, 3)
                  .raster(new escpos.Image(qrImg), "dhdw")
                  .drawLine()
                  .feed(5)
                  .cut()
                  .close();
              };
              img.onerror = function (err) {
                console.error("ERROR READING IMG:", err);
              };
              img.src = url;
            }
          );

          // QRCode.toDataURL('This is a demo QR', { errorCorrectionLevel: 'M', version: 2 },  (err, url) => {
          //   if (err) {
          //     console.error('ERROR CREATING QR', err);
          //     return
          //   }
          //   console.log(url);
          //   escpos.Image().load(url, 'image/png', (img) => {

          //   })

          // })
        }
      });
    }
  };

  const print = (printFunc, errorFunc) => {
    if (status === PRINTER_STATUS_OFFLINE) {
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

  const Printer = {
    status,
    connect,
    name,
    demo,
    print,
    makeQr,
  };

  return (
    <EscPosPrinterContext.Provider value={{ Printer }}>
      {children}
    </EscPosPrinterContext.Provider>
  );
};
