import { UseFormRegister } from 'react-hook-form';

export function InvoiceItemRow({ item, index, remove, register }: {
  item: any;
  index: number;
  remove: (index: number) => void;
  register: UseFormRegister<any>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Description"
        {...register(`items.${index}.description`)}
        className="input"
      />
      <input
        type="number"
        placeholder="Quantity"
        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
        className="input"
      />
      <input
        type="number"
        placeholder="Unit Price"
        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
        className="input"
      />
      <button type="button" onClick={() => remove(index)} className="btn">
        Remove
      </button>
    </div>
  );
}
