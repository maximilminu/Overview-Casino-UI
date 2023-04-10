"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ThemeContext = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
// eslint-disable-next-line


var _react = require("react");

var _system = require("@mui/system");

var _material = require("@mui/material");

var _configSignin = require("@oc/config-signin");

var ThemeContext = exports.ThemeContext = (0, _react.createContext)();

var ThemeProvider = function ThemeProvider(_ref) {
	var children = _ref.children;

	var _useState = (0, _react.useState)(false),
	    _useState2 = _slicedToArray(_useState, 2),
	    theme = _useState2[0],
	    setTheme = _useState2[1];

	var config = (0, _react.useContext)(_configSignin.ConfigContext);

	(0, _react.useLayoutEffect)(function () {
		setTheme((0, _material.createTheme)(config.theme));
		// eslint-disable-next-line
	}, []);

	//!ADD TO .env FILE : REACT_APP_VERSION=$npm_package_version
	var packageJson = process.env.REACT_APP_VERSION;

	return React.createElement(
		ThemeContext.Provider,
		{ value: "" },
		theme && React.createElement(
			_system.ThemeProvider,
			{ theme: theme },
			children,
			React.createElement(_material.CssBaseline, null),
			packageJson.includes("rc") && React.createElement(_material.Box, {
				sx: {
					border: "3px solid red",
					position: "fixed",
					bottom: 0,
					left: 0,
					right: 0,
					top: 0,
					zIndex: 999999,
					pointerEvents: "none"
				}
			})
		)
	);
};

exports.default = ThemeProvider;