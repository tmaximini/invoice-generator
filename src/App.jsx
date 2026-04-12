import { useState, useCallback } from "react";
import { useInvoice } from "./hooks/useInvoice";
import { useTemplates } from "./hooks/useTemplates";
import { localePresets } from "./lib/defaults";
import { generatePdf } from "./lib/pdf";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import TemplateManager from "./components/TemplateManager";
import FaqSection from "./components/FaqSection";

export default function App() {
  const {
    inv,
    set,
    addItem,
    removeItem,
    updateItem,
    applyLocale,
    resetInvoice,
    loadFromTemplate,
    subtotal,
    discountAmt,
    taxAmt,
    total,
  } = useInvoice();

  const { templates, saveTemplate, removeTemplate } = useTemplates();

  const [view, setView] = useState("edit");
  const [logoPreview, setLogoPreview] = useState(inv.logo || null);
  const [downloading, setDownloading] = useState(false);

  const L = localePresets[inv.locale].labels;

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      await generatePdf("invoice-preview", inv.invoiceNumber);
    } finally {
      setDownloading(false);
    }
  }, [inv.invoiceNumber]);

  const handleLoadTemplate = useCallback(
    (tpl) => {
      loadFromTemplate(tpl);
      if (tpl.logo) setLogoPreview(tpl.logo);
    },
    [loadFromTemplate]
  );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(135deg, #fafaf8 0%, #f3f1ec 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b border-gray-200"
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9Z" />
              </svg>
            </div>
            <div>
              <h1
                className="text-lg font-bold text-gray-800"
                style={{ letterSpacing: "-0.02em" }}
              >
                {inv.locale === "de" ? "Rechnungsgenerator" : inv.locale === "en" ? "Invoice Generator" : "Generador de Facturas"}
              </h1>
              <p className="text-xs text-gray-400">
                {inv.locale === "de" ? "Professionelle Rechnungen in Sekunden" : inv.locale === "en" ? "Create professional invoices in seconds" : "Crea facturas profesionales en segundos"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <TemplateManager
              templates={templates}
              onSave={(name) => saveTemplate(name, inv)}
              onLoad={handleLoadTemplate}
              onDelete={removeTemplate}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("edit")}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  view === "edit"
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {L.edit}
              </button>
              <button
                onClick={() => setView("preview")}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  view === "preview"
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {L.preview}
              </button>
              {view === "preview" && (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-4 py-2 text-sm rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
                >
                  {downloading ? "…" : `↓ ${L.downloadPdf}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {view === "edit" ? (
          <InvoiceForm
            inv={inv}
            set={set}
            addItem={addItem}
            removeItem={removeItem}
            updateItem={updateItem}
            applyLocale={applyLocale}
            subtotal={subtotal}
            discountAmt={discountAmt}
            taxAmt={taxAmt}
            total={total}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            onPreview={() => setView("preview")}
          />
        ) : (
          <InvoicePreview
            inv={inv}
            logoPreview={logoPreview}
            subtotal={subtotal}
            discountAmt={discountAmt}
            taxAmt={taxAmt}
            total={total}
          />
        )}
      </div>

      <FaqSection locale={inv.locale} />

      {/* Site footer */}
      <div className="py-6 text-center text-xs text-gray-400">
        Built with 💚 at{" "}
        <a href="https://mxmn.net" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">
          mxmn
        </a>
      </div>
    </div>
  );
}
