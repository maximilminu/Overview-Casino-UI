"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _iconsMaterial = require("@mui/icons-material");

var _material = require("@mui/material");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DriverIcon = {
	Camera: _iconsMaterial.Videocam,
	EscPosPrinter: _iconsMaterial.Print,
	TclPrinter: _iconsMaterial.BookOnline,
	BarcodeScanner: _iconsMaterial.QrCodeScanner
};

var HardwareButton = function HardwareButton(props) {
	var Icon = DriverIcon[props.driver];

	return _react2.default.createElement(
		_material.IconButton,
		{
			onClick: function onClick() {
				if (!props.disabled && props.status) {
					props.onClick(props.name);
				}
			},
			sx: {
				flexDirection: "column",
				color: props.disabled ? "grey" : props.status ? "green" : "red"
			}
		},
		_react2.default.createElement(
			"i",
			null,
			_react2.default.createElement(Icon, null)
		),
		_react2.default.createElement(
			_material.Typography,
			{ sx: { color: "black" }, fontSize: "x-small" },
			props.label
		)
	);
};

exports.default = HardwareButton;