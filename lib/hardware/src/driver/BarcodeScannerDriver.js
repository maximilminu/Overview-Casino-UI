import { useLayoutEffect, useRef, useState } from "react";

export const READER_STATUS_OFFLINE = false;
export const READER_STATUS_ONLINE = true;

const instances = {};

export const useBarcodeScanner = (name) => {
  const init = useRef(false);
  const port = useRef(false);
  const reader = useRef(false);
  const deviceName = useRef(false);
  const timeout = useRef(false);
  const statusRef = useRef(READER_STATUS_OFFLINE);
  const listeners = useRef([]);
  const dataListeners = useRef({});
  const dataListenersId = useRef(0);

  useLayoutEffect(() => {
    if (!init.current) {
      init.current = true;

      navigator.serial.addEventListener("disconnect", (event) => {
        console.log("event.target", event.target);
        console.log("port.current", port.current);
        if (event.target === port.current) {
          if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = false;
            port.current = false;
            deviceName.current = false;
            statusRef.current = READER_STATUS_OFFLINE;
            listeners.current.forEach((listener) => {
              listener();
            });
          }
        }
      });
    }
  }, []);

  if (instances[name]) {
    return instances[name];
  }

  const onDataListener = (listener) => {
    const id = dataListenersId.current++;
    dataListeners.current[id] = listener;
    return () => {
      delete dataListeners.current[id];
    };
  };

  const statusChangedListener = (listener) => {
    listeners.current.push(listener);
  };

  const connect = (filter) => {
    return navigator.serial
      .requestPort({
        filters: [
          {
            usbVendorId: filter.vendorId,
            usbProductId: filter.productId,
          },
        ],
      })
      .then((p) => {
        return p.open({ baudRate: 9600 }).then(() => {
          port.current = p;
          if (p.readable) {
            const ids = p.getInfo();
            return navigator.usb.getDevices().then((devices) => {
              devices.forEach((d) => {
                if (
                  d.productId === ids.usbProductId &&
                  d.vendorId === ids.usbVendorId
                ) {
                  deviceName.current = d.productName;
                }
              });
              statusRef.current = READER_STATUS_ONLINE;

              reader.current = port.current.readable.getReader();
              reader.current.cancel().then(() => {
                reader.current.releaseLock();
                reader.current = port.current.readable.getReader();
                const read = () => {
                  if (reader.current) {
                    reader.current.read().then((r) => {
                      timeout.current = setTimeout(read, 500);
                      if (r.value) {
                        const str = String.fromCharCode.apply(String, r.value);
                        Object.keys(dataListeners.current).forEach((id) => {
                          console.log(
                            "Sending data from scanner to %s [%s]",
                            id,
                            str
                          );
                          dataListeners.current[id](str);
                        });
                      }
                    });
                  }
                };
                read();
              });
            });
          }
        });
      })
      .catch((err) => {
        statusRef.current = READER_STATUS_ONLINE;
        console.error(err);
        return err;
      });
  };

  const barcodeName = () => {
    if (port.current) {
      if (deviceName.current) {
        return deviceName.current;
      }
      return "✓ ";
    } else {
      return "Sin Conexión";
    }
  };

  const disconnect = () => {
    if (reader.current) {
      reader.current.cancel().then(() => {
        reader.current.releaseLock();
        port.current.close();
        deviceName.current = false;
        port.current = false;
        reader.current = false;
        statusRef.current = READER_STATUS_OFFLINE;
        listeners.current.forEach((listener) => {
          listener();
        });
        setData(false);
      });
    }
  };

  const clear = () => {
    setData(false);
  };

  instances[name] = {
    onDataListener,
    statusChangedListener,
    status: () => {
      return statusRef.current;
    },
    connect,
    name: barcodeName,
    disconnect,
    clear,
  };

  return instances[name];
};
