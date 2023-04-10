import { CollectionsBookmarkRounded } from "@mui/icons-material";
import React, { useLayoutEffect, useRef, useState } from "react";

export const READER_STATUS_OFFLINE = false;
export const READER_STATUS_ONLINE = true;

export const BarcodeReaderContext = React.createContext({});

export const BarcodeReaderProvider = ({ children }) => {
  const init = useRef(false);
  const port = useRef(false);
  const deviceName = useRef(false);
  const timeout = useRef(false);
  const [status, setStatus] = useState(READER_STATUS_OFFLINE);
  const [data, setData] = useState(false);

  console.log(port);
  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.serial.addEventListener("disconnect", (event) => {
        if (event.target === port.current) {
          if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = false;
            port.current = false;
            deviceName.current = false;
            setStatus(READER_STATUS_OFFLINE);
          }
        }
      });
    }
  }, []);

  const connect = (filter) => {
    console.log("entra en el connect");
    console.log("filter", filter);
    navigator.serial
      .requestPort({
        filters: [
          {
            usbVendorId: filter.vendorId,
            usbProductId: filter.productId,
          },
        ],
      })
      .then((p) => {
        p.open({ baudRate: 9600 }).then(() => {
          console.log("p1", p);
          console.log("portcurrent", port.current);
          port.current = p;
          console.log("portcurrent2", port.current);
          if (p.readable) {
            const ids = p.getInfo();

            navigator.usb.getDevices().then((devices) => {
              devices.forEach((d) => {
                if (
                  d.productId === ids.usbProductId &&
                  d.vendorId === ids.usbVendorId
                ) {
                  deviceName.current = d.productName;
                }
              });
              console.log("entra1");
              setStatus(READER_STATUS_ONLINE);
              console.log("entra3!!!");
            });
            const reader = port.current.readable.getReader();
            const read = () => {
              reader.read().then((r) => {
                timeout.current = setTimeout(read, 500);
                if (r.value) {
                  const str = String.fromCharCode.apply(String, r.value);
                  setData(str);
                }
              });
            };
            read();
          }
        });
      });
  };

  const disconnect = () => {
    port.current.forget().then((res) => {
      console.log(res);
    });
  };

  const name = () => {
    if (port.current) {
      if (deviceName.current) {
        return deviceName.current;
      }
      return "✓ ";
    } else {
      return "Sin Conexión";
    }
  };

  const clear = () => {
    setData(false);
  };

  const BarcodeReader = {
    status,
    connect,
    name,
    data,
    clear,
    disconnect,
  };

  return (
    <BarcodeReaderContext.Provider value={{ BarcodeReader }}>
      {children}
    </BarcodeReaderContext.Provider>
  );
};
