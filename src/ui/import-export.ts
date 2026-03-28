import type { InvoiceTemplate } from "../types";

function assertIsArray(value: unknown, name: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${name} must be an array`);
  }
}

function assertIsString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`${name} must be a string`);
  }
}

function assertIsNumber(value: unknown, name: string): asserts value is number {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error(`${name} must be a number`);
  }
}

function assertIsObject(
  value: unknown,
  name: string,
): asserts value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

export function assertIsInvoiceTemplate(
  value: unknown,
): asserts value is InvoiceTemplate {
  assertIsObject(value, "template");

  assertIsString(value["currency"], "currency");
  assertIsString(value["logo"], "logo");

  assertIsObject(value["billTo"], "billTo");
  assertIsString((value["billTo"] as Record<string, unknown>)["name"], "billTo.name");
  assertIsObject((value["billTo"] as Record<string, unknown>)["address"], "billTo.address");
  assertIsArray(
    ((value["billTo"] as Record<string, unknown>)["address"] as Record<string, unknown>)["lines"],
    "billTo.address.lines",
  );
  assertIsString((value["billTo"] as Record<string, unknown>)["taxNumber"], "billTo.taxNumber");

  assertIsObject(value["from"], "from");
  assertIsString((value["from"] as Record<string, unknown>)["taxNumber"], "from.taxNumber");
  assertIsString((value["from"] as Record<string, unknown>)["companyName"], "from.companyName");
  assertIsObject((value["from"] as Record<string, unknown>)["address"], "from.address");
  assertIsArray(
    ((value["from"] as Record<string, unknown>)["address"] as Record<string, unknown>)["lines"],
    "from.address.lines",
  );

  assertIsArray(value["defaultLineItems"], "defaultLineItems");
  for (const [i, item] of (value["defaultLineItems"] as unknown[]).entries()) {
    assertIsObject(item, `defaultLineItems[${i}]`);
    const rec = item as Record<string, unknown>;
    assertIsArray(rec["descriptionLines"], `defaultLineItems[${i}].descriptionLines`);
    assertIsNumber(rec["quantity"], `defaultLineItems[${i}].quantity`);
    assertIsNumber(rec["unitPrice"], `defaultLineItems[${i}].unitPrice`);
    assertIsString(rec["taxLabel"], `defaultLineItems[${i}].taxLabel`);
  }

  assertIsObject(value["tax"], "tax");
  assertIsString((value["tax"] as Record<string, unknown>)["label"], "tax.label");
  assertIsNumber((value["tax"] as Record<string, unknown>)["ratePercent"], "tax.ratePercent");

  assertIsObject(value["bankDetails"], "bankDetails");
  const bd = value["bankDetails"] as Record<string, unknown>;
  for (const key of [
    "beneficiary",
    "iban",
    "bic",
    "intermediaryBic",
    "beneficiaryAddress",
    "bankName",
    "bankAddress",
  ]) {
    assertIsString(bd[key], `bankDetails.${key}`);
  }
}

export function exportTemplateAsJson(template: InvoiceTemplate): void {
  const json = JSON.stringify(template, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice-template.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importTemplateFromFile(): Promise<InvoiceTemplate> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed: unknown = JSON.parse(reader.result as string);
          assertIsInvoiceTemplate(parsed);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
    input.click();
  });
}
