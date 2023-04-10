"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AutoDeepLinkContext = undefined;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _apiContext = require("@oc/api-context");

var AutoDeepLinkContext = exports.AutoDeepLinkContext = (0, _react.createContext)();

var AutoDeepLinkProvider = function AutoDeepLinkProvider(_ref) {
	var children = _ref.children;

	var location = (0, _reactRouterDom.useLocation)();

	var _useContext = (0, _react.useContext)(_apiContext.ApiContext),
	    Post = _useContext.Post;

	(0, _react.useEffect)(function () {
		Post("/session/v1/public/AfterLoginGoTo", document.location.href);
		// eslint-disable-next-line
	}, [location]);

	return React.createElement(
		AutoDeepLinkContext.Provider,
		{ value: "" },
		children
	);
};

exports.default = AutoDeepLinkProvider;