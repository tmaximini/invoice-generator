import { localePresets } from "../lib/defaults";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";
const labelCls =
  "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1";

export default function PartyFields({ partyKey, inv, set }) {
  const L = localePresets[inv.locale].labels;
  const title = partyKey === "from" ? L.from : L.to;
  const data = inv[partyKey];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
        {title}
      </h2>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>{L.nameCompany}</label>
          <input
            className={inputCls}
            placeholder="Acme Corp"
            value={data.name}
            onChange={(e) => set(`${partyKey}.name`, e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>{L.email}</label>
          <input
            className={inputCls}
            placeholder="hello@acme.com"
            value={data.email}
            onChange={(e) => set(`${partyKey}.email`, e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>{L.address}</label>
          <textarea
            className={inputCls + " resize-y min-h-[4.5rem]"}
            rows={3}
            placeholder="123 Main St, City"
            value={data.address}
            onChange={(e) => set(`${partyKey}.address`, e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>{L.taxId}</label>
          <input
            className={inputCls}
            placeholder="DE123456789"
            value={data.taxId}
            onChange={(e) => set(`${partyKey}.taxId`, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
