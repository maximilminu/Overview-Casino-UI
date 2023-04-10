import {
  FormatLocalCurrency,
  FormatLocalDate,
  FormatLocalDateTime,
  FormatLocalTime,
} from "../utils/Intl";

export const printTitle = (printer, title) => {
  printer
    .align("ct")
    .style("normal")
    .size(0, 0)
    .text("─".repeat(45))
    .size(1, 0)
    .style("b");
  (Array.isArray(title) ? title : [title]).forEach((t) => printer.text(t));
  printer.style("normal").size(0, 0).text("─".repeat(45));
};

export const printFailure = (printer, data) => {
  if (data.OverTolerance) {
    printer
      .feed(1)
      .style("b")
      .size(0, 1)
      .align("ct")
      .text("FALLO - SOBRANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer
        .text("Tolerancia: " + FormatLocalCurrency(data.Tolerance))
        .feed(1);
    }
  }
  if (data.UnderTolerance) {
    printer
      .feed(1)
      .style("b")
      .size(0, 1)
      .align("ct")
      .text("FALLO - FALTANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer
        .text("Tolerancia: " + FormatLocalCurrency(data.Tolerance))
        .feed(1);
    }
  }
};

export const printSignature = (printer, name, title) => {
  printer
    .align("ct")
    .style("normal")
    .size(0, 0)
    .feed(7)
    .text("-".repeat(30))
    .size(1, 0)
    .style("b")
    .text(name)
    .style("normal")
    .size(0, 0)
    .text(title)
    .size(0, 0);
};

export const printFailureBySupervisor = (printer, data) => {
  console.log(data, "data");
  if (data.OverToleranceBySupervisor) {
    printer
      .feed(1)
      .style("b")
      .size(0, 1)
      .align("ct")
      .text("FALLO - SOBRANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer
        .text("Tolerancia: " + FormatLocalCurrency(data.Tolerance))
        .feed(1);
    }
  }
  if (data.UnderToleranceBySupervisor) {
    printer
      .feed(1)
      .style("b")
      .size(0, 1)
      .align("ct")
      .text("FALLO - FALTANTE")
      .style("normal")
      .size(0, 0);
    if (data.Tolerance !== 0) {
      printer
        .text("Tolerancia: " + FormatLocalCurrency(data.Tolerance))
        .feed(1);
    }
  }
};

export const printDescValue = (
  printer,
  description,
  value,
  style = "normal",
  width = 48,
  sign = false
) => {
  console.log(value, "value");
  let val;
  if (!sign) {
    val =
      FormatLocalCurrency(Math.abs(value)) + (value < 0 ? " ".repeat(15) : "");
  } else {
    val = FormatLocalCurrency(value);
  }
  const w = width - (description.length + val.length);
  printer
    .style(style)
    .align("lt")
    .text(
      (w < 1 ? description.substring(0, w - 1) : description) +
        (w > 0 ? " ".repeat(w) : "") +
        val
    );
};

export const print = (data, qr, url) => (printer) =>
  new Promise((resolve) => {
    console.log(data);
    printFailure(printer, data);

    printTitle(printer, [
      "Arqueo de Caja",
      "",
      data.RegisteredBy.FullName,
      data.Qty + "° del " + FormatLocalDate(new Date(data.WorkingDate)),
      FormatLocalDateTime(new Date(data.CreatedAt)),
    ]);

    printTitle(printer, "Estado actual");

    printer
      .align("lt")
      .style("b")
      .text(
        `${" Denomin. x Cantidad".padEnd(20, " ")}${" ".repeat(
          6
        )}${"SubTotal".padStart(20, " ")}`
      )
      .style("normal");

    Object.keys(data.Bills)
      .sort((a, b) => b - a)
      .forEach((denom) =>
        printer.text(
          `${`$ ${String(denom).padStart(7, " ")} x ${String(
            data.Bills[denom]
          ).padStart(8, " ")}`}${" ".repeat(6)}${FormatLocalCurrency(
            denom * data.Bills[denom]
          ).padStart(20, " ")}`
        )
      );

    printTitle(printer, "Movimientos");
    printer.text("Descripción               Haber         Debe");
    data.RegisterHistory.forEach((ch) => {
      printDescValue(
        printer,
        `Arqueo ${FormatLocalTime(ch.RegisteredAt)}`,
        ch.Balance
      );
    });

    data.TreasureToCashierHistory.forEach((ch) =>
      printDescValue(
        printer,
        `${ch.Description} por ${ch.Treasurer.FullName}`,
        ch.Amount
      )
    );

    printDescValue(printer, "TOTAL PAGADOS", -data.TotalPaidTickets);
    printDescValue(printer, "TOTAL EMITIDOS", data.TotalIssuedTickets);

    printTitle(printer, "Resumen");
    printDescValue(printer, "Entradas", data.TotalIn);
    printDescValue(printer, "Salidas", -data.TotalOut);
    printDescValue(printer, "En caja", -data.TotalBills);

    printTitle(printer, "BALANCE");
    if (data?.FailedBalance?.BalanceBySupervisor) {
      printDescValue(
        printer,
        "SUPERVISOR",
        data.FailedBalance.BalanceBySupervisor,
        "b",
        24,
        true
      );
      printFailureBySupervisor(printer, data);
    } else {
      printDescValue(printer, "CAJERO", data.Balance, "b", 24, true);
      printFailure(printer, data);
    }

    printer.align("lt").style("b").size(1, 0).text("-".repeat(24));

    printer.size(0, 0).raster(qr).align("ct").text(url);

    printSignature(printer, data.RegisteredBy.FullName, "Cajero");
    if (data.Authorizing) {
      printSignature(printer, data.Authorizing.FullName, data.Authorizing.Role);
    }

    data?.FailedBalance?.BalanceBySupervisor
      ? printFailureBySupervisor(printer, data)
      : printFailure(printer, data);

    resolve();
  });
