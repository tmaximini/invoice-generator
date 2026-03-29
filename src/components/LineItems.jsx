import { localePresets } from "../lib/defaults";
import { formatCurrency } from "../lib/format";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";

export default function LineItems({ inv, addItem, removeItem, updateItem }) {
  const preset = localePresets[inv.locale];
  const L = preset.labels;
  const fmt = (n) => formatCurrency(n, inv.locale, inv.currency);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
        {L.lineItems}
      </h2>
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider px-1">
          <div className="col-span-4">{L.description}</div>
          <div className="col-span-1">{L.qty}</div>
          <div className="col-span-2">{L.unit}</div>
          <div className="col-span-2">{L.rate}</div>
          <div className="col-span-2 text-right">{L.amount}</div>
          <div className="col-span-1"></div>
        </div>
        {inv.items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <input
                className={inputCls}
                placeholder={L.description}
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <input
                className={inputCls}
                type="number"
                min="0"
                placeholder="1"
                value={item.qty ?? ""}
                onChange={(e) =>
                  updateItem(item.id, "qty", e.target.value === "" ? null : +e.target.value)
                }
              />
            </div>
            <div className="col-span-2">
              <select
                className={inputCls}
                value={item.unit}
                onChange={(e) => updateItem(item.id, "unit", e.target.value)}
              >
                {preset.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", +e.target.value)}
              />
            </div>
            <div
              className="col-span-2 text-right text-sm font-medium text-gray-700"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {fmt((item.qty || 1) * item.rate)}
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all text-lg"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 font-medium hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all"
      >
        {L.addLineItem}
      </button>
    </div>
  );
}
