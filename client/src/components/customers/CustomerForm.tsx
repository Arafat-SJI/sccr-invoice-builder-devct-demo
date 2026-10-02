import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerInput } from '@/lib/validation/customer';
import { Button } from '@/components/ui/button';

interface CustomerFormProps {
  onSubmit: (data: CustomerInput) => void;
  defaultValues?: CustomerInput;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input {...register('name')} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>
      <div>
        <label>Email</label>
        <input {...register('email')} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div>
        <label>Phone</label>
        <input {...register('phone')} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CustomerForm;
