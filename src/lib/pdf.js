import { jsPDF } from "jspdf";
import { localePresets } from "./defaults";
import { formatCurrency, formatDate } from "./format";

// Palette (RGB) mirroring the on-screen preview
const C = {
  dark: [31, 41, 55], // gray-800
  gray700: [55, 65, 81],
  gray600: [75, 85, 99],
  gray500: [107, 114, 128],
  gray400: [156, 163, 175],
  gray300: [209, 213, 219],
  gray100: [243, 244, 246],
  red: [239, 68, 68],
  bg: [250, 250, 248],
};

const MARGIN = 16;
const PAGE_W = 210;
const PAGE_H = 297;
const RIGHT = PAGE_W - MARGIN; // 194
const BOTTOM = PAGE_H - 14;

function loadImageSize(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function generatePdf(inv, totals) {
  const { subtotal, discountAmt, taxAmt, total } = totals;
  const L = localePresets[inv.locale].labels;
  const fmt = (n) => formatCurrency(n, inv.locale, inv.currency);
  const fmtDate = (d) => formatDate(d, inv.locale);

  const doc = new jsPDF("p", "mm", "a4");
  let y = MARGIN + 4;

  const setColor = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const draw = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const fill = (c) => doc.setFillColor(c[0], c[1], c[2]);

  const ensure = (needed) => {
    if (y + needed > BOTTOM) {
      doc.addPage();
      y = MARGIN + 4;
    }
  };

  // ---- Header: logo + title (left), dates (right) ----
  const headerTop = y;
  if (inv.logo) {
    const size = await loadImageSize(inv.logo);
    if (size) {
      const h = 14;
      const w = (size.w / size.h) * h;
      const fmtImg = /image\/png/i.test(inv.logo) ? "PNG" : "JPEG";
      try {
        doc.addImage(inv.logo, fmtImg, MARGIN, y, w, h);
      } catch (_) {
        /* skip bad image */
      }
      y += h + 4;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  setColor(C.dark);
  doc.text(inv.invoiceTitle || "", MARGIN, y + 5);

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  setColor(C.gray400);
  doc.text(inv.invoiceNumber || "", MARGIN, y + 11);

  // Dates (right aligned, top of header)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  let dy = headerTop + 2;
  setColor(C.gray400);
  doc.text(`${L.issued}:`, RIGHT - 32, dy, { align: "left" });
  setColor(C.gray600);
  doc.text(fmtDate(inv.issueDate), RIGHT, dy, { align: "right" });
  dy += 5;
  setColor(C.gray400);
  doc.text(`${L.due}:`, RIGHT - 32, dy, { align: "left" });
  setColor(C.gray600);
  doc.text(fmtDate(inv.dueDate), RIGHT, dy, { align: "right" });

  y += 18;

  // ---- From / To ----
  const colW = (RIGHT - MARGIN - 10) / 2;
  const colX = [MARGIN, MARGIN + colW + 10];
  const blocks = [
    [L.from, inv.from],
    [L.to, inv.to],
  ];
  let blockBottom = y;
  blocks.forEach(([label, data], i) => {
    const x = colX[i];
    let by = y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(C.gray400);
    doc.text(label.toUpperCase(), x, by);
    by += 5;
    doc.setFontSize(10);
    setColor(C.dark);
    doc.text(data.name || "—", x, by);
    by += 5;
    doc.setFont("helvetica", "normal");
    setColor(C.gray500);
    if (data.email) {
      doc.text(data.email, x, by);
      by += 5;
    }
    if (data.address) {
      const lines = doc.splitTextToSize(data.address, colW);
      doc.text(lines, x, by);
      by += lines.length * 5;
    }
    if (data.taxId) {
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      setColor(C.gray400);
      doc.text(`${L.taxId}: ${data.taxId}`, x, by);
      by += 5;
    }
    blockBottom = Math.max(blockBottom, by);
  });
  y = blockBottom + 4;
  draw(C.gray100);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, RIGHT, y);
  y += 8;

  // ---- Items table ----
  const hasQty = inv.items.some((it) => it.qty != null);
  // Column anchors (right edges / centers)
  const cAmount = RIGHT; // right
  const cRate = 160; // right
  const cUnit = 134; // center
  const cQty = 116; // right
  const descMaxW = hasQty ? 90 : RIGHT - MARGIN - 35;

  // Header row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  setColor(C.gray400);
  doc.text(L.description.toUpperCase(), MARGIN, y);
  if (hasQty) {
    doc.text(L.qty.toUpperCase(), cQty, y, { align: "right" });
    doc.text(L.unit.toUpperCase(), cUnit, y, { align: "center" });
    doc.text(L.rate.toUpperCase(), cRate, y, { align: "right" });
  }
  doc.text(L.amount.toUpperCase(), cAmount, y, { align: "right" });
  y += 3;

  // Rows
  inv.items.forEach((item) => {
    const descLines = doc.splitTextToSize(item.description || "—", descMaxW);
    const rowH = Math.max(descLines.length * 5, 7) + 3;
    ensure(rowH + 4);

    draw(C.gray100);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, RIGHT, y);
    const ty = y + 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(C.gray700);
    doc.text(descLines, MARGIN, ty);

    if (hasQty) {
      setColor(C.gray500);
      doc.text(item.qty != null ? String(item.qty) : "", cQty, ty, {
        align: "right",
      });
      doc.text(item.qty != null ? item.unit : "", cUnit, ty, {
        align: "center",
      });
      doc.setFont("courier", "normal");
      doc.text(item.qty != null ? fmt(item.rate) : "", cRate, ty, {
        align: "right",
      });
    }
    doc.setFont("courier", "normal");
    setColor(C.dark);
    doc.text(fmt((item.qty || 1) * item.rate), cAmount, ty, { align: "right" });

    y += rowH;
  });

  // ---- Totals ----
  ensure(40);
  y += 6;
  const labelX = 130;
  const totLine = (label, value, valColor, bold) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    setColor(valColor.label);
    doc.text(label, labelX, y);
    doc.setFont("courier", bold ? "bold" : "normal");
    setColor(valColor.value);
    doc.text(value, RIGHT, y, { align: "right" });
    y += 6;
  };

  totLine(L.subtotal, fmt(subtotal), { label: C.gray500, value: C.gray500 });
  if (inv.discount > 0) {
    totLine(`${L.discount} (${inv.discount}%)`, `-${fmt(discountAmt)}`, {
      label: C.red,
      value: C.red,
    });
  }
  if (inv.showReverseCharge) {
    totLine(`${inv.taxLabel} (0%)`, fmt(0), { label: C.gray500, value: C.gray500 });
    if (inv.reverseChargeNote) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(C.gray400);
      const lines = doc.splitTextToSize(inv.reverseChargeNote, RIGHT - labelX);
      doc.text(lines, labelX, y);
      y += lines.length * 4 + 1;
    }
  } else if (inv.taxRate > 0) {
    totLine(`${inv.taxLabel} (${inv.taxRate}%)`, fmt(taxAmt), {
      label: C.gray500,
      value: C.gray500,
    });
  }

  // Total rule + amount
  y += 1;
  draw(C.dark);
  doc.setLineWidth(0.6);
  doc.line(labelX, y, RIGHT, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(C.dark);
  doc.text(L.total.toUpperCase(), labelX, y);
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  setColor(C.dark);
  doc.text(fmt(total), RIGHT, y + 1, { align: "right" });
  y += 12;

  // ---- Bank details ----
  const hasBank = inv.bankDetails.iban || inv.bankDetails.accountHolder;
  if (hasBank) {
    ensure(30);
    draw(C.gray100);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, RIGHT, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(C.gray400);
    doc.text(L.bankDetails.toUpperCase(), MARGIN, y);
    y += 5;
    doc.setFontSize(10);
    setColor(C.gray500);
    const b = inv.bankDetails;
    if (b.accountHolder) {
      doc.setFont("helvetica", "normal");
      doc.text(`${L.accountHolder}: ${b.accountHolder}`, MARGIN, y);
      y += 5;
    }
    if (b.iban) {
      doc.setFont("courier", "normal");
      doc.text(`${L.iban}: ${b.iban}`, MARGIN, y);
      y += 5;
    }
    if (b.bic) {
      doc.setFont("courier", "normal");
      doc.text(`${L.bic}: ${b.bic}`, MARGIN, y);
      y += 5;
    }
    if (b.bankName) {
      doc.setFont("helvetica", "normal");
      doc.text(b.bankName, MARGIN, y);
      y += 5;
    }
  }

  // ---- Notes ----
  if (inv.notes) {
    ensure(20);
    y += 2;
    draw(C.gray100);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, RIGHT, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    setColor(C.gray400);
    doc.text(L.notes.toUpperCase(), MARGIN, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(C.gray500);
    const lines = doc.splitTextToSize(inv.notes, RIGHT - MARGIN);
    doc.text(lines, MARGIN, y);
    y += lines.length * 5;
  }

  // ---- Footer note (centered band at page bottom) ----
  if (inv.footerNote) {
    const fy = PAGE_H - 14;
    fill(C.bg);
    doc.rect(0, fy - 7, PAGE_W, 21, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setColor(C.gray400);
    doc.text(inv.footerNote, PAGE_W / 2, fy, { align: "center" });
  }

  doc.save(`invoice-${inv.invoiceNumber}.pdf`);
}
