import { localePresets } from "../lib/defaults";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";
const labelCls =
  "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1";

export default function BankDetails({ inv, set }) {
  const L = localePresets[inv.locale].labels;
  const bank = inv.bankDetails;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
        {L.bankDetails}
      </h2>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>{L.accountHolder}</label>
          <input
            className={inputCls}
            placeholder="Max Mustermann"
            value={bank.accountHolder}
            onChange={(e) => set("bankDetails.accountHolder", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>{L.iban}</label>
          <input
            className={inputCls}
            placeholder="DE89 3704 0044 0532 0130 00"
            value={bank.iban}
            onChange={(e) => set("bankDetails.iban", e.target.value)}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{L.bic}</label>
            <input
              className={inputCls}
              placeholder="COBADEFFXXX"
              value={bank.bic}
              onChange={(e) => set("bankDetails.bic", e.target.value)}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <div>
            <label className={labelCls}>{L.bankName}</label>
            <input
              className={inputCls}
              placeholder="Commerzbank"
              value={bank.bankName}
              onChange={(e) => set("bankDetails.bankName", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
