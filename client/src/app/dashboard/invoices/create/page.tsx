import { useRouter } from 'next/router';
import { InvoiceBuilderForm } from '@/components/invoices/InvoiceBuilderForm';

export default function CreateInvoicePage() {
  const router = useRouter();

  const handleSuccess = (invoiceId: string) => {
    router.push(`/invoices/${invoiceId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>
      <InvoiceBuilderForm onSuccess={handleSuccess} />
    </div>
  );
}
