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

  return { templates, saveTemplate: save, removeTemplate: remove };
}
