"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ConfigProvider = exports.ConfigContext = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _apiContext = require("@oc/api-context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfigContext = exports.ConfigContext = (0, _react.createContext)();

var ConfigProvider = exports.ConfigProvider = function ConfigProvider(_ref) {
	var children = _ref.children;

	var _useContext = (0, _react.useContext)(_apiContext.ApiContext),
	    Get = _useContext.Get;

	var _useState = (0, _react.useState)({}),
	    _useState2 = _slicedToArray(_useState, 2),
	    config = _useState2[0],
	    setConfig = _useState2[1];

	var _useState3 = (0, _react.useState)(3),
	    _useState4 = _slicedToArray(_useState3, 2),
	    dots = _useState4[0],
	    setDots = _useState4[1];

	(0, _react.useEffect)(function () {
		readConfig();
		// eslint-disable-next-line
	}, []);

	var readConfig = function readConfig() {
		Get("/config/v1").then(function (_ref2) {
			var data = _ref2.data;

			if (!data.Theme) {
				setTimeout(readConfig, 1000);
				setDots(function (prevState) {
					return prevState + 1;
				});
				return;
			}
			setConfig(data);
			setDots(0);
		});
	};
	return _react2.default.createElement(
		ConfigContext.Provider,
		{ value: config },
		config.Theme ? children : "Leyendo configuraciones de la página" + ".".repeat(dots)
	);
};