const faqData = {
  es: [
    {
      q: "¿Cómo generar una factura gratis en PDF?",
      a: "Selecciona tu país, rellena los datos del emisor y receptor, añade los productos o servicios con sus precios, y pulsa \"Descargar PDF\". No necesitas registro ni cuenta.",
    },
    {
      q: "¿Qué países y tipos de IVA soporta?",
      a: "España (IVA 21%, 10%, 4%), México (IVA 16%), Argentina (IVA 21%, 10.5%, 27%), Colombia (IVA 19%, 5%), Chile (IVA 19%), Perú (IGV 18%), Alemania (USt. 19%, 7%) y Estados Unidos.",
    },
    {
      q: "¿Se guardan mis datos?",
      a: "No. Todo se procesa en tu navegador. Ningún dato se envía a servidores externos. Tu información permanece completamente privada.",
    },
    {
      q: "¿Puedo añadir mi logo a la factura?",
      a: "Sí. Sube cualquier imagen (PNG, JPG, SVG) y aparecerá en la esquina de tu factura.",
    },
    {
      q: "¿Qué es Reverse Charge o inversión del sujeto pasivo?",
      a: "Es un mecanismo fiscal de la UE donde el receptor de la factura declara el IVA en lugar del emisor. Se usa en facturas intracomunitarias entre empresas (B2B).",
    },
    {
      q: "¿Es legal esta factura?",
      a: "Esta herramienta genera documentos PDF con formato profesional. Para facturas con validez fiscal oficial (como CFDI en México o facturación electrónica), consulta los requisitos de tu autoridad tributaria local.",
    },
  ],
  de: [
    {
      q: "Wie erstelle ich eine kostenlose Rechnung als PDF?",
      a: "Wählen Sie Ihr Land, füllen Sie die Daten von Absender und Empfänger aus, fügen Sie Positionen mit Preisen hinzu und klicken Sie auf \"PDF herunterladen\". Keine Registrierung nötig.",
    },
    {
      q: "Welche Steuersätze werden unterstützt?",
      a: "Deutschland (USt. 19%, 7%), Spanien (IVA 21%, 10%, 4%), Mexiko (16%), Argentinien (21%, 10,5%, 27%), Kolumbien (19%, 5%), Chile (19%), Peru (IGV 18%) und USA.",
    },
    {
      q: "Werden meine Daten gespeichert?",
      a: "Nein. Alles wird lokal in Ihrem Browser verarbeitet. Es werden keine Daten an externe Server gesendet.",
    },
    {
      q: "Was ist Reverse Charge?",
      a: "Die Steuerschuldnerschaft des Leistungsempfängers gemäß §13b UStG. Der Empfänger der Rechnung ist für die Abführung der USt. verantwortlich. Wird bei innergemeinschaftlichen B2B-Leistungen verwendet.",
    },
    {
      q: "Kann ich mein Logo hinzufügen?",
      a: "Ja. Laden Sie ein Bild (PNG, JPG, SVG) hoch und es erscheint auf Ihrer Rechnung.",
    },
  ],
  en: [
    {
      q: "How do I create a free invoice PDF?",
      a: "Select your country, fill in sender and recipient details, add line items with prices, and click \"Download PDF\". No sign-up required.",
    },
    {
      q: "Which countries and tax rates are supported?",
      a: "Spain (VAT 21%, 10%, 4%), Mexico (16%), Argentina (21%, 10.5%, 27%), Colombia (19%, 5%), Chile (19%), Peru (IGV 18%), Germany (USt. 19%, 7%), and the United States.",
    },
    {
      q: "Is my data stored anywhere?",
      a: "No. Everything is processed in your browser. No data is sent to external servers. Your information stays completely private.",
    },
    {
      q: "Can I add my logo to the invoice?",
      a: "Yes. Upload any image (PNG, JPG, SVG) and it will appear on your invoice.",
    },
    {
      q: "What is Reverse Charge?",
      a: "An EU tax mechanism where the invoice recipient is responsible for reporting VAT instead of the supplier. Used for intra-community B2B transactions.",
    },
  ],
};

function getLang(locale) {
  if (locale === "de") return "de";
  if (locale === "en") return "en";
  return "es";
}

const titles = {
  es: "Preguntas frecuentes",
  de: "Häufige Fragen",
  en: "FAQ",
};

export default function FaqSection({ locale }) {
  const lang = getLang(locale);
  const items = faqData[lang];

  return (
    <section className="max-w-6xl mx-auto px-6 pb-10">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {titles[lang]}
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <details
            key={i}
            className="group bg-white/60 border border-gray-200 rounded-lg"
          >
            <summary className="cursor-pointer px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors select-none flex items-center justify-between">
              {item.q}
              <span className="text-gray-300 group-open:rotate-45 transition-transform text-lg leading-none ml-3">+</span>
            </summary>
            <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
