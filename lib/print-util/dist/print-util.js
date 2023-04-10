"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.print = exports.printDescValue = exports.printFailureBySupervisor = exports.printSignature = exports.printFailure = exports.printTitle = undefined;

var _localFormatUtil = require("@oc/local-format-util");

var printTitle = exports.printTitle = function printTitle(printer, title) {
	printer.align("ct").style("normal").size(0, 0).text("─".repeat(45)).size(1, 0).style("b");
	(Array.isArray(title) ? title : [title]).forEach(function (t) {
		return printer.text(t);
	});
	printer.style("normal").size(0, 0).text("─".repeat(45));
};

var printFailure = exports.printFailure = function printFailure(printer, data) {
	if (data.OverTolerance) {
		printer.feed(1).style("b").size(0, 1).align("ct").text("FALLO - SOBRANTE").style("normal").size(0, 0);
		if (data.Tolerance !== 0) {
			printer.text("Tolerancia: " + (0, _localFormatUtil.FormatLocalCurrency)(data.Tolerance)).feed(1);
		}
	}
	if (data.UnderTolerance) {
		printer.feed(1).style("b").size(0, 1).align("ct").text("FALLO - FALTANTE").style("normal").size(0, 0);
		if (data.Tolerance !== 0) {
			printer.text("Tolerancia: " + (0, _localFormatUtil.FormatLocalCurrency)(data.Tolerance)).feed(1);
		}
	}
};

var printSignature = exports.printSignature = function printSignature(printer, name, title) {
	printer.align("ct").style("normal").size(0, 0).feed(7).text("-".repeat(30)).size(1, 0).style("b").text(name).style("normal").size(0, 0).text(title).size(0, 0);
};

var printFailureBySupervisor = exports.printFailureBySupervisor = function printFailureBySupervisor(printer, data) {
	console.log(data, "data");
	if (data.OverToleranceBySupervisor) {
		printer.feed(1).style("b").size(0, 1).align("ct").text("FALLO - SOBRANTE").style("normal").size(0, 0);
		if (data.Tolerance !== 0) {
			printer.text("Tolerancia: " + (0, _localFormatUtil.FormatLocalCurrency)(data.Tolerance)).feed(1);
		}
	}
	if (data.UnderToleranceBySupervisor) {
		printer.feed(1).style("b").size(0, 1).align("ct").text("FALLO - FALTANTE").style("normal").size(0, 0);
		if (data.Tolerance !== 0) {
			printer.text("Tolerancia: " + (0, _localFormatUtil.FormatLocalCurrency)(data.Tolerance)).feed(1);
		}
	}
};

var printDescValue = exports.printDescValue = function printDescValue(printer, description, value) {
	var style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "normal";
	var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 48;
	var sign = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	console.log(value, "value");
	var val = void 0;
	if (!sign) {
		val = (0, _localFormatUtil.FormatLocalCurrency)(Math.abs(value)) + (value < 0 ? " ".repeat(15) : "");
	} else {
		val = (0, _localFormatUtil.FormatLocalCurrency)(value);
	}
	var w = width - (description.length + val.length);
	printer.style(style).align("lt").text((w < 1 ? description.substring(0, w - 1) : description) + (w > 0 ? " ".repeat(w) : "") + val);
};

var print = exports.print = function print(data, qr, url) {
	return function (printer) {
		return new Promise(function (resolve) {
			console.log(data, "data");
			printFailure(printer, data);

			printTitle(printer, ["Arqueo de caja", "", data.RegisteredBy.FullName, data.Qty + "° del " + (0, _localFormatUtil.FormatLocalDate)(new Date(data.WorkingDate)), (0, _localFormatUtil.FormatLocalDateTime)(new Date(data.CreatedAt))]);

			printTitle(printer, "Estado actual");

			printer.align("lt").style("b").text("" + " Denomin. x Cantidad".padEnd(20, " ") + " ".repeat(6) + "SubTotal".padStart(20, " ")).style("normal");

			Object.keys(data.Bills).sort(function (a, b) {
				return b - a;
			}).forEach(function (denom) {
				return printer.text("" + ("$ " + String(denom).padStart(7, " ") + " x " + String(data.Bills[denom]).padStart(8, " ")) + " ".repeat(6) + (0, _localFormatUtil.FormatLocalCurrency)(denom * data.Bills[denom]).padStart(20, " "));
			});

			printTitle(printer, "Movimientos");
			printer.text("Descripción               Haber         Debe");
			data.RegisterHistory.forEach(function (ch) {
				printDescValue(printer, "Arqueo parcial " + (0, _localFormatUtil.FormatLocalTime)(ch.RegisteredAt), ch.Balance);
			});
			data.TreasureToCashierHistory.forEach(function (ch) {
				return printDescValue(printer, ch.Description + " por " + ch.Treasurer.FullName, ch.Amount);
			});

			printDescValue(printer, "TOTAL PAGADOS", -data.TotalPaidTickets);
			printDescValue(printer, "TOTAL EMITIDOS", data.TotalIssuedTickets);

			printTitle(printer, "Resumen");
			printDescValue(printer, "Entradas", data.TotalIn);
			printDescValue(printer, "Salidas", -data.TotalOut);
			printDescValue(printer, "En caja", -data.TotalBills);

			printTitle(printer, "BALANCE");
			if (data.BalanceBySupervisor) {
				printDescValue(printer, "SUPERVISOR", data && data.BalanceBySupervisor, "b", 24, true);
				printFailureBySupervisor(printer, data);
			} else {
				printDescValue(printer, "CAJERO", data.Balance, "b", 24, true);
				printFailure(printer, data);
			}

			printer.align("lt").style("b").size(1, 0).text("-".repeat(24));

			// printer.size(0, 0).raster(qr).align("ct").text(url);

			// printSignature(printer, data.RegisteredBy.FullName, "Cajero");
			// if (data.Authorizing) {
			//   printSignature(printer, data.Authorizing.FullName, data.Authorizing.Role);
			// }
			data.BalanceBySupervisor ? printFailureBySupervisor(printer, data) : printFailure(printer, data);

			resolve();
		});
	};
};