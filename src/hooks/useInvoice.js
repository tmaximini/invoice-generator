import { useState, useEffect, useRef, useCallback } from "react";
import { createDefaultInvoice, localePresets } from "../lib/defaults";
import { loadCurrent, saveCurrent } from "../lib/storage";

export function useInvoice() {
  const [inv, setInv] = useState(() => {
    const saved = loadCurrent();
    return saved || createDefaultInvoice("de");
  });

  const timerRef = useRef(null);

  // Debounced auto-save
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveCurrent(inv), 500);
    return () => clearTimeout(timerRef.current);
  }, [inv]);

  const set = useCallback((path, val) => {
    setInv((prev) => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = val;
      return copy;
    });
  }, []);

  const addItem = useCallback(() => {
    setInv((p) => {
      const preset = localePresets[p.locale];
      return {
        ...p,
        items: [
          ...p.items,
          { id: Date.now(), description: "", qty: null, unit: preset.units[0], rate: 0 },
        ],
      };
    });
  }, []);

  const removeItem = useCallback((id) => {
    setInv((p) => ({
      ...p,
      items: p.items.length > 1 ? p.items.filter((i) => i.id !== id) : p.items,
    }));
  }, []);

  const updateItem = useCallback((id, field, val) => {
    setInv((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    }));
  }, []);

  const applyLocale = useCallback((localeKey) => {
    const preset = localePresets[localeKey];
    if (!preset) return;
    setInv((p) => ({
      ...p,
      locale: localeKey,
      currency: preset.currency,
      currencySymbol: preset.currencySymbol,
      taxRate: preset.taxRate,
      taxLabel: preset.taxLabel,
      invoiceTitle: preset.invoiceTitle,
      reverseChargeNote: preset.defaultReverseChargeNote,
      items: p.items.map((item) => ({
        ...item,
        unit: preset.units.includes(item.unit) ? item.unit : preset.units[0],
      })),
    }));
  }, []);

  const resetInvoice = useCallback(() => {
    setInv(createDefaultInvoice("de"));
  }, []);

  const loadFromTemplate = useCallback((template) => {
    setInv((p) => ({
      ...p,
      from: template.from || p.from,
      bankDetails: template.bankDetails || p.bankDetails,
      taxRate: template.taxRate ?? p.taxRate,
      taxLabel: template.taxLabel || p.taxLabel,
      currency: template.currency || p.currency,
      currencySymbol: template.currencySymbol || p.currencySymbol,
      locale: template.locale || p.locale,
      notes: template.notes || p.notes,
      logo: template.logo || p.logo,
      invoiceTitle: template.invoiceTitle || p.invoiceTitle,
      showReverseCharge: template.showReverseCharge ?? p.showReverseCharge,
      reverseChargeNote: template.reverseChargeNote || p.reverseChargeNote,
      footerNote: template.footerNote ?? p.footerNote,
    }));
  }, []);

  // Computed values — treat null/empty qty as 1
  const subtotal = inv.items.reduce((s, i) => s + (i.qty || 1) * i.rate, 0);
  const discountAmt = (subtotal * inv.discount) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = (taxable * inv.taxRate) / 100;
  const total = taxable + taxAmt;

  return {
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
  };
}
