import type { jsPDF } from "jspdf";
import {
  MARGIN_LEFT,
  RIGHT_COLUMN_X,
  FONT_FAMILY,
  FONT_SIZE_TITLE,
  FONT_SIZE_NORMAL,
  LINE_HEIGHT_NORMAL,
  SECTION_GAP,
} from "../constants";
import { formatInvoiceDate } from "../format";

const LOGO_HEIGHT_MM = 23.4;

export function renderHeader(
  doc: jsPDF,
  startY: number,
  invoiceDate: string,
  invoiceNumber: string,
  logo: string,
): number {
  let y = startY;

  doc.setFont(FONT_FAMILY, "bold");
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.text("INVOICE", MARGIN_LEFT, y);

  if (logo) {
    const img = new Image();
    img.src = logo;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const logoWidth = LOGO_HEIGHT_MM * aspectRatio;
    doc.addImage(logo, RIGHT_COLUMN_X, startY - 6, logoWidth, LOGO_HEIGHT_MM);
  }

  y += SECTION_GAP + 2;

  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.setFont(FONT_FAMILY, "bold");
  doc.text("Invoice Date", MARGIN_LEFT, y);
  doc.text("Invoice Number", MARGIN_LEFT + 40, y);
  y += LINE_HEIGHT_NORMAL;

  doc.setFont(FONT_FAMILY, "normal");
  doc.text(formatInvoiceDate(invoiceDate), MARGIN_LEFT, y);
  doc.text(invoiceNumber, MARGIN_LEFT + 40, y);
  y += SECTION_GAP;

  return y;
}
