import type { jsPDF } from "jspdf";
import type { BankDetails } from "../types";
import {
  MARGIN_LEFT,
  FONT_FAMILY,
  FONT_SIZE_NORMAL,
  FONT_SIZE_SMALL,
  LINE_HEIGHT_NORMAL,
  LINE_HEIGHT_SMALL,
  SECTION_GAP,
} from "../constants";
import { formatInvoiceDate } from "../format";

export function renderBankDetails(
  doc: jsPDF,
  startY: number,
  dueDate: string,
  bankDetails: BankDetails,
): number {
  let y = startY;

  doc.setFont(FONT_FAMILY, "bold");
  doc.setFontSize(FONT_SIZE_NORMAL);
  doc.text(`Due Date: ${formatInvoiceDate(dueDate)}`, MARGIN_LEFT, y);
  y += SECTION_GAP;

  doc.setFont(FONT_FAMILY, "normal");
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.text(
    "Please use the following bank details for SWIFT payments:",
    MARGIN_LEFT,
    y,
  );
  y += LINE_HEIGHT_NORMAL;

  const details: [string, string][] = [
    ["Beneficiary", bankDetails.beneficiary],
    ["IBAN", bankDetails.iban],
    ["BIC", bankDetails.bic],
    ["Intermediary BIC", bankDetails.intermediaryBic],
    ["Beneficiary address", bankDetails.beneficiaryAddress],
    ["Bank/Payment institution", bankDetails.bankName],
    ["Bank/Payment institution address", bankDetails.bankAddress],
  ];

  for (const [label, value] of details) {
    doc.setFont(FONT_FAMILY, "bold");
    doc.text(`${label}: `, MARGIN_LEFT, y);
    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setFont(FONT_FAMILY, "normal");
    doc.text(value, MARGIN_LEFT + labelWidth, y);
    y += LINE_HEIGHT_SMALL;
  }

  return y;
}
