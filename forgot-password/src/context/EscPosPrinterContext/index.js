import React, { useLayoutEffect, useRef, useState } from "react";
import escpos from "escpos";
import QRCode from "qrcode";
import ndarray from "ndarray";
import USBAdapter from "./USBAdapter";

escpos.Adapter = USBAdapter;

export const PRINTER_STATUS_OFFLINE = false;
export const PRINTER_STATUS_ONLINE = true;

export const PrinterContext = React.createContext({});

export const PrinterProvider = ({ children }) => {
  const init = useRef(false);
  const printerUSBDevice = useRef(false);
  const printerDevice = useRef(false);
  const printer = useRef(false);
  const [status, setStatus] = useState(PRINTER_STATUS_OFFLINE);

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.usb.addEventListener("disconnect", (event) => {
        console.log("Disconnect", event);
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
        console.log("Printer selected:", device);

        printerUSBDevice.current = device;
        printerDevice.current = new escpos.Adapter(device);
        setStatus(PRINTER_STATUS_ONLINE);
        printer.current = new escpos.Printer(printerDevice.current, {
          width: 20,
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

  const print = () => {
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
                ndarray(
                  new Uint8Array(pixels.data),
                  [img.width, img.height, 4],
                  [4, 4 * img.width, 1],
                  0
                );

                let p = printer.current;

                // for (let w = 0; w < 8; w++) {
                // 	for (let h = 0; h < 8; h++) {
                // 		p = p.size(w, h);
                // 		p = p.text(`Fuente w:${w}x${h}`);
                // 	}
                // }
                p
                  // .font("b")
                  .align("ct")
                  // .style('bu')

                  .feed(1)
                  // .font("b")
                  // .align("ct")
                  // .size(1, 1)
                  .style("normal")
                  .size(1, 1)
                  .text("Jonatan Schijman")

                  .feed(2)
                  .size(1, 0)
                  .text("Tu clave temporal es:")

                  .feed(1)
                  .size(3, 3)
                  .text("JSL3264K")
                  .feed(2)
                  .size(1, 0)
                  .text("Esta clave vence a las:")
                  .feed(1)
                  .size(2, 2)
                  .text("15:30")
                  .size(1, 0)
                  .feed(0)
                  .text("Impreso por:")
                  .size(1, 1)
                  .feed(1)
                  .text("Roman Cardozo")
                  .size(1, 1)
                  .feed(2)
                  // .text("15 minutos")
                  // .feed(2)
                  // .barcode("-01234-DEMO-56789-", "CODE39", {
                  // 	width: 500,
                  // })
                  // .feed(2)

                  // .size(1, 1)

                  // .style("b")
                  // .tableCustom(
                  // 	[
                  // 		{ text: "Columna I", align: "LEFT", width: 0.5 },
                  // 		{ text: "Columna II", align: "RIGHT", width: 0.5 },
                  // 	],
                  // 	"cp857"
                  // )
                  // .style("normal")
                  // .feed(1)
                  // .tableCustom(
                  // 	[
                  // 		{ text: "Dato I", align: "LEFT", width: 0.5 },
                  // 		{ text: "Dato II", align: "RIGHT", width: 0.5 },
                  // 	],
                  // 	"cp857"
                  // )

                  // .feed(1)

                  // .raster(new escpos.Image(qrImg), "dhdw")
                  .drawLine()
                  .feed(3)
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

  const Printer = {
    status,
    connect,
    name,
    print,
  };

  return (
    <PrinterContext.Provider value={{ Printer }}>
      {children}
    </PrinterContext.Provider>
  );
};
