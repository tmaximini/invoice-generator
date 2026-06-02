import { useState, useCallback } from "react";
import { loadTemplates, saveTemplates } from "../lib/storage";

export function useTemplates() {
  const [templates, setTemplates] = useState(() => loadTemplates());

  const save = useCallback((name, invoice) => {
    const template = {
      id: Date.now(),
      name,
      from: invoice.from,
      bankDetails: invoice.bankDetails,
      taxRate: invoice.taxRate,
      taxLabel: invoice.taxLabel,
      currency: invoice.currency,
      currencySymbol: invoice.currencySymbol,
      locale: invoice.locale,
      notes: invoice.notes,
      logo: invoice.logo,
      invoiceTitle: invoice.invoiceTitle,
      showReverseCharge: invoice.showReverseCharge,
      reverseChargeNote: invoice.reverseChargeNote,
      footerNote: invoice.footerNote,
    };
    setTemplates((prev) => {
      const next = [...prev.filter((t) => t.name !== name), template];
      saveTemplates(next);
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTemplates(next);
      return next;
    });
  }, []);

  // Merge imported templates; incoming wins on name clash, ids regenerated to stay unique.
  const importTemplates = useCallback((incoming) => {
    const list = Array.isArray(incoming) ? incoming : [];
    const cleaned = list.filter((t) => t && typeof t.name === "string" && t.name.trim());
    if (cleaned.length === 0) return 0;
    setTemplates((prev) => {
      const names = new Set(cleaned.map((t) => t.name));
      const kept = prev.filter((t) => !names.has(t.name));
      const added = cleaned.map((t, i) => ({ ...t, id: Date.now() + i }));
      const next = [...kept, ...added];
      saveTemplates(next);
      return next;
    });
    return cleaned.length;
  }, []);

  return {
    templates,
    saveTemplate: save,
    removeTemplate: remove,
    importTemplates,
  };
}
