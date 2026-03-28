import type { jsPDF } from "jspdf";
import type { BillToParty, FromParty } from "../types";
import {
  MARGIN_LEFT,
  RIGHT_COLUMN_X,
  FONT_FAMILY,
  FONT_SIZE_NORMAL,
  LINE_HEIGHT_NORMAL,
  SECTION_GAP,
} from "../constants";

export function renderParties(
  doc: jsPDF,
  startY: number,
  billTo: BillToParty,
  from: FromParty,
): number {
  doc.setFontSize(FONT_SIZE_NORMAL);
  let leftY = startY;
  let rightY = startY;

  // Both company names on the same line
  doc.setFont(FONT_FAMILY, "bold");
  doc.text(billTo.name, MARGIN_LEFT, leftY);
  doc.text(from.companyName, RIGHT_COLUMN_X, rightY);
  leftY += LINE_HEIGHT_NORMAL;
  rightY += LINE_HEIGHT_NORMAL;

  // Bill-To address (left column)
  doc.setFont(FONT_FAMILY, "normal");
  for (const line of billTo.address.lines) {
    doc.text(line, MARGIN_LEFT, leftY);
    leftY += LINE_HEIGHT_NORMAL;
  }

  // From address (right column)
  doc.setFont(FONT_FAMILY, "normal");
  for (const line of from.address.lines) {
    doc.text(line, RIGHT_COLUMN_X, rightY);
    rightY += LINE_HEIGHT_NORMAL;
  }

  // Tax numbers aligned on the same line below both addresses
  const hasBillToTax = billTo.taxNumber.length > 0;
  const hasFromTax = from.taxNumber.length > 0;
  if (hasBillToTax || hasFromTax) {
    const taxY = Math.max(leftY, rightY) + LINE_HEIGHT_NORMAL;
    doc.setFont(FONT_FAMILY, "bold");
    const labelWidth = doc.getTextWidth("Tax Number: ");

    if (hasBillToTax) {
      doc.setFont(FONT_FAMILY, "bold");
      doc.text("Tax Number: ", MARGIN_LEFT, taxY);
      doc.setFont(FONT_FAMILY, "normal");
      doc.text(billTo.taxNumber, MARGIN_LEFT + labelWidth, taxY);
    }

    if (hasFromTax) {
      doc.setFont(FONT_FAMILY, "bold");
      doc.text("Tax Number: ", RIGHT_COLUMN_X, taxY);
      doc.setFont(FONT_FAMILY, "normal");
      doc.text(from.taxNumber, RIGHT_COLUMN_X + labelWidth, taxY);
    }

    leftY = taxY + LINE_HEIGHT_NORMAL;
    rightY = leftY;
  }

  return Math.max(leftY, rightY) + SECTION_GAP;
}
