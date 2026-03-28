import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { LineItem } from "../types";
import { MARGIN_LEFT, MARGIN_RIGHT, PAGE_WIDTH_MM, FONT_SIZE_NORMAL } from "../constants";
import { formatCurrency } from "../format";

export function renderLineItemsTable(
  doc: jsPDF,
  startY: number,
  lineItems: LineItem[],
  currency: string,
): number {
  const tableBody = lineItems.map((item) => [
    item.descriptionLines.map((l) => `- ${l}`).join("\n"),
    item.quantity.toFixed(2),
    formatCurrency(item.unitPrice),
    item.taxLabel,
    formatCurrency(item.quantity * item.unitPrice),
  ]);

  autoTable(doc, {
    startY,
    head: [["Description", "Quantity", "Unit Price", "Tax", `Amount ${currency}`]],
    body: tableBody,
    theme: "plain",
    margin: { left: MARGIN_LEFT, right: MARGIN_RIGHT },
    tableWidth: PAGE_WIDTH_MM - MARGIN_LEFT - MARGIN_RIGHT,
    styles: {
      fontSize: FONT_SIZE_NORMAL,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 2 },
      valign: "top",
      overflow: "linebreak",
      lineColor: [200, 200, 200],
      lineWidth: { bottom: 0.2, top: 0, left: 0, right: 0 },
    },
    headStyles: {
      fontStyle: "bold",
      lineWidth: { bottom: 0.5, top: 0, left: 0, right: 0 },
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 75, halign: "left" },
      1: { cellWidth: 22, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 33, halign: "right" },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY as number;
  if (typeof finalY !== "number") {
    throw new Error("AutoTable did not set finalY");
  }
  return finalY;
}
