"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SerialAdapter = function () {
  function SerialAdapter(port) {
    _classCallCheck(this, SerialAdapter);

    this.port = port;
  }

  _createClass(SerialAdapter, [{
    key: "open",
    value: function open(callback) {
      this.port.open({ baudRate: 9600, flowControl: "hardware" }).then(function () {
        callback();
      }).catch(function () {
        callback(true);
      });
    }
  }, {
    key: "read",
    value: function read(callback) {
      console.log("READ");
    }
  }, {
    key: "write",
    value: function write(data, callback) {
      var writer = this.port.writable.getWriter();
      console.log("Wrinting", data);
      writer.write(data).then(function () {
        writer.releaseLock();
        callback();
      }).catch(function () {
        callback(true);
      });
    }
  }, {
    key: "close",
    value: function close(callback, timeout) {
      console.log("CLOSE");
      if (this.port.close()) {
        callback(null);
      } else {
        callback(true);
      }
    }
  }]);

  return SerialAdapter;
}();

exports.default = SerialAdapter;