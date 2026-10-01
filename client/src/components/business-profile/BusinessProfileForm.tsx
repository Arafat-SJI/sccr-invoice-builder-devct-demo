"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const phoneRegex = /^[+]?[\s\-()0-9]{7,20}$/;

export const businessProfileSchema = z.object({
  businessName: z.string().min(1, "Business Name is required."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  stateProvince: z.string().min(1, "State/Province is required."),
  postalCode: z.string().min(1, "Postal Code is required."),
  country: z.string().min(1, "Country is required."),
  taxId: z.string().optional(),
  contactEmail: z.string().email("Invalid email format."),
  contactPhone: z.string().regex(phoneRegex, "Invalid phone number.").optional(),
});

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;

export interface BusinessProfileFormProps {
  initialValues?: Partial<BusinessProfileFormValues> | null;
  onSubmit: (values: BusinessProfileFormValues) => Promise<void> | void;
  submitting?: boolean;
  serverError?: string | null;
  serverSuccess?: string | null;
}

export function BusinessProfileForm({ initialValues, onSubmit, submitting, serverError, serverSuccess }: BusinessProfileFormProps) {
  const [values, setValues] = useState<BusinessProfileFormValues>({
    businessName: initialValues?.businessName || "",
    addressLine1: initialValues?.addressLine1 || "",
    addressLine2: initialValues?.addressLine2 || "",
    city: initialValues?.city || "",
    stateProvince: initialValues?.stateProvince || "",
    postalCode: initialValues?.postalCode || "",
    country: initialValues?.country || "",
    taxId: initialValues?.taxId || "",
    contactEmail: initialValues?.contactEmail || "",
    contactPhone: initialValues?.contactPhone || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = businessProfileSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = (i.path?.[0] as string) || "form";
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      return;
    }
    await onSubmit(parsed.data);
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" value={values.businessName} onChange={handleChange} placeholder="Acme Inc." />
              {errors.businessName && <p className="text-sm text-red-500">{errors.businessName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" name="taxId" value={values.taxId} onChange={handleChange} placeholder="Optional" />
              {errors.taxId && <p className="text-sm text-red-500">{errors.taxId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" name="addressLine1" value={values.addressLine1} onChange={handleChange} placeholder="123 Main St" />
            {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input id="addressLine2" name="addressLine2" value={values.addressLine2} onChange={handleChange} placeholder="Suite 100 (optional)" />
            {errors.addressLine2 && <p className="text-sm text-red-500">{errors.addressLine2}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={values.city} onChange={handleChange} />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stateProvince">State/Province</Label>
              <Input id="stateProvince" name="stateProvince" value={values.stateProvince} onChange={handleChange} />
              {errors.stateProvince && <p className="text-sm text-red-500">{errors.stateProvince}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" name="postalCode" value={values.postalCode} onChange={handleChange} />
              {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" value={values.country} onChange={handleChange} />
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" name="contactEmail" type="email" value={values.contactEmail} onChange={handleChange} placeholder="you@company.com" />
              {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" name="contactPhone" value={values.contactPhone} onChange={handleChange} placeholder="Optional" />
              {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone}</p>}
            </div>
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          {serverSuccess && <p className="text-sm text-green-600">{serverSuccess}</p>}

          <CardFooter className="px-0">
            <Button type="submit" disabled={!!submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
