"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var formatLocalCurrency = new Intl.NumberFormat("es-AR", {
	style: "currency",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
	currency: "ARG"
});
var FormatLocalCurrency = exports.FormatLocalCurrency = function FormatLocalCurrency(val) {
	return formatLocalCurrency.format(val).replace("ARG", "$");
};

var formatLocalDateTime = new Intl.DateTimeFormat("es-AR", {
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
	hour12: false
});
var FormatLocalDateTime = exports.FormatLocalDateTime = formatLocalDateTime.format;

var formatLocalDate = new Intl.DateTimeFormat("es-AR", {
	year: "numeric",
	month: "numeric",
	day: "numeric"
});
var FormatLocalDate = exports.FormatLocalDate = formatLocalDate.format;

var formatLocalTime = new Intl.DateTimeFormat("es-AR", {
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
	hour12: false
});
var FormatLocalTime = exports.FormatLocalTime = formatLocalTime.format;