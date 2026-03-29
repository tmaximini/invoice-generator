import { localePresets } from "../lib/defaults";
import PartyFields from "./PartyFields";
import BankDetails from "./BankDetails";
import LineItems from "./LineItems";
import SettingsPanel from "./SettingsPanel";
import SummaryCard from "./SummaryCard";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";
const labelCls =
  "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1";

export default function InvoiceForm({
  inv,
  set,
  addItem,
  removeItem,
  updateItem,
  applyLocale,
  subtotal,
  discountAmt,
  taxAmt,
  total,
  logoPreview,
  setLogoPreview,
  onPreview,
}) {
  const L = localePresets[inv.locale].labels;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Invoice meta */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            {L.invoiceDetails}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>{L.invoiceNumber}</label>
              <input
                className={inputCls}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                value={inv.invoiceNumber}
                onChange={(e) => set("invoiceNumber", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{L.issueDate}</label>
              <input
                className={inputCls}
                type="date"
                value={inv.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{L.dueDate}</label>
              <input
                className={inputCls}
                type="date"
                value={inv.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-5">
          <PartyFields partyKey="from" inv={inv} set={set} />
          <PartyFields partyKey="to" inv={inv} set={set} />
        </div>

        {/* Bank Details */}
        <BankDetails inv={inv} set={set} />

        {/* Line Items */}
        <LineItems
          inv={inv}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
        />

        {/* Notes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            {L.notes}
          </h2>
          <textarea
            className={inputCls + " resize-none"}
            rows={3}
            placeholder={L.notes + "..."}
            value={inv.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
          {inv.showReverseCharge && (
            <div className="mt-3">
              <label className={labelCls}>{L.reverseCharge}</label>
              <input
                className={inputCls}
                value={inv.reverseChargeNote}
                onChange={(e) => set("reverseChargeNote", e.target.value)}
              />
            </div>
          )}
          <div className="mt-3">
            <label className={labelCls}>Footer</label>
            <input
              className={inputCls}
              placeholder={L.thankYou}
              value={inv.footerNote}
              onChange={(e) => set("footerNote", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        <SettingsPanel
          inv={inv}
          set={set}
          applyLocale={applyLocale}
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
        />

        <SummaryCard
          inv={inv}
          subtotal={subtotal}
          discountAmt={discountAmt}
          taxAmt={taxAmt}
          total={total}
        />

        <button
          onClick={onPreview}
          className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
          style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
        >
          {L.preview} →
        </button>
      </div>
    </div>
  );
}
