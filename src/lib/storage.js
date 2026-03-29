const CURRENT_KEY = "invoice-current";
const TEMPLATES_KEY = "invoice-templates";

export function loadCurrent() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrent(invoice) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(invoice));
}

export function loadTemplates() {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTemplates(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}
