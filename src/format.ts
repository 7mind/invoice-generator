const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatInvoiceDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${isoDate}`);
  }
  return dateFormatter.format(date);
}

const FRIDAY = 5;
const MIN_DAYS_AHEAD = 7;

function toIsoDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function nthFridayOfMonth(year: number, month: number, n: number): Date {
  const first = new Date(year, month, 1);
  const dayOfWeek = first.getDay();
  const daysUntilFriday = (FRIDAY - dayOfWeek + 7) % 7;
  return new Date(year, month, 1 + daysUntilFriday + (n - 1) * 7);
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function defaultDueDate(today: Date): Date {
  const eom = endOfMonth(today);
  if (diffDays(today, eom) >= MIN_DAYS_AHEAD) {
    return eom;
  }

  const nextMonth = today.getMonth() + 1;
  const nextMonthYear = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
  const nextMonthIndex = nextMonth % 12;

  const firstFriday = nthFridayOfMonth(nextMonthYear, nextMonthIndex, 1);
  if (diffDays(today, firstFriday) >= MIN_DAYS_AHEAD) {
    return firstFriday;
  }

  return nthFridayOfMonth(nextMonthYear, nextMonthIndex, 2);
}

export function defaultInvoiceDate(): string {
  return toIsoDateString(new Date());
}

export function defaultDueDateString(): string {
  return toIsoDateString(defaultDueDate(new Date()));
}
