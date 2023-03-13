import React, { useLayoutEffect, useRef, useState } from "react"

export const READER_STATUS_OFFLINE = false;
export const READER_STATUS_ONLINE = true;

export const RfIdReaderContext = React.createContext({})

export const RfIdReaderProvider = ({ children }) => {
  const init = useRef(false);
  const port = useRef(false);
  const deviceName = useRef(false);
  const timeout = useRef(false);
  const [ status, setStatus ] = useState(READER_STATUS_OFFLINE);
  const [ data, setData ] = useState(false);
  

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

  const connect = () => {
    navigator.serial.requestPort().then(p => {
      p.open({ baudRate: 9600 }).then(() => {
        port.current = p;
        if (p.readable) {
          const ids = p.getInfo();
          navigator.usb.getDevices().then(devices => {
            devices.forEach(d => {
              if (d.productId === ids.usbProductId && d.vendorId === ids.usbVendorId) {
                deviceName.current = d.productName;
              }
            })
            setStatus(READER_STATUS_ONLINE);
          })
          const reader = port.current.readable.getReader();        
          const read = () => {
            reader.read().then(r => {
              timeout.current = setTimeout(read, 100);
              if (r.value && r.value.length > 5) {
                const str = String.fromCharCode.apply(String, r.value);
                console.log('READED: ' + JSON.stringify(str), r.value);
                if (str.indexOf("\r") > 0) {
                  setData(str.split("\r")[0]);
                }
              }
            })
          }
          read();
        }
      })
    })
    
  };

  const name = () => {
    if (port.current) {
      if (deviceName.current) {
        return deviceName.current;
      }
      return 'Conectado.'
    } else {
      return 'Sin Conexion.'
    }
  }




  const RfIdReader = {
    status,
    connect,
    name,
    data,
  }

  return (<RfIdReaderContext.Provider value={{RfIdReader}}>
    {children}
  </RfIdReaderContext.Provider>)
}