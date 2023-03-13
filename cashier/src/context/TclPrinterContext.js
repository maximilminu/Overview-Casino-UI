import React, { useLayoutEffect, useRef, useState } from "react";
import dayjs from "dayjs";

export const PRINTER_STATUS_OFFLINE = false;
export const PRINTER_STATUS_ONLINE = true;

export const TclPrinterContext = React.createContext({});

export const TclPrinterProvider = ({ children }) => {
  const init = useRef(false);
  const port = useRef(false);
  const deviceName = useRef(false);
  const timeout = useRef(false);
  const [status, setStatus] = useState(PRINTER_STATUS_OFFLINE);
  //const [ status, setStatus ] = useState(PRINTER_STATUS_OFFLINE);

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
            setStatus(PRINTER_STATUS_OFFLINE);
          }
        }
      });
    }
  }, []);

  const getStatus = () => {
    const writer = port.current.writable.getWriter();
    writer.write(new Uint8Array([0x05])).then(() => {
      writer.releaseLock();
    });
  };

  const connect = () => {
    navigator.serial.requestPort().then((p) => {
      p.open({ baudRate: 9600 }).then(() => {
        port.current = p;
        setStatus(PRINTER_STATUS_ONLINE);

        const reader = port.current.readable.getReader();
        const read = () => {
          reader.read().then((r) => {
            setTimeout(read, 100);
            if (r.value && r.value.length > 5) {
              const str = String.fromCharCode
                .apply(String, r.value)
                .trim()
                .replace(/^\*/, "")
                .replace(/\*$/, "");
              const data = str.split("|");
              if (data[0] === "S") {
                // eslint-disable-next-line
                const [
                  cmd,
                  unitAddr,
                  softVer,
                  status1,
                  status2,
                  status3,
                  status4,
                  status5,
                  temp,
                ] = data;
                console.log(
                  `Printer #${unitAddr} is version ${softVer} Status:`,
                  status1.charCodeAt(0),
                  status2.charCodeAt(0),
                  status3.charCodeAt(0),
                  status4.charCodeAt(0),
                  status5.charCodeAt(0)
                );

                if (status4.charCodeAt(0) & (0x02 > 0)) {
                  console.log("Paper Jam");
                }
              } else {
                console.log("Strange reading from printer: %s", str);
              }
              //S|0|GRARG5914|@|@|`|C|A|P |*
            }
          });
        };
        read();
        setTimeout(getStatus, 500);
      });
    });
  };

  const name = () => {
    if (port.current) {
      if (deviceName.current) {
        return deviceName.current;
      }
      return "Conectado.";
    } else {
      return "Sin Conexion.";
    }
  };

  const print = (data, type) => {
    if (port.current) {
      const code =
        String(data.barCode).substring(0, 2) +
        "-" +
        String(data.barCode).substring(2, 6) +
        "-" +
        String(data.barCode).substring(6, 10) +
        "-" +
        String(data.barCode).substring(10, 14) +
        "-" +
        String(data.barCode).substring(14, 18) +
        "/00";
      const date = dayjs(data.date);
      const ticket = `^P|${type || 0}|1|${data.side}|${data.header}|${
        data.titleLeft
      }|${data.titleRight}|||${code}|${date.format("DD-MM-YYYY")}|${date.format(
        "HH:mm:ss"
      )}|TICKET #${data.number}|||$${String(data.value).replace(",", ".")}||${
        data.validityDays
      }|${data.footer}|${data.barCode}|^`;
      const encoder = new TextEncoder();
      const writer = port.current.writable.getWriter();
      console.log('Printing:', ticket);
      writer.write(encoder.encode(ticket)).then(() => {
        writer.releaseLock();
        getStatus();
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
    <TclPrinterContext.Provider value={{ Printer }}>
      {children}
    </TclPrinterContext.Provider>
  );
};
