export function InvoiceSummary({
  subtotal,
  discountPercentage,
  discountAmount,
  taxableAmount,
  taxPercentage,
  taxAmount,
  grandTotal,
  formatCurrency,
}: {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxableAmount: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  formatCurrency: (n: number) => string;
}) {
  const Row = ({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) => (
    <div className="flex items-center justify-between text-sm">
      <span className={muted ? "text-muted-foreground" : "font-medium"}>{label}</span>
      <span className={muted ? "text-muted-foreground" : "font-semibold"}>{value}</span>
    </div>
  );

  return (
    <div className="rounded-md border border-blue-300 bg-blue-50 p-4">
      <h3 className="mb-3 text-base font-semibold text-blue-900">Summary</h3>
      <div className="space-y-2">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label={`Discount (${(Number(discountPercentage) || 0).toFixed(2)}%)`} value={`- ${formatCurrency(discountAmount)}`} muted />
        <Row label="Taxable" value={formatCurrency(taxableAmount)} muted />
        <Row label={`Tax (${(Number(taxPercentage) || 0).toFixed(2)}%)`} value={formatCurrency(taxAmount)} muted />
        <div className="border-t border-blue-200 pt-2" />
        <Row label="Grand Total" value={formatCurrency(grandTotal)} />
      </div>
    </div>
  );
}
