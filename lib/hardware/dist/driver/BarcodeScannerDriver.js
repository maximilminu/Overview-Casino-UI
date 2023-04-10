"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBarcodeScanner = exports.READER_STATUS_ONLINE = exports.READER_STATUS_OFFLINE = undefined;

var _react = require("react");

var READER_STATUS_OFFLINE = exports.READER_STATUS_OFFLINE = false;
var READER_STATUS_ONLINE = exports.READER_STATUS_ONLINE = true;

var instances = {};

var useBarcodeScanner = exports.useBarcodeScanner = function useBarcodeScanner(name) {
  var init = (0, _react.useRef)(false);
  var port = (0, _react.useRef)(false);
  var reader = (0, _react.useRef)(false);
  var deviceName = (0, _react.useRef)(false);
  var timeout = (0, _react.useRef)(false);
  var statusRef = (0, _react.useRef)(READER_STATUS_OFFLINE);
  var listeners = (0, _react.useRef)([]);
  var dataListeners = (0, _react.useRef)({});
  var dataListenersId = (0, _react.useRef)(0);

  (0, _react.useLayoutEffect)(function () {
    if (!init.current) {
      init.current = true;

      navigator.serial.addEventListener("disconnect", function (event) {
        console.log("event.target", event.target);
        console.log("port.current", port.current);
        if (event.target === port.current) {
          if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = false;
            port.current = false;
            deviceName.current = false;
            statusRef.current = READER_STATUS_OFFLINE;
            listeners.current.forEach(function (listener) {
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

  var onDataListener = function onDataListener(listener) {
    var id = dataListenersId.current++;
    dataListeners.current[id] = listener;
    return function () {
      delete dataListeners.current[id];
    };
  };

  var statusChangedListener = function statusChangedListener(listener) {
    listeners.current.push(listener);
  };

  var connect = function connect(filter) {
    return navigator.serial.requestPort({
      filters: [{
        usbVendorId: filter.vendorId,
        usbProductId: filter.productId
      }]
    }).then(function (p) {
      return p.open({ baudRate: 9600 }).then(function () {
        port.current = p;
        if (p.readable) {
          var ids = p.getInfo();
          return navigator.usb.getDevices().then(function (devices) {
            devices.forEach(function (d) {
              if (d.productId === ids.usbProductId && d.vendorId === ids.usbVendorId) {
                deviceName.current = d.productName;
              }
            });
            statusRef.current = READER_STATUS_ONLINE;

            reader.current = port.current.readable.getReader();
            reader.current.cancel().then(function () {
              reader.current.releaseLock();
              reader.current = port.current.readable.getReader();
              var read = function read() {
                if (reader.current) {
                  reader.current.read().then(function (r) {
                    timeout.current = setTimeout(read, 500);
                    if (r.value) {
                      var str = String.fromCharCode.apply(String, r.value);
                      Object.keys(dataListeners.current).forEach(function (id) {
                        console.log("Sending data from scanner to %s [%s]", id, str);
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
    }).catch(function (err) {
      statusRef.current = READER_STATUS_ONLINE;
      console.error(err);
      return err;
    });
  };

  var barcodeName = function barcodeName() {
    if (port.current) {
      if (deviceName.current) {
        return deviceName.current;
      }
      return "✓ ";
    } else {
      return "Sin Conexión";
    }
  };

  var disconnect = function disconnect() {
    if (reader.current) {
      reader.current.cancel().then(function () {
        reader.current.releaseLock();
        port.current.close();
        deviceName.current = false;
        port.current = false;
        reader.current = false;
        statusRef.current = READER_STATUS_OFFLINE;
        listeners.current.forEach(function (listener) {
          listener();
        });
        setData(false);
      });
    }
  };

  var clear = function clear() {
    setData(false);
  };

  instances[name] = {
    onDataListener: onDataListener,
    statusChangedListener: statusChangedListener,
    status: function status() {
      return statusRef.current;
    },
    connect: connect,
    name: barcodeName,
    disconnect: disconnect,
    clear: clear
  };

  return instances[name];
};