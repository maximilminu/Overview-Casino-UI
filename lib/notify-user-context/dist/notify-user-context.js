"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.NotifyUserProvider = exports.NotifyUserContext = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _notistack = require("notistack");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotifyUserContext = exports.NotifyUserContext = _react2.default.createContext({});

var NotifyUserProvider = exports.NotifyUserProvider = (0, _react.memo)(function (_ref) {
	var children = _ref.children;

	var snackbarRef = (0, _react.useRef)();

	var _useSnackbar = (0, _notistack.useSnackbar)(),
	    enqueueSnackbar = _useSnackbar.enqueueSnackbar;

	snackbarRef.current = enqueueSnackbar;

	var NotifyUser = {
		Error: function Error(message) {
			snackbarRef.current(message, {
				variant: "error",
				persist: false,
				preventDuplicate: true
			});
		},
		Warning: function Warning(message) {
			snackbarRef.current(message, {
				variant: "warning",
				persist: false,
				preventDuplicate: true
			});
		},
		Info: function Info(message) {
			snackbarRef.current(message, {
				variant: "info",
				persist: false,
				preventDuplicate: true
			});
		},
		Success: function Success(message) {
			snackbarRef.current(message, {
				variant: "success",
				persist: false,
				preventDuplicate: true
			});
		}
	};

	return _react2.default.createElement(
		NotifyUserContext.Provider,
		{ value: NotifyUser },
		children
	);
});