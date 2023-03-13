import React, { useLayoutEffect, useRef, useState } from "react";
import escpos from "escpos";
import QRCode from "qrcode";
import ndarray from "ndarray";
import USBAdapter from "./USBAdapter";
import JsBarcode from "jsbarcode";
import PrinterDemo from './PrinterDemo'

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
				printer.current.model("qsprinter");
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

	const barcode = (value, format="ITF",width=800,height=300, displayValue= false)=>{
		const canvasBC = document.createElement("canvas");
		canvasBC.width = width;
		canvasBC.height = height;

		JsBarcode(canvasBC, `${value}`, {
			format,
			displayValue,
			fontSize: 20,
			margin: 10,
			
		});
		
		const ctx = canvasBC.getContext('2d');

		const pixelsBC = ctx.getImageData(0, 0, canvasBC.width, canvasBC.height);
		const bcImg = ndarray(
			new Uint8Array(pixelsBC.data),
			[canvasBC.width, canvasBC.height, 4],
			[4, 4 * canvasBC.width, 1],
			0
		);
		return new escpos.Image(bcImg,"dhdw")
	}


	const printImg=(img,wd=200,hg=300)=>
		new Promise((resolve,reject)=>{
			img.onerror = function (err) {
				console.error("ERROR READING IMG:", err);
				reject(err);
			};
			img.onload = ()=>{
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
			}
		})


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

	const demo = PrinterDemo(printerDevice,printImg,QRCode,barcode,ndarray,printer,escpos);

	const Printer = {
		status,
		connect,
		name,
		demo,
		print,
		makeQr,
		barcode,
		printImg
	};

	return (
		<EscPosPrinterContext.Provider value={{ Printer }}>
			{children}
		</EscPosPrinterContext.Provider>
	);
};
