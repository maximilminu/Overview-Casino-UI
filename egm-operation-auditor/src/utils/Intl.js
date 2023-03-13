const formatLocalCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  maximumFractionDigits: 0,
  currency: "ARG",
});
export const FormatLocalCurrency = (val) =>
  formatLocalCurrency.format(val).replace("ARG", "$").replaceAll(".", " ");

const formatLocalDateTime = new Intl.DateTimeFormat("es-AR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});
export const FormatLocalDateTime = formatLocalDateTime.format;

const formatLocalDate = new Intl.DateTimeFormat("es-AR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
export const FormatLocalDate = formatLocalDate.format;

const formatLocalTime = new Intl.DateTimeFormat("es-AR", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
});
export const FormatLocalTime = formatLocalTime.format;
