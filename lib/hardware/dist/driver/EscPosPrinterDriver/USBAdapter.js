"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var USBAdapter = function () {
  function USBAdapter(device) {
    _classCallCheck(this, USBAdapter);

    this.device = device;
  }

  _createClass(USBAdapter, [{
    key: "open",
    value: function open(callback) {
      var _this = this;

      this.device.open().then(function () {
        return _this.device.selectConfiguration(1);
      }).then(function () {
        return _this.device.claimInterface(0);
      }).then(function () {
        return callback(null);
      }).catch(function (e) {
        return callback(e);
      });
    }
  }, {
    key: "read",
    value: function read(callback) {
      // console.log("READ");
    }
  }, {
    key: "write",
    value: function write(data, callback) {
      var arrDevices = this.device.configurations[0].interfaces[0].alternates[0].endpoints;
      var optionForEmpoint = arrDevices.filter(function (e) {
        return e.direction === "out";
      });
      this.device.transferOut(optionForEmpoint[0].endpointNumber || 1, data);
    }
  }, {
    key: "close",
    value: function close(callback, timeout) {
      // console.log("CLOSE");
      if (this.device.close()) {
        callback(null);
      } else {
        callback(true);
      }
    }
  }]);

  return USBAdapter;
}();

exports.default = USBAdapter;