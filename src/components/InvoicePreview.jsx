import { localePresets } from "../lib/defaults";
import { formatCurrency, formatDate } from "../lib/format";

export default function InvoicePreview({
  inv,
  logoPreview,
  subtotal,
  discountAmt,
  taxAmt,
  total,
}) {
  const L = localePresets[inv.locale].labels;
  const fmt = (n) => formatCurrency(n, inv.locale, inv.currency);
  const fmtDate = (d) => formatDate(d, inv.locale);

  const hasBankDetails =
    inv.bankDetails.iban || inv.bankDetails.accountHolder;

  return (
    <div className="flex justify-center">
      <div
        id="invoice-preview"
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: 794,
        }}
      >
        <div className="p-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo"
                  style={{ height: 48, marginBottom: 12, objectFit: "contain" }}
                />
              )}
              <h2
                className="text-3xl font-bold text-gray-800"
                style={{ letterSpacing: "-0.03em" }}
              >
                {inv.invoiceTitle}
              </h2>
              <p
                className="text-sm text-gray-400 mt-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {inv.invoiceNumber}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 space-y-1">
              <div>
                <span className="text-gray-400">{L.issued}:</span> {fmtDate(inv.issueDate)}
              </div>
              <div>
                <span className="text-gray-400">{L.due}:</span>{" "}
                <span className="font-medium text-gray-700">{fmtDate(inv.dueDate)}</span>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-10 mb-10 pb-8 border-b border-gray-100">
            {[
              [L.from, inv.from],
              [L.to, inv.to],
            ].map(([label, data]) => (
              <div key={label}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {label}
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {data.name || "—"}
                </p>
                {data.email && (
                  <p className="text-sm text-gray-500">{data.email}</p>
                )}
                {data.address && (
                  <p className="text-sm text-gray-500 whitespace-pre-line mt-1">
                    {data.address}
                  </p>
                )}
                {data.taxId && (
                  <p
                    className="text-xs text-gray-400 mt-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {L.taxId}: {data.taxId}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Items table */}
          {(() => {
            const hasQty = inv.items.some((i) => i.qty != null);
            return (
              <table className="w-full mb-8" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <td className="pb-3 pr-4">{L.description}</td>
                    {hasQty && (
                      <>
                        <td className="pb-3 pr-4 text-right" style={{ width: 50 }}>{L.qty}</td>
                        <td className="pb-3 pr-4 text-center" style={{ width: 60 }}>{L.unit}</td>
                        <td className="pb-3 pr-4 text-right" style={{ width: 100 }}>{L.rate}</td>
                      </>
                    )}
                    <td className="pb-3 text-right" style={{ width: 110 }}>{L.amount}</td>
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-50">
                      <td className="py-3 pr-4 text-sm text-gray-700">
                        {item.description || "—"}
                      </td>
                      {hasQty && (
                        <>
                          <td className="py-3 pr-4 text-sm text-gray-500 text-right">
                            {item.qty ?? ""}
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-500 text-center">
                            {item.qty != null ? item.unit : ""}
                          </td>
                          <td
                            className="py-3 pr-4 text-sm text-gray-500 text-right"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {item.qty != null ? fmt(item.rate) : ""}
                          </td>
                        </>
                      )}
                      <td
                        className="py-3 text-sm font-medium text-gray-800 text-right"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {fmt((item.qty || 1) * item.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{L.subtotal}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmt(subtotal)}
                </span>
              </div>
              {inv.discount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>
                    {L.discount} ({inv.discount}%)
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    -{fmt(discountAmt)}
                  </span>
                </div>
              )}
              {inv.showReverseCharge ? (
                <div className="text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>{inv.taxLabel} (0%)</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {fmt(0)}
                    </span>
                  </div>
                  {inv.reverseChargeNote && (
                    <p className="text-xs text-gray-400 mt-1">{inv.reverseChargeNote}</p>
                  )}
                </div>
              ) : inv.taxRate > 0 ? (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {inv.taxLabel} ({inv.taxRate}%)
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmt(taxAmt)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-800">
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  {L.total}
                </span>
                <span
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {fmt(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {hasBankDetails && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {L.bankDetails}
              </p>
              <div className="text-sm text-gray-500 space-y-0.5">
                {inv.bankDetails.accountHolder && (
                  <p>
                    {L.accountHolder}: {inv.bankDetails.accountHolder}
                  </p>
                )}
                {inv.bankDetails.iban && (
                  <p style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {L.iban}: {inv.bankDetails.iban}
                  </p>
                )}
                {inv.bankDetails.bic && (
                  <p style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {L.bic}: {inv.bankDetails.bic}
                  </p>
                )}
                {inv.bankDetails.bankName && (
                  <p>
                    {L.bankName}: {inv.bankDetails.bankName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {inv.notes && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {L.notes}
              </p>
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {inv.notes}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        {inv.footerNote && (
          <div
            className="px-10 py-4 rounded-b-2xl text-center text-xs text-gray-400"
            style={{ background: "#fafaf8" }}
          >
            {inv.footerNote}
          </div>
        )}
      </div>
    </div>
  );
}
