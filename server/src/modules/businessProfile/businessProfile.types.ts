export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  taxId?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UpsertBusinessProfileDTO = {
  businessName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  taxId?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
};
