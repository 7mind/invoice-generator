import type { InvoiceData, InvoiceTemplate } from "../types";
import { readLineItems, clearAndPopulateLineItems } from "./line-items";
import { defaultInvoiceDate, defaultDueDateString } from "../format";

function getInput(id: string): HTMLInputElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Expected input element with id "${id}"`);
  }
  return el;
}

function getTextarea(id: string): HTMLTextAreaElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLTextAreaElement)) {
    throw new Error(`Expected textarea element with id "${id}"`);
  }
  return el;
}

export function buildForm(container: HTMLElement): void {
  container.innerHTML = `
    <header class="app-header">
      <h1>Invoice Generator</h1>
      <div class="header-actions">
        <div class="storage-controls">
          <select id="template-select">
            <option value="">-- Saved Templates --</option>
          </select>
          <button type="button" id="btn-load-template">Load</button>
          <button type="button" id="btn-save-template">Save</button>
          <button type="button" id="btn-delete-template" class="btn-danger-subtle">Delete</button>
        </div>
        <button type="button" id="btn-import">Import File</button>
        <button type="button" id="btn-export">Export File</button>
        <button type="button" id="btn-generate" class="btn-primary">Generate PDF</button>
      </div>
    </header>

    <form id="invoice-form" onsubmit="return false;">
      <section class="form-section">
        <h2>Invoice Details</h2>
        <div class="form-row three-col">
          <label>
            Invoice Number
            <input type="text" id="invoice-number" required>
          </label>
          <label>
            Invoice Date
            <input type="date" id="invoice-date" required>
          </label>
          <label>
            Due Date
            <input type="date" id="due-date" required>
          </label>
        </div>
      </section>

      <section class="form-section">
        <h2>Logo</h2>
        <div class="logo-controls">
          <img id="logo-preview" alt="No logo" />
          <label>
            <input type="file" id="logo-file-input" accept="image/*">
          </label>
          <button type="button" id="btn-remove-logo" class="btn-danger-subtle">Remove</button>
        </div>
        <input type="hidden" id="logo-data">
      </section>

      <section class="form-section">
        <h2>Parties</h2>
        <div class="form-row two-col">
          <fieldset>
            <legend>Bill To</legend>
            <label>
              Company Name
              <input type="text" id="billto-name" required>
            </label>
            <label>
              Address (one line per row)
              <textarea id="billto-address" rows="5"></textarea>
            </label>
            <label>
              Tax Number (optional)
              <input type="text" id="billto-tax-number">
            </label>
          </fieldset>
          <fieldset>
            <legend>From</legend>
            <label>
              Company Name
              <input type="text" id="from-company-name" required>
            </label>
            <label>
              Address (one line per row)
              <textarea id="from-address" rows="5"></textarea>
            </label>
            <label>
              Tax Number
              <input type="text" id="from-tax-number">
            </label>
          </fieldset>
        </div>
      </section>

      <section class="form-section">
        <h2>Line Items</h2>
        <div id="line-items-container"></div>
        <button type="button" id="btn-add-item" class="btn-secondary">+ Add Line Item</button>
        <div class="form-row three-col" style="margin-top: 1rem;">
          <label>
            Currency
            <input type="text" id="currency" required>
          </label>
          <label>
            Tax Label
            <input type="text" id="tax-label" required>
          </label>
          <label>
            Tax Rate (%)
            <input type="number" id="tax-rate" step="0.01" min="0" required>
          </label>
        </div>
      </section>

      <section class="form-section totals-section">
        <div class="totals-grid">
          <span>Subtotal:</span><span id="display-subtotal">0.00</span>
          <span>Tax:</span><span id="display-tax">0.00</span>
          <span class="total-label">Total:</span><span id="display-total" class="total-value">0.00</span>
        </div>
      </section>

      <section class="form-section">
        <h2>Bank Details</h2>
        <div class="form-row two-col">
          <label>
            Beneficiary
            <input type="text" id="bank-beneficiary">
          </label>
          <label>
            IBAN
            <input type="text" id="bank-iban">
          </label>
        </div>
        <div class="form-row two-col">
          <label>
            BIC
            <input type="text" id="bank-bic">
          </label>
          <label>
            Intermediary BIC
            <input type="text" id="bank-intermediary-bic">
          </label>
        </div>
        <label>
          Beneficiary Address
          <input type="text" id="bank-beneficiary-address">
        </label>
        <label>
          Bank/Payment Institution
          <input type="text" id="bank-name">
        </label>
        <label>
          Bank/Payment Institution Address
          <input type="text" id="bank-address">
        </label>
      </section>
    </form>
  `;
}

export function populateInvoiceDefaults(): void {
  getInput("invoice-number").value = "INV-0NNN";
  getInput("invoice-date").value = defaultInvoiceDate();
  getInput("due-date").value = defaultDueDateString();
}

export function setLogo(dataUrl: string): void {
  getInput("logo-data").value = dataUrl;
  const preview = document.getElementById("logo-preview") as HTMLImageElement;
  preview.src = dataUrl;
  preview.style.display = dataUrl ? "block" : "none";
}

export function populateForm(template: InvoiceTemplate): void {
  setLogo(template.logo);
  getInput("currency").value = template.currency;
  getInput("billto-name").value = template.billTo.name;
  getTextarea("billto-address").value = template.billTo.address.lines.join("\n");
  getInput("billto-tax-number").value = template.billTo.taxNumber;
  getInput("from-tax-number").value = template.from.taxNumber;
  getInput("from-company-name").value = template.from.companyName;
  getTextarea("from-address").value = template.from.address.lines.join("\n");
  getInput("tax-label").value = template.tax.label;
  getInput("tax-rate").value = String(template.tax.ratePercent);
  getInput("bank-beneficiary").value = template.bankDetails.beneficiary;
  getInput("bank-iban").value = template.bankDetails.iban;
  getInput("bank-bic").value = template.bankDetails.bic;
  getInput("bank-intermediary-bic").value = template.bankDetails.intermediaryBic;
  getInput("bank-beneficiary-address").value = template.bankDetails.beneficiaryAddress;
  getInput("bank-name").value = template.bankDetails.bankName;
  getInput("bank-address").value = template.bankDetails.bankAddress;

  clearAndPopulateLineItems(template.defaultLineItems);
}

export function readFormData(): InvoiceData {
  const invoiceNumber = getInput("invoice-number").value;
  const invoiceDate = getInput("invoice-date").value;
  const dueDate = getInput("due-date").value;

  if (!invoiceNumber) throw new Error("Invoice Number is required");
  if (!invoiceDate) throw new Error("Invoice Date is required");
  if (!dueDate) throw new Error("Due Date is required");

  return {
    invoiceNumber,
    invoiceDate,
    dueDate,
    currency: getInput("currency").value,
    logo: getInput("logo-data").value,
    billTo: {
      name: getInput("billto-name").value,
      address: {
        lines: getTextarea("billto-address").value
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
      },
      taxNumber: getInput("billto-tax-number").value,
    },
    from: {
      taxNumber: getInput("from-tax-number").value,
      companyName: getInput("from-company-name").value,
      address: {
        lines: getTextarea("from-address").value
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
      },
    },
    lineItems: readLineItems(),
    tax: {
      label: getInput("tax-label").value,
      ratePercent: parseFloat(getInput("tax-rate").value),
    },
    bankDetails: {
      beneficiary: getInput("bank-beneficiary").value,
      iban: getInput("bank-iban").value,
      bic: getInput("bank-bic").value,
      intermediaryBic: getInput("bank-intermediary-bic").value,
      beneficiaryAddress: getInput("bank-beneficiary-address").value,
      bankName: getInput("bank-name").value,
      bankAddress: getInput("bank-address").value,
    },
  };
}

export function readCurrentTemplate(): InvoiceTemplate {
  return {
    currency: getInput("currency").value,
    logo: getInput("logo-data").value,
    billTo: {
      name: getInput("billto-name").value,
      address: {
        lines: getTextarea("billto-address").value
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
      },
      taxNumber: getInput("billto-tax-number").value,
    },
    from: {
      taxNumber: getInput("from-tax-number").value,
      companyName: getInput("from-company-name").value,
      address: {
        lines: getTextarea("from-address").value
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0),
      },
    },
    defaultLineItems: readLineItems(),
    tax: {
      label: getInput("tax-label").value,
      ratePercent: parseFloat(getInput("tax-rate").value),
    },
    bankDetails: {
      beneficiary: getInput("bank-beneficiary").value,
      iban: getInput("bank-iban").value,
      bic: getInput("bank-bic").value,
      intermediaryBic: getInput("bank-intermediary-bic").value,
      beneficiaryAddress: getInput("bank-beneficiary-address").value,
      bankName: getInput("bank-name").value,
      bankAddress: getInput("bank-address").value,
    },
  };
}
