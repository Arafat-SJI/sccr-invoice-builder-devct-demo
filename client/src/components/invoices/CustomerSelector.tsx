import { useQuery } from 'react-query';
import { apiClient } from '@/lib/api/client';
import { useFormContext } from 'react-hook-form';

export function CustomerSelector({ error }: { error?: string }) {
  const { register } = useFormContext();
  const { data: customers, isLoading } = useQuery('customers', async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  });

  return (
    <div>
      <label htmlFor="customerId">Customer</label>
      <select id="customerId" {...register('customerId')} className="input">
        <option value="">Select a customer</option>
        {customers?.map((customer: any) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
      {isLoading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
