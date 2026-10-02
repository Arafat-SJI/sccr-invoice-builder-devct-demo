export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCustomerDTO = Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerDTO = Partial<Omit<Customer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
