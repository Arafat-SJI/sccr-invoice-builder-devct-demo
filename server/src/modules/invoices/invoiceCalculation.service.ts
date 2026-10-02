export type CalcItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CalculationResult = {
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calculateInvoice(items: CalcItem[], discount = 0, tax = 0): CalculationResult {
  const computedItems = items.map((it) => {
    const amount = round2(it.quantity * it.unitPrice);
    return { description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, amount };
  });

  const subtotal = round2(computedItems.reduce((s, it) => s + it.amount, 0));
  const d = round2(discount || 0);
  const t = round2(tax || 0);
  const total = round2(subtotal - d + t);

  return {
    items: computedItems,
    subtotal,
    discount: d,
    tax: t,
    total,
  };
}
