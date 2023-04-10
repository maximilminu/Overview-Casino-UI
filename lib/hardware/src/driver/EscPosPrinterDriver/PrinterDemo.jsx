import logo from "./logo";

export const PrinterDemo = (
  printerDevice,
  makeImg,
  QRCode,
  makeBarcode,
  ndarray,
  printer,
  escpos
) => {
  const demo = (text) => {
    console.log("Printing demo for %s", text, printerDevice.current);
    if (printerDevice.current) {
      printerDevice.current.open((error) => {
        if (!error) {
          QRCode.toDataURL(
            text,
            { type: "png", errorCorrectionLevel: "M", version: 4 },
            (err, url) => {
              if (err) {
                console.error("ERROR CREATING QR", err);
                return;
              }
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.onload = async function () {
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
                const logoImage = new Image();
                logoImage.src = logo;
                makeImg(logoImage, 300, 80).then((imgToPrint) => {
                  let p = printer.current;
                  p.align("ct")
                    .raster(imgToPrint)

                    .feed(1)
                    .raster(makeBarcode("-01234-DEMO-56789-", "CODE128"))

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
                    .size(1, 1)
                    .raster(new escpos.Image(qrImg), "dhdw")
                    .drawLine()
                    .size(0, 0)
                    .text("0x0 " + text)
                    .feed(1)
                    .size(1, 0)
                    .text("1x0 " + text)
                    .feed(1)
                    .size(0, 1)
                    .text("0x1 " + text)
                    .feed(1)
                    .size(1, 1)
                    .text("1x1 " + text)
                    .feed(1)
                    .size(2, 2)
                    .text("2x2 " + text)
                    .feed(1)
                    .size(3, 3)
                    .text("3x3 " + text)
                    .feed(1)
                    .size(4, 4)
                    .text("4x4 " + text)
                    .size(1, 1)
                    .style("b")
                    .drawLine()
                    .feed(2)
                    .cut()
                    .close();
                });
              };
              img.onerror = function (err) {
                console.error("ERROR READING IMG:", err);
              };

              img.src = url;
            }
          );
        } else {
          console.error("Printer error", error);
        }
      });
    }
  };

  return demo;
};
