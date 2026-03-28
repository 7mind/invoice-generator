import type { LineItem } from "../types";

let container: HTMLElement;
let onChangeCallback: () => void;

function createLineItemRow(item: LineItem): HTMLElement {
  const row = document.createElement("div");
  row.className = "line-item-row";

  row.innerHTML = `
    <div class="line-item-fields">
      <label>
        Description (one per line)
        <textarea class="li-description" rows="3">${item.descriptionLines.join("\n")}</textarea>
      </label>
      <div class="line-item-numbers">
        <label>
          Quantity
          <input type="number" class="li-quantity" step="0.01" min="0" value="${item.quantity}">
        </label>
        <label>
          Tax
          <input type="text" class="li-tax-label" value="${item.taxLabel}">
        </label>
        <label>
          Unit Price
          <input type="number" class="li-unit-price" step="0.01" min="0" value="${item.unitPrice}">
        </label>
        <label>
          Amount
          <input type="text" class="li-amount" readonly value="${(item.quantity * item.unitPrice).toFixed(2)}">
        </label>
      </div>
    </div>
    <button type="button" class="btn-remove-item">Remove</button>
  `;

  const qtyInput = row.querySelector<HTMLInputElement>(".li-quantity")!;
  const priceInput = row.querySelector<HTMLInputElement>(".li-unit-price")!;
  const amountInput = row.querySelector<HTMLInputElement>(".li-amount")!;

  function updateAmount(): void {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    amountInput.value = (qty * price).toFixed(2);
    onChangeCallback();
  }

  qtyInput.addEventListener("input", updateAmount);
  priceInput.addEventListener("input", updateAmount);

  row.querySelector(".btn-remove-item")!.addEventListener("click", () => {
    const rows = container.querySelectorAll(".line-item-row");
    if (rows.length <= 1) return;
    row.remove();
    onChangeCallback();
  });

  return row;
}

export function initLineItems(
  containerEl: HTMLElement,
  initialItems: LineItem[],
  onChange: () => void,
): void {
  container = containerEl;
  onChangeCallback = onChange;
  for (const item of initialItems) {
    container.appendChild(createLineItemRow(item));
  }
}

export function addLineItem(item: LineItem): void {
  container.appendChild(createLineItemRow(item));
  onChangeCallback();
}

export function readLineItems(): LineItem[] {
  const rows = container.querySelectorAll<HTMLElement>(".line-item-row");
  const items: LineItem[] = [];
  for (const row of rows) {
    const desc = row.querySelector<HTMLTextAreaElement>(".li-description")!.value;
    const qty = parseFloat(
      row.querySelector<HTMLInputElement>(".li-quantity")!.value,
    );
    const price = parseFloat(
      row.querySelector<HTMLInputElement>(".li-unit-price")!.value,
    );
    const taxLabel =
      row.querySelector<HTMLInputElement>(".li-tax-label")!.value;

    if (isNaN(qty) || isNaN(price)) {
      throw new Error("Quantity and Unit Price must be valid numbers");
    }

    items.push({
      descriptionLines: desc
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
      quantity: qty,
      unitPrice: price,
      taxLabel,
    });
  }
  return items;
}

export function clearAndPopulateLineItems(items: LineItem[]): void {
  container.innerHTML = "";
  for (const item of items) {
    container.appendChild(createLineItemRow(item));
  }
  onChangeCallback();
}
