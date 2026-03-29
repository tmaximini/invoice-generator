import { useRef } from "react";
import { localePresets, currencies } from "../lib/defaults";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";
const labelCls =
  "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1";

export default function SettingsPanel({
  inv,
  set,
  applyLocale,
  logoPreview,
  setLogoPreview,
}) {
  const fileRef = useRef();
  const preset = localePresets[inv.locale];
  const L = preset.labels;

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result);
      set("logo", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCurrency = (code) => {
    const cur = currencies.find((c) => c.code === code);
    if (cur) {
      set("currency", cur.code);
      set("currencySymbol", cur.symbol);
    }
  };

  return (
    <div className="space-y-5">
      {/* Logo */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
          {L.logo}
        </h2>
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handleLogo}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-amber-300 hover:bg-amber-50 transition-all overflow-hidden"
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" className="h-full object-contain p-2" />
          ) : (
            <span className="text-sm text-gray-300">{L.clickToUpload}</span>
          )}
        </button>
        {logoPreview && (
          <button
            onClick={() => {
              setLogoPreview(null);
              set("logo", null);
            }}
            className="mt-2 text-xs text-red-400 hover:text-red-600"
          >
            {L.removeLogo}
          </button>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
          {L.settings}
        </h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>{L.locale}</label>
            <select
              className={inputCls}
              value={inv.locale}
              onChange={(e) => applyLocale(e.target.value)}
            >
              {Object.entries(localePresets).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{L.currency}</label>
            <select
              className={inputCls}
              value={inv.currency}
              onChange={(e) => handleCurrency(e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{L.taxRate}</label>
            <div className="flex gap-2 mb-2">
              {preset.taxPresets.map((tp) => (
                <button
                  key={tp.value}
                  onClick={() => set("taxRate", tp.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    inv.taxRate === tp.value
                      ? "bg-amber-100 text-amber-700 border border-amber-300"
                      : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
            <input
              className={inputCls}
              type="number"
              min="0"
              max="100"
              value={inv.taxRate}
              onChange={(e) => set("taxRate", +e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>{L.discountRate}</label>
            <input
              className={inputCls}
              type="number"
              min="0"
              max="100"
              value={inv.discount}
              onChange={(e) => set("discount", +e.target.value)}
            />
          </div>
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inv.showReverseCharge}
                onChange={(e) => set("showReverseCharge", e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reverse Charge
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
