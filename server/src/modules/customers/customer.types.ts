export interface Customer {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDTO {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
}

export type UpdateCustomerDTO = Partial<Omit<CreateCustomerDTO, 'userId'>>;
