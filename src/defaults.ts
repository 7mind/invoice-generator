import type { InvoiceTemplate } from "./types";
import { generateDefaultLogo } from "./default-logo";

export function createDefaultTemplate(): InvoiceTemplate {
  return {
  currency: "USD",
  logo: generateDefaultLogo(),
  billTo: {
    name: "ACME Inc.",
    address: {
      lines: [
        "742 Evergreen Terrace",
        "Suite 100",
        "SPRINGFIELD IL 62704",
        "UNITED STATES",
      ],
    },
    taxNumber: "",
  },
  from: {
    taxNumber: "US12-3456789",
    companyName: "Wayne Industries Ltd.",
    address: {
      lines: [
        "1007 Mountain Drive",
        "Gotham City",
        "NJ 07001",
        "UNITED STATES",
      ],
    },
  },
  defaultLineItems: [
    {
      descriptionLines: [
        "Applied sciences R&D",
        "Defense systems engineering",
        "Prototype fabrication",
      ],
      quantity: 1,
      unitPrice: 15000.0,
      taxLabel: "VAT",
    },
    {
      descriptionLines: [
        "Infrastructure security audit",
        "Technical consulting",
      ],
      quantity: 1,
      unitPrice: 9500.0,
      taxLabel: "VAT",
    },
  ],
  tax: {
    label: "VAT",
    ratePercent: 0,
  },
  bankDetails: {
    beneficiary: "WAYNE INDUSTRIES LTD.",
    iban: "US00WAYN00001234567890",
    bic: "WAYNUSNY",
    intermediaryBic: "CHASUS33",
    beneficiaryAddress:
      "1007 Mountain Drive, Gotham City, NJ 07001, United States",
    bankName: "Gotham National Bank",
    bankAddress:
      "200 Park Avenue, Gotham City, NJ 07001, United States",
  },
  };
}
