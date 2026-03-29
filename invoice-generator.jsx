import { useState, useRef, useCallback } from "react";

const defaultInvoice = {
  invoiceNumber: "INV-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  from: { name: "", email: "", address: "", taxId: "" },
  to: { name: "", email: "", address: "", taxId: "" },
  items: [{ id: 1, description: "", qty: 1, rate: 0 }],
  taxRate: 0,
  discount: 0,
  currency: "€",
  notes: "",
  logo: null,
};

const currencies = ["€", "$", "£", "¥", "CHF", "A$", "C$"];

export default function InvoiceGenerator() {
  const [inv, setInv] = useState(defaultInvoice);
  const [view, setView] = useState("edit"); // edit | preview
  const [logoPreview, setLogoPreview] = useState(null);
  const fileRef = useRef();

  const set = (path, val) => {
    setInv((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = val;
      return copy;
    });
  };

  const addItem = () => {
    setInv((p) => ({
      ...p,
      items: [
        ...p.items,
        { id: Date.now(), description: "", qty: 1, rate: 0 },
      ],
    }));
  };

  const removeItem = (id) => {
    setInv((p) => ({
      ...p,
      items: p.items.length > 1 ? p.items.filter((i) => i.id !== id) : p.items,
    }));
  };

  const updateItem = (id, field, val) => {
    setInv((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    }));
  };

  const subtotal = inv.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const discountAmt = (subtotal * inv.discount) / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = (taxable * inv.taxRate) / 100;
  const total = taxable + taxAmt;

  const fmt = (n) => `${inv.currency}${n.toFixed(2)}`;

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

  const printInvoice = useCallback(() => {
    const el = document.getElementById("invoice-preview");
    if (!el) return;
    const w = window.open("", "_blank", "width=800,height=1100");
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${inv.invoiceNumber}</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'DM Sans',sans-serif;padding:40px;color:#1a1a2e;background:#fff}
        @media print{body{padding:20px}button{display:none!important}}
      </style></head><body>${el.innerHTML}
      <script>setTimeout(()=>{window.print();window.close()},400)<\/script>
    </body></html>`);
    w.document.close();
  }, [inv.invoiceNumber]);

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-300";
  const labelCls = "block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1";

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "linear-gradient(135deg, #fafaf8 0%, #f3f1ec 100%)",
        minHeight: "100vh",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
            >
              IN
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800" style={{ letterSpacing: "-0.02em" }}>
                Invoice Generator
              </h1>
              <p className="text-xs text-gray-400">Create professional invoices in seconds</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("edit")}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                view === "edit"
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              ✎ Edit
            </button>
            <button
              onClick={() => setView("preview")}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                view === "preview"
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              ◉ Preview
            </button>
            {view === "preview" && (
              <button
                onClick={printInvoice}
                className="px-4 py-2 text-sm rounded-lg font-medium text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
              >
                ↓ Download PDF
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {view === "edit" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — details */}
            <div className="lg:col-span-2 space-y-5">
              {/* Invoice meta */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Invoice Details</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Invoice #</label>
                    <input
                      className={inputCls}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      value={inv.invoiceNumber}
                      onChange={(e) => set("invoiceNumber", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Issue Date</label>
                    <input className={inputCls} type="date" value={inv.issueDate} onChange={(e) => set("issueDate", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Due Date</label>
                    <input className={inputCls} type="date" value={inv.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-2 gap-5">
                {[
                  ["from", "Bill From"],
                  ["to", "Bill To"],
                ].map(([key, title]) => (
                  <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">{title}</h2>
                    <div className="space-y-3">
                      <div>
                        <label className={labelCls}>Name / Company</label>
                        <input className={inputCls} placeholder="Acme Corp" value={inv[key].name} onChange={(e) => set(`${key}.name`, e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Email</label>
                        <input className={inputCls} placeholder="hello@acme.com" value={inv[key].email} onChange={(e) => set(`${key}.email`, e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Address</label>
                        <textarea className={inputCls + " resize-none"} rows={2} placeholder="123 Main St, City" value={inv[key].address} onChange={(e) => set(`${key}.address`, e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Tax / VAT ID</label>
                        <input className={inputCls} placeholder="ES12345678A" value={inv[key].taxId} onChange={(e) => set(`${key}.taxId`, e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Line items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Line Items</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-400 uppercase tracking-wider px-1">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-1 text-right">Total</div>
                    <div className="col-span-1"></div>
                  </div>
                  {inv.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-6">
                        <input
                          className={inputCls}
                          placeholder="Web development services"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          className={inputCls}
                          type="number"
                          min="0"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, "qty", +e.target.value)}
                        />
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
                      <div className="col-span-1 text-right text-sm font-medium text-gray-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmt(item.qty * item.rate)}
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
                  + Add Line Item
                </button>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Notes</h2>
                <textarea
                  className={inputCls + " resize-none"}
                  rows={3}
                  placeholder="Payment terms, bank details, thank you message..."
                  value={inv.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </div>
            </div>

            {/* Right column — settings + summary */}
            <div className="space-y-5">
              {/* Logo */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Logo</h2>
                <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleLogo} />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-amber-300 hover:bg-amber-50 transition-all overflow-hidden"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-full object-contain p-2" />
                  ) : (
                    <span className="text-sm text-gray-300">Click to upload</span>
                  )}
                </button>
                {logoPreview && (
                  <button
                    onClick={() => { setLogoPreview(null); set("logo", null); }}
                    className="mt-2 text-xs text-red-400 hover:text-red-600"
                  >
                    Remove logo
                  </button>
                )}
              </div>

              {/* Currency & rates */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Settings</h2>
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Currency</label>
                    <select className={inputCls} value={inv.currency} onChange={(e) => set("currency", e.target.value)}>
                      {currencies.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Tax Rate (%)</label>
                    <input className={inputCls} type="number" min="0" max="100" value={inv.taxRate} onChange={(e) => set("taxRate", +e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Discount (%)</label>
                    <input className={inputCls} type="number" min="0" max="100" value={inv.discount} onChange={(e) => set("discount", +e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div
                className="rounded-2xl p-6 shadow-sm border border-gray-100"
                style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
              >
                <h2 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(subtotal)}</span>
                  </div>
                  {inv.discount > 0 && (
                    <div className="flex justify-between text-sm text-red-300">
                      <span>Discount ({inv.discount}%)</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>-{fmt(discountAmt)}</span>
                    </div>
                  )}
                  {inv.taxRate > 0 && (
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Tax ({inv.taxRate}%)</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(taxAmt)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-600 pt-3 mt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {fmt(total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView("preview")}
                className="w-full py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all"
                style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
              >
                Preview Invoice →
              </button>
            </div>
          </div>
        ) : (
          /* ========== PREVIEW ========== */
          <div className="flex justify-center">
            <div
              id="invoice-preview"
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-3xl"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <div className="p-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                  <div>
                    {logoPreview && <img src={logoPreview} alt="Logo" style={{ height: 48, marginBottom: 12, objectFit: "contain" }} />}
                    <h2 className="text-3xl font-bold text-gray-800" style={{ letterSpacing: "-0.03em" }}>
                      INVOICE
                    </h2>
                    <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {inv.invoiceNumber}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500 space-y-1">
                    <div>
                      <span className="text-gray-400">Issued:</span> {inv.issueDate}
                    </div>
                    <div>
                      <span className="text-gray-400">Due:</span>{" "}
                      <span className="font-medium text-gray-700">{inv.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* From / To */}
                <div className="grid grid-cols-2 gap-10 mb-10 pb-8 border-b border-gray-100">
                  {[
                    ["From", inv.from],
                    ["To", inv.to],
                  ].map(([label, data]) => (
                    <div key={label}>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
                      <p className="text-sm font-bold text-gray-800">{data.name || "—"}</p>
                      {data.email && <p className="text-sm text-gray-500">{data.email}</p>}
                      {data.address && (
                        <p className="text-sm text-gray-500 whitespace-pre-line mt-1">{data.address}</p>
                      )}
                      {data.taxId && (
                        <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          Tax ID: {data.taxId}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Items table */}
                <table className="w-full mb-8" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <td className="pb-3 pr-4">Description</td>
                      <td className="pb-3 pr-4 text-right" style={{ width: 60 }}>Qty</td>
                      <td className="pb-3 pr-4 text-right" style={{ width: 100 }}>Rate</td>
                      <td className="pb-3 text-right" style={{ width: 110 }}>Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.items.map((item, idx) => (
                      <tr key={item.id} className="border-t border-gray-50">
                        <td className="py-3 pr-4 text-sm text-gray-700">{item.description || "—"}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 text-right">{item.qty}</td>
                        <td className="py-3 pr-4 text-sm text-gray-500 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {fmt(item.rate)}
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-800 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {fmt(item.qty * item.rate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(subtotal)}</span>
                    </div>
                    {inv.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-500">
                        <span>Discount ({inv.discount}%)</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>-{fmt(discountAmt)}</span>
                      </div>
                    )}
                    {inv.taxRate > 0 && (
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax ({inv.taxRate}%)</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmt(taxAmt)}</span>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-800"
                    >
                      <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Total</span>
                      <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmt(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {inv.notes && (
                  <div className="mt-10 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-gray-500 whitespace-pre-line">{inv.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer bar */}
              <div
                className="px-10 py-4 rounded-b-2xl text-center text-xs text-gray-400"
                style={{ background: "#fafaf8" }}
              >
                Thank you for your business
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
