import React, { memo, useLayoutEffect, useState } from "react";
import { usePrinter } from "./driver/EscPosPrinterDriver";
import { useCamera } from "./driver/CameraDriver";
import { useBarcodeScanner } from "./driver/BarcodeScannerDriver";

export const HardwareContext = React.createContext({});

export const HardwareProvider = memo(({ children }) => {
	const EscPosPrinter = [
		usePrinter(0),
		usePrinter(1),
		usePrinter(2),
		usePrinter(3),
		usePrinter(4),
		usePrinter(5),
	];

	const Camera = [
		useCamera(0),
		useCamera(1),
		useCamera(2),
		useCamera(3),
		useCamera(4),
		useCamera(5),
	];

	const BarcodeScanner = [
		useBarcodeScanner(0),
		useBarcodeScanner(1),
		useBarcodeScanner(2),
		useBarcodeScanner(3),
		useBarcodeScanner(4),
		useBarcodeScanner(5),
	];

	const [hardware, setHardware] = useState(false);
  const [init, setInit] = useState(false);

	const drivers = {
		EscPosPrinter,
		BarcodeScanner,
		// TclPrinter,
		Camera,
	};

	const checkSecureBrowserInit = () => {
		if (
			window.SecureBrowser &&
			window.SecureBrowser.Configs &&
			window.SecureBrowser.Configs.Peripherals
		) {
			const driversFree = {
        EscPosPrinter: 0,
        BarcodeScanner: 0,
        Camera: 0
      };
			const h = Object.assign({}, window.SecureBrowser, { Device: {} });

			Object.keys(window.SecureBrowser.Configs.Peripherals).forEach((Name) => {
				try {
					const d = drivers[window.SecureBrowser.Configs.Peripherals[Name].Driver][driversFree[window.SecureBrowser.Configs.Peripherals[Name].Driver]];
          driversFree[window.SecureBrowser.Configs.Peripherals[Name].Driver]++;
					h.Device[Name] = d;
				} catch (e) {
					console.error(
						"Can't instance driver:",
						Name,
						window.SecureBrowser.Configs.Peripherals[Name],
						e
					);
				}
			});
      h.ConnectAll = () => new Promise(resolve => {
        if (!init) {
          setInit(true);
          let count = Object.keys(h.Device).length;
          let qty = 0;
          Object.keys(h.Device).forEach(name => {
            if (h.Configs.Peripherals[name].Filter) {
              h.Device[name].connect(h.Configs.Peripherals[name].Filter)
              .then(() => {
                qty++;
              })
              .catch(err => {
                console.error(err);
              })
              .finally(() => {
                count--;
                if (count === 0) {
                  resolve({Total: Object.keys(h.Device).length, Init: qty});
                }
              })
            }
          })
        } else {
          resolve({Total: 0, Init: 0});
        }
      });

			setHardware(h);
		} else {
			setTimeout(checkSecureBrowserInit, 250);
		}
	};

	useLayoutEffect(() => {
		checkSecureBrowserInit();
	}, []);

	return (
		<HardwareContext.Provider value={hardware}>
			{(hardware && children) || "Esperando configuración del secure browser"}
		</HardwareContext.Provider>
	);
});
