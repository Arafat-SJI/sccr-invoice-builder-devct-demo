import Link from "next/link";
import InvoiceBuilderForm from "@/components/invoices/InvoiceBuilderForm";

export const metadata = {
  title: "Create Invoice",
};

export default function CreateInvoicePage() {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Create Invoice</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/dashboard/invoices" className="text-primary hover:underline">Back to Invoices</Link>
        </div>
      </div>
      <InvoiceBuilderForm />
    </div>
  );
}
