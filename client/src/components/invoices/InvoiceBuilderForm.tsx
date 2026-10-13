import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInvoiceSchema } from '@/lib/api/invoice.validation';
import { useCreateInvoice } from '@/lib/api/invoices';
import { CustomerSelector } from './CustomerSelector';
import { InvoiceItemRow } from './InvoiceItemRow';

export function InvoiceBuilderForm({ onSuccess }: { onSuccess: (invoiceId: string) => void }) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      discount: 0,
      tax: 0,
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const { mutate: createInvoice, isLoading } = useCreateInvoice({
    onSuccess: (data) => onSuccess(data.id),
  });

  const onSubmit = (data: any) => {
    createInvoice(data);
  };

  const subtotal = watch('items').reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = subtotal - watch('discount') + watch('tax');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CustomerSelector {...register('customerId')} error={errors.customerId?.message} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="invoiceDate">Invoice Date</label>
          <input type="date" id="invoiceDate" {...register('invoiceDate')} className="input" />
        </div>
        <div>
          <label htmlFor="dueDate">Due Date</label>
          <input type="date" id="dueDate" {...register('dueDate')} className="input" />
        </div>
      </div>
      <div>
        <label>Items</label>
        {fields.map((item, index) => (
          <InvoiceItemRow key={item.id} item={item} index={index} remove={remove} register={register} />
        ))}
        <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="btn">
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="discount">Discount</label>
          <input type="number" id="discount" {...register('discount')} className="input" />
        </div>
        <div>
          <label htmlFor="tax">Tax</label>
          <input type="number" id="tax" {...register('tax')} className="input" />
        </div>
        <div>
          <label>Total</label>
          <div className="input">{total.toFixed(2)}</div>
        </div>
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" {...register('notes')} className="input"></textarea>
      </div>
      <button type="submit" className="btn" disabled={isLoading}>Create Invoice</button>
    </form>
  );
}
