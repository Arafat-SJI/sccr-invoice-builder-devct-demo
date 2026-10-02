export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CustomerCreateInput = {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export type CustomerUpdateInput = Partial<CustomerCreateInput>;
