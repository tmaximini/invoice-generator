import { localePresets } from "../lib/defaults";
import { formatCurrency } from "../lib/format";

export default function SummaryCard({ inv, subtotal, discountAmt, taxAmt, total }) {
  const L = localePresets[inv.locale].labels;
  const fmt = (n) => formatCurrency(n, inv.locale, inv.currency);

  return (
    <div
      className="rounded-2xl p-6 shadow-sm border border-gray-100"
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
    >
      <h2 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
        {L.summary}
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{L.subtotal}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(subtotal)}</span>
        </div>
        {inv.discount > 0 && (
          <div className="flex justify-between text-sm text-red-300">
            <span>
              {L.discount} ({inv.discount}%)
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              -{fmt(discountAmt)}
            </span>
          </div>
        )}
        {inv.taxRate > 0 && (
          <div className="flex justify-between text-sm text-gray-400">
            <span>
              {inv.taxLabel} ({inv.taxRate}%)
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(taxAmt)}</span>
          </div>
        )}
        <div className="border-t border-gray-600 pt-3 mt-3 flex justify-between items-center">
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            {L.total}
          </span>
          <span
            className="text-2xl font-bold text-amber-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {fmt(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
