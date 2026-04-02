const today = new Date().toISOString().split("T")[0];
const in30 = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

const deLabels = {
  from: "Von",
  to: "An",
  invoiceNumber: "Rechnungsnr.",
  issueDate: "Rechnungsdatum",
  dueDate: "Fälligkeitsdatum",
  description: "Beschreibung",
  qty: "Menge",
  unit: "Einheit",
  rate: "Einzelpreis",
  amount: "Betrag",
  subtotal: "Zwischensumme",
  discount: "Rabatt",
  tax: "USt.",
  total: "Gesamt",
  notes: "Anmerkungen",
  bankDetails: "Bankverbindung",
  bankName: "Bank",
  iban: "IBAN",
  bic: "BIC",
  accountHolder: "Kontoinhaber",
  taxId: "USt-IdNr.",
  reverseCharge: "Hinweis",
  issued: "Datum",
  due: "Fällig",
  nameCompany: "Name / Firma",
  email: "E-Mail",
  address: "Adresse",
  settings: "Einstellungen",
  logo: "Logo",
  lineItems: "Positionen",
  summary: "Zusammenfassung",
  preview: "Vorschau",
  edit: "Bearbeiten",
  downloadPdf: "PDF herunterladen",
  addLineItem: "+ Position hinzufügen",
  clickToUpload: "Klicken zum Hochladen",
  removeLogo: "Logo entfernen",
  thankYou: "Vielen Dank für Ihr Vertrauen",
  currency: "Währung",
  taxRate: "Steuersatz (%)",
  discountRate: "Rabatt (%)",
  locale: "Region",
  invoiceDetails: "Rechnungsdetails",
};

const enLabels = {
  from: "From",
  to: "To",
  invoiceNumber: "Invoice #",
  issueDate: "Issue Date",
  dueDate: "Due Date",
  description: "Description",
  qty: "Qty",
  unit: "Unit",
  rate: "Rate",
  amount: "Amount",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  total: "Total",
  notes: "Notes",
  bankDetails: "Bank Details",
  bankName: "Bank",
  iban: "IBAN",
  bic: "BIC / SWIFT",
  accountHolder: "Account Holder",
  taxId: "Tax ID",
  reverseCharge: "Notice",
  issued: "Issued",
  due: "Due",
  nameCompany: "Name / Company",
  email: "Email",
  address: "Address",
  settings: "Settings",
  logo: "Logo",
  lineItems: "Line Items",
  summary: "Summary",
  preview: "Preview",
  edit: "Edit",
  downloadPdf: "Download PDF",
  addLineItem: "+ Add Line Item",
  clickToUpload: "Click to upload",
  removeLogo: "Remove logo",
  thankYou: "Thank you for your business",
  currency: "Currency",
  taxRate: "Tax Rate (%)",
  discountRate: "Discount (%)",
  locale: "Region",
  invoiceDetails: "Invoice Details",
};

const esLabels = {
  from: "De",
  to: "Para",
  invoiceNumber: "Nº Factura",
  issueDate: "Fecha de emisión",
  dueDate: "Fecha de vencimiento",
  description: "Descripción",
  qty: "Cant.",
  unit: "Unidad",
  rate: "Precio",
  amount: "Importe",
  subtotal: "Subtotal",
  discount: "Descuento",
  tax: "IVA",
  total: "Total",
  notes: "Notas",
  bankDetails: "Datos bancarios",
  bankName: "Banco",
  iban: "IBAN",
  bic: "BIC",
  accountHolder: "Titular",
  taxId: "NIF / CIF",
  reverseCharge: "Aviso",
  issued: "Emitida",
  due: "Vence",
  nameCompany: "Nombre / Empresa",
  email: "Correo",
  address: "Dirección",
  settings: "Ajustes",
  logo: "Logo",
  lineItems: "Líneas",
  summary: "Resumen",
  preview: "Vista previa",
  edit: "Editar",
  downloadPdf: "Descargar PDF",
  addLineItem: "+ Añadir línea",
  clickToUpload: "Clic para subir",
  removeLogo: "Eliminar logo",
  thankYou: "Gracias por su confianza",
  currency: "Moneda",
  taxRate: "Tipo impositivo (%)",
  discountRate: "Descuento (%)",
  locale: "Región",
  invoiceDetails: "Datos de factura",
};

