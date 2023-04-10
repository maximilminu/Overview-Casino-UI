"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserContext = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _apiContext = require("@oc/api-context");

var _jwtDecode = require("jwt-decode");

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserContext = exports.UserContext = (0, _react.createContext)();

var UserProvider = function UserProvider(_ref) {
	var children = _ref.children;

	var _useState = (0, _react.useState)(),
	    _useState2 = _slicedToArray(_useState, 2),
	    userProfile = _useState2[0],
	    setUserProfile = _useState2[1];

	var _useContext = (0, _react.useContext)(_apiContext.ApiContext),
	    AccessToken = _useContext.AccessToken;

	(0, _react.useLayoutEffect)(function () {
		setUserProfile((0, _jwtDecode2.default)(AccessToken).Profile);

		// eslint-disable-next-line
	}, []);

	return _react2.default.createElement(
		UserContext.Provider,
		{ value: userProfile },
		children
	);
};

exports.default = UserProvider;