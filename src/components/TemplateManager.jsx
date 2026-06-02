import { useRef, useState } from "react";

const Chevron = () => (
  <svg
    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function TemplateManager({
  templates,
  onSave,
  onLoad,
  onDelete,
  onImport,
}) {
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState("");
  const fileInput = useRef(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setShowSave(false);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(templates, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice-templates.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const count = onImport(data);
        if (count > 0) alert(`Imported ${count} template${count === 1 ? "" : "s"}.`);
        else alert("No valid templates found in file.");
      } catch {
        alert("Could not read that file — expected a templates JSON export.");
      }
    };
    reader.readAsText(file);
  };

  const hasTemplates = templates.length > 0;

  // Shared chip styling — quiet by default, warms to amber on hover.
  const chip =
    "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium " +
    "bg-white/70 border border-gray-200 text-gray-600 transition-all duration-150 " +
    "hover:text-gray-900 hover:border-gray-300 hover:bg-white hover:shadow-sm " +
    "focus:outline-none focus:ring-2 focus:ring-amber-400/50";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Manage existing — Load + Delete share one segmented control */}
      {hasTemplates && (
        <div className="inline-flex items-center h-9 rounded-lg border border-gray-200 bg-white/70 shadow-sm overflow-hidden transition-shadow hover:shadow">
          <div className="relative">
            <select
              className="appearance-none bg-transparent h-9 pl-3 pr-8 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none"
              defaultValue=""
              onChange={(e) => {
                const tpl = templates.find((t) => t.id === +e.target.value);
                if (tpl) onLoad(tpl);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Load template…
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Chevron />
          </div>

          <div className="w-px h-5 bg-gray-200" />

          <div className="relative group" title="Delete a template">
            <select
              className="appearance-none bg-transparent h-9 pl-2.5 pr-7 text-sm font-medium text-gray-400 cursor-pointer focus:outline-none group-hover:text-red-500 transition-colors"
              defaultValue=""
              aria-label="Delete template"
              onChange={(e) => {
                if (e.target.value) onDelete(+e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                ✕
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </div>
      )}

      {/* Save template — primary action in brand amber */}
      {showSave ? (
        <div className="inline-flex items-center h-9 rounded-lg border border-amber-200 bg-amber-50/60 pl-2.5 pr-1.5 shadow-sm ring-2 ring-amber-400/30">
          <input
            className="bg-transparent w-36 text-sm text-gray-800 placeholder:text-amber-700/40 focus:outline-none"
            placeholder="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setShowSave(false);
            }}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setShowSave(false)}
            aria-label="Cancel"
            className="ml-0.5 w-7 h-7 inline-flex items-center justify-center rounded-md text-amber-700/50 hover:text-amber-700 hover:bg-amber-100 transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSave(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 shadow-sm hover:bg-amber-100 hover:border-amber-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          Save as template
        </button>
      )}

      {/* Export / Import — grouped data actions */}
      <div className="inline-flex items-center gap-2">
        {hasTemplates && (
          <button
            onClick={handleExport}
            title="Download all templates as JSON"
            className={chip}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M12 3v13M7 8l5-5 5 5" />
            </svg>
            Export
          </button>
        )}
        <button
          onClick={() => fileInput.current?.click()}
          title="Import templates from a JSON file"
          className={chip}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M12 16V3M7 11l5 5 5-5" />
          </svg>
          Import
        </button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}
