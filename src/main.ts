import { createDefaultTemplate } from "./defaults";
import { buildForm, populateForm, populateInvoiceDefaults, readFormData, readCurrentTemplate, setLogo } from "./ui/form";
import { initLineItems, addLineItem, readLineItems } from "./ui/line-items";
import { importTemplateFromFile, exportTemplateAsJson } from "./ui/import-export";
import { listTemplateNames, saveTemplate, loadTemplate, deleteTemplate } from "./ui/storage";
import { generateInvoicePdf } from "./pdf/generator";
import { formatCurrency } from "./format";
import "./style.css";

const app = document.getElementById("app");
if (!app) throw new Error("Missing #app element");

buildForm(app);

const lineItemsContainer = document.getElementById("line-items-container");
if (!lineItemsContainer) throw new Error("Missing #line-items-container");

function updateTotalsDisplay(): void {
  try {
    const items = readLineItems();
    const taxRate = parseFloat(
      (document.getElementById("tax-rate") as HTMLInputElement).value,
    ) || 0;
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    document.getElementById("display-subtotal")!.textContent =
      formatCurrency(subtotal);
    document.getElementById("display-tax")!.textContent =
      formatCurrency(taxAmount);
    document.getElementById("display-total")!.textContent =
      formatCurrency(total);
  } catch {
    // Ignore errors during typing
  }
}

initLineItems(lineItemsContainer, [], updateTotalsDisplay);
populateForm(createDefaultTemplate());
populateInvoiceDefaults();
updateTotalsDisplay();

// Listen for input changes on the form to update totals
document.getElementById("invoice-form")!.addEventListener("input", updateTotalsDisplay);

document.getElementById("btn-add-item")!.addEventListener("click", () => {
  addLineItem({
    descriptionLines: [""],
    quantity: 1,
    unitPrice: 0,
    taxLabel:
      (document.getElementById("tax-label") as HTMLInputElement).value || "VAT",
  });
});

function showError(message: string): void {
  const existing = document.querySelector(".error-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

const logoFileInput = document.getElementById("logo-file-input") as HTMLInputElement;

logoFileInput.addEventListener("change", () => {
  const file = logoFileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    setLogo(reader.result as string);
  };
  reader.onerror = () => showError("Failed to read logo file");
  reader.readAsDataURL(file);
  logoFileInput.value = "";
});

document.getElementById("btn-remove-logo")!.addEventListener("click", () => {
  setLogo("");
});

document.getElementById("btn-generate")!.addEventListener("click", () => {
  try {
    const data = readFormData();
    generateInvoicePdf(data);
  } catch (err) {
    showError(err instanceof Error ? err.message : String(err));
  }
});

document.getElementById("btn-export")!.addEventListener("click", () => {
  try {
    const template = readCurrentTemplate();
    exportTemplateAsJson(template);
  } catch (err) {
    showError(err instanceof Error ? err.message : String(err));
  }
});

const templateSelect = document.getElementById("template-select") as HTMLSelectElement;

function refreshTemplateList(): void {
  const names = listTemplateNames();
  templateSelect.innerHTML = '<option value="">-- Saved Templates --</option>'
    + '<option value="__default__">Default</option>';
  for (const name of names) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    templateSelect.appendChild(option);
  }
}

refreshTemplateList();

document.getElementById("btn-save-template")!.addEventListener("click", () => {
  try {
    const name = prompt("Template name:");
    if (!name) return;
    const template = readCurrentTemplate();
    saveTemplate(name, template);
    refreshTemplateList();
    templateSelect.value = name;
  } catch (err) {
    showError(err instanceof Error ? err.message : String(err));
  }
});

document.getElementById("btn-load-template")!.addEventListener("click", () => {
  try {
    const name = templateSelect.value;
    if (!name) throw new Error("Select a template first");
    const template = name === "__default__"
      ? createDefaultTemplate()
      : loadTemplate(name);
    populateForm(template);
    updateTotalsDisplay();
  } catch (err) {
    showError(err instanceof Error ? err.message : String(err));
  }
});

document.getElementById("btn-delete-template")!.addEventListener("click", () => {
  try {
    const name = templateSelect.value;
    if (!name) throw new Error("Select a template first");
    deleteTemplate(name);
    refreshTemplateList();
  } catch (err) {
    showError(err instanceof Error ? err.message : String(err));
  }
});

document.getElementById("btn-import")!.addEventListener("click", () => {
  importTemplateFromFile()
    .then((template) => {
      populateForm(template);
      updateTotalsDisplay();
    })
    .catch((err) => {
      showError(err instanceof Error ? err.message : String(err));
    });
});
