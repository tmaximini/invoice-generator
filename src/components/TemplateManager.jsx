import { useState } from "react";

export default function TemplateManager({
  templates,
  onSave,
  onLoad,
  onDelete,
}) {
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setShowSave(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Load template */}
      {templates.length > 0 && (
        <div className="flex items-center gap-1">
          <select
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
          {templates.length > 0 && (
            <select
              className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-red-400 focus:outline-none"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) onDelete(+e.target.value);
                e.target.value = "";
              }}
            >
              <option value="" disabled>
                Delete…
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Save template */}
      {showSave ? (
        <div className="flex items-center gap-1">
          <input
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all"
          >
            Save
          </button>
          <button
            onClick={() => setShowSave(false)}
            className="px-2 py-1.5 text-sm text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSave(true)}
          className="px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 hover:border-amber-300 hover:text-amber-600 transition-all"
        >
          Save as template
        </button>
      )}
    </div>
  );
}
