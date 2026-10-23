import Link from "next/link";

export const metadata = {
  title: "Invoices",
};

export default function InvoicesIndexPage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <Link
          href="/dashboard/invoices/create"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
        >
          Create Invoice
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        Invoice listing will appear here in a future story. Use the button above to create a new invoice.
      </p>
    </div>
  );
}