export const localePresets = {
  de: {
    label: "Deutschland",
    currency: "EUR",
    currencySymbol: "€",
    taxRate: 19,
    taxLabel: "USt.",
    invoiceTitle: "Rechnung",
    invoicePrefix: "RE-",
    locale: "de-DE",
    taxPresets: [
      { label: "19%", value: 19 },
      { label: "7%", value: 7 },
      { label: "0%", value: 0 },
    ],
    units: ["Std.", "Stk.", "pausch.", "Tag(e)", "km", "m²"],
    labels: deLabels,
    defaultReverseChargeNote:
      "Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge, §13b UStG)",
  },
  en: {
    label: "United States",
    currency: "USD",
    currencySymbol: "$",
    taxRate: 0,
    taxLabel: "Tax",
    invoiceTitle: "Invoice",
    invoicePrefix: "INV-",
    locale: "en-US",
    taxPresets: [
      { label: "0%", value: 0 },
      { label: "8%", value: 8 },
      { label: "10%", value: 10 },
    ],
    units: ["hrs", "pcs", "flat", "day(s)", "mi", "sq ft"],
    labels: enLabels,
    defaultReverseChargeNote: "Reverse charge: VAT to be accounted for by the recipient",
  },
  es: {
    label: "España",
    currency: "EUR",
    currencySymbol: "€",
    taxRate: 21,
    taxLabel: "IVA",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-ES",
    taxPresets: [
      { label: "21%", value: 21 },
      { label: "10%", value: 10 },
      { label: "4%", value: 4 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "uds.", "global", "día(s)", "km", "m²"],
    labels: esLabels,
    defaultReverseChargeNote:
      "Inversión del sujeto pasivo (Reverse Charge)",
  },
  mx: {
    label: "México",
    currency: "MXN",
    currencySymbol: "$",
    taxRate: 16,
    taxLabel: "IVA",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-MX",
    taxPresets: [
      { label: "16%", value: 16 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "pzas.", "global", "día(s)", "km", "m²"],
    labels: { ...esLabels, taxId: "RFC", thankYou: "Gracias por su preferencia" },
    defaultReverseChargeNote: "",
  },
  ar: {
    label: "Argentina",
    currency: "ARS",
    currencySymbol: "$",
    taxRate: 21,
    taxLabel: "IVA",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-AR",
    taxPresets: [
      { label: "21%", value: 21 },
      { label: "10.5%", value: 10.5 },
      { label: "27%", value: 27 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "uds.", "global", "día(s)", "km", "m²"],
    labels: { ...esLabels, taxId: "CUIT", thankYou: "Gracias por su confianza" },
    defaultReverseChargeNote: "",
  },
  co: {
    label: "Colombia",
    currency: "COP",
    currencySymbol: "$",
    taxRate: 19,
    taxLabel: "IVA",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-CO",
    taxPresets: [
      { label: "19%", value: 19 },
      { label: "5%", value: 5 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "uds.", "global", "día(s)", "km", "m²"],
    labels: { ...esLabels, taxId: "NIT", thankYou: "Gracias por su confianza" },
    defaultReverseChargeNote: "",
  },
  cl: {
    label: "Chile",
    currency: "CLP",
    currencySymbol: "$",
    taxRate: 19,
    taxLabel: "IVA",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-CL",
    taxPresets: [
      { label: "19%", value: 19 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "uds.", "global", "día(s)", "km", "m²"],
    labels: { ...esLabels, taxId: "RUT", thankYou: "Gracias por su preferencia" },
    defaultReverseChargeNote: "",
  },
  pe: {
    label: "Perú",
    currency: "PEN",
    currencySymbol: "S/",
    taxRate: 18,
    taxLabel: "IGV",
    invoiceTitle: "Factura",
    invoicePrefix: "FAC-",
    locale: "es-PE",
    taxPresets: [
      { label: "18%", value: 18 },
      { label: "0%", value: 0 },
    ],
    units: ["hrs", "uds.", "global", "día(s)", "km", "m²"],
    labels: { ...esLabels, tax: "IGV", taxId: "RUC", thankYou: "Gracias por su confianza" },
    defaultReverseChargeNote: "",
  },
};

export const currencies = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "MXN", symbol: "MX$" },
  { code: "ARS", symbol: "AR$" },
  { code: "COP", symbol: "CO$" },
  { code: "CLP", symbol: "CL$" },
  { code: "PEN", symbol: "S/" },
  { code: "GBP", symbol: "£" },
  { code: "CHF", symbol: "CHF" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
];

// Detect best locale from browser languages + timezone
export function detectLocale() {
  const langs = navigator.languages || [navigator.language || "es"];

  const regionMap = {
    "es-MX": "mx", "es-AR": "ar", "es-CO": "co", "es-CL": "cl",
    "es-PE": "pe", "es-ES": "es", "de-DE": "de", "de-AT": "de",
    "de-CH": "de", "en-US": "en", "en-GB": "en",
  };

  // Check all preferred languages for a direct match
  for (const lang of langs) {
    if (regionMap[lang]) return regionMap[lang];
  }
  // Check prefixes across all languages
  for (const lang of langs) {
    const prefix = lang.split("-")[0];
    if (prefix === "es") return "es";
    if (prefix === "de") return "de";
  }

  // Timezone fallback — catches English-browser users by location
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const tzMap = {
    "Europe/Madrid": "es", "Europe/Barcelona": "es", "Atlantic/Canary": "es",
    "Europe/Berlin": "de", "Europe/Vienna": "de", "Europe/Zurich": "de",
    "America/Mexico_City": "mx", "America/Cancun": "mx", "America/Monterrey": "mx",
    "America/Buenos_Aires": "ar", "America/Argentina/Buenos_Aires": "ar",
    "America/Bogota": "co",
    "America/Santiago": "cl",
    "America/Lima": "pe",
  };
  if (tzMap[tz]) return tzMap[tz];

  // If primary language is English but timezone is not US, default to Spain
  // (generar-factura.com audience is primarily Spanish-speaking)
  const primary = langs[0]?.split("-")[0];
  if (primary === "en") return "es";

  return "es";
}

export function createDefaultInvoice(localeKey) {
  const key = localeKey || detectLocale();
  const preset = localePresets[key];
  return {
    locale: key,
    invoiceNumber: `${preset.invoicePrefix}001`,
    invoiceTitle: preset.invoiceTitle,
    issueDate: today,
    dueDate: in30,
    from: { name: "", email: "", address: "", taxId: "" },
    to: { name: "", email: "", address: "", taxId: "" },
    bankDetails: { bankName: "", iban: "", bic: "", accountHolder: "" },
    items: [{ id: 1, description: "", qty: null, unit: preset.units[0], rate: 0 }],
    taxRate: preset.taxRate,
    taxLabel: preset.taxLabel,
    discount: 0,
    currency: preset.currency,
    currencySymbol: preset.currencySymbol,
    notes: "",
    logo: null,
    showReverseCharge: false,
    reverseChargeNote: preset.defaultReverseChargeNote,
    footerNote: preset.labels.thankYou,
  };
}
