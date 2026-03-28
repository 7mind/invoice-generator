import type { jsPDF } from "jspdf";
import type { InvoiceTotals, TaxConfig } from "../types";
import {
  RIGHT_EDGE,
  FONT_FAMILY,
  FONT_SIZE_NORMAL,
  LINE_HEIGHT_NORMAL,
  SECTION_GAP,
} from "../constants";
import { formatCurrency } from "../format";

const LABEL_X = 130;

export function renderTotals(
  doc: jsPDF,
  startY: number,
  totals: InvoiceTotals,
  tax: TaxConfig,
  currency: string,
): number {
  let y = startY + SECTION_GAP;
  doc.setFontSize(FONT_SIZE_NORMAL);

  doc.setFont(FONT_FAMILY, "normal");
  doc.text("Subtotal", LABEL_X, y);
  doc.text(formatCurrency(totals.subtotal), RIGHT_EDGE, y, { align: "right" });
  y += LINE_HEIGHT_NORMAL + 1;

  doc.text(`TOTAL ${tax.label} ${tax.ratePercent}%`, LABEL_X, y);
  doc.text(formatCurrency(totals.taxAmount), RIGHT_EDGE, y, { align: "right" });
  y += LINE_HEIGHT_NORMAL + 2;

  doc.setFont(FONT_FAMILY, "bold");
  doc.text(`TOTAL ${currency}`, LABEL_X, y);
  doc.text(formatCurrency(totals.total), RIGHT_EDGE, y, { align: "right" });
  y += SECTION_GAP;

  return y;
}
