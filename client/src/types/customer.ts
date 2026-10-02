export type Customer = {
  id: string;
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  // legacy consolidated address field (kept for compatibility)
  address?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerCreatePayload = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export type CustomerUpdatePayload = Partial<CustomerCreatePayload>;
