import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generatePdf(elementId, invoiceNumber) {
  const el = document.getElementById(elementId);
  if (!el) return;

  await document.fonts.ready;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgWidth = 210; // A4 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pdf = new jsPDF("p", "mm", "a4");

  // If content exceeds one page, scale to fit
  const pageHeight = 297;
  if (imgHeight > pageHeight) {
    const ratio = pageHeight / imgHeight;
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      imgWidth * ratio,
      pageHeight
    );
  } else {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
  }

  pdf.save(`invoice-${invoiceNumber}.pdf`);
}
