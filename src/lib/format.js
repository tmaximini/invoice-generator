import { localePresets } from "./defaults";

export function formatCurrency(amount, localeKey, currency) {
  const loc = localePresets[localeKey]?.locale || "de-DE";
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(isoDate, localeKey) {
  if (!isoDate) return "";
  const loc = localePresets[localeKey]?.locale || "de-DE";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(loc, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(y, m - 1, d));
}
