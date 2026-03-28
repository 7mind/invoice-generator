import type { InvoiceTemplate } from "../types";
import { assertIsInvoiceTemplate } from "./import-export";

const STORAGE_KEY = "invoice-generator-templates";

interface StoredTemplates {
  [name: string]: InvoiceTemplate;
}

function loadAll(): StoredTemplates {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {};
  }
  return parsed as StoredTemplates;
}

function saveAll(templates: StoredTemplates): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function listTemplateNames(): string[] {
  return Object.keys(loadAll()).sort();
}

export function saveTemplate(name: string, template: InvoiceTemplate): void {
  const all = loadAll();
  all[name] = template;
  saveAll(all);
}

export function loadTemplate(name: string): InvoiceTemplate {
  const all = loadAll();
  const template: unknown = all[name];
  if (!template) {
    throw new Error(`Template "${name}" not found`);
  }
  assertIsInvoiceTemplate(template);
  return template;
}

export function deleteTemplate(name: string): void {
  const all = loadAll();
  if (!(name in all)) {
    throw new Error(`Template "${name}" not found`);
  }
  delete all[name];
  saveAll(all);
}
