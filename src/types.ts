export interface PostalAddress {
  lines: string[];
}

export interface BillToParty {
  name: string;
  address: PostalAddress;
  taxNumber: string;
}

export interface FromParty {
  taxNumber: string;
  companyName: string;
  address: PostalAddress;
}

export interface LineItem {
  descriptionLines: string[];
  quantity: number;
  unitPrice: number;
  taxLabel: string;
}

export interface TaxConfig {
  label: string;
  ratePercent: number;
}

export interface BankDetails {
  beneficiary: string;
  iban: string;
  bic: string;
  intermediaryBic: string;
  beneficiaryAddress: string;
  bankName: string;
  bankAddress: string;
}

export interface InvoiceData {
  invoiceDate: string;
  invoiceNumber: string;
  dueDate: string;
  currency: string;
  logo: string;
  billTo: BillToParty;
  from: FromParty;
  lineItems: LineItem[];
  tax: TaxConfig;
  bankDetails: BankDetails;
}

export interface InvoiceTemplate {
  currency: string;
  logo: string;
  billTo: BillToParty;
  from: FromParty;
  defaultLineItems: LineItem[];
  tax: TaxConfig;
  bankDetails: BankDetails;
}

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
}
