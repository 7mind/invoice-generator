import { jsPDF } from "jspdf";
import type { InvoiceData, InvoiceTotals } from "../types";
import { MARGIN_TOP } from "../constants";
import { renderHeader } from "./header";
import { renderParties } from "./parties";
import { renderLineItemsTable } from "./table";
import { renderTotals } from "./totals";
import { renderBankDetails } from "./bank-details";

function computeTotals(data: InvoiceData): InvoiceTotals {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = subtotal * (data.tax.ratePercent / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
}

export function generateInvoicePdf(data: InvoiceData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const totals = computeTotals(data);
  let y = MARGIN_TOP;

  y = renderHeader(doc, y, data.invoiceDate, data.invoiceNumber, data.logo);
  y = renderParties(doc, y, data.billTo, data.from);
  y = renderLineItemsTable(doc, y, data.lineItems, data.currency);
  y = renderTotals(doc, y, totals, data.tax, data.currency);
  renderBankDetails(doc, y, data.dueDate, data.bankDetails);

  doc.save(`Invoice ${data.invoiceNumber}.pdf`);
}

export { computeTotals };
