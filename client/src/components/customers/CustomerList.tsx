import React from 'react';
import { Button } from '@/components/ui/button';

interface CustomerListProps {
  customers: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  }>;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  return (
    <div>
      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <Button>Edit</Button>
                <Button>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
