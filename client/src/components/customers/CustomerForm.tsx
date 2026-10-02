"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Customer } from "@/lib/api/customer.types";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine(
      (val) => !val || /^(\+?[0-9 .\-()]{7,})$/.test(val),
      { message: "Enter a valid phone number" }
    ),
  address: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export type CustomerFormValues = z.infer<typeof schema>;

export interface CustomerFormProps {
  open: boolean;
  mode: "create" | "edit";
  defaultValues?: Partial<Customer> | null;
  submitting?: boolean;
  serverError?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
}

export function CustomerForm({ open, mode, defaultValues, submitting, serverError, onOpenChange, onSubmit }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
    },
  });

  React.useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, open]);

  const internalSubmit = async (values: CustomerFormValues) => {
    await onSubmit(values);
  };

  const title = mode === "create" ? "Add Customer" : "Edit Customer";
  const submitLabel = mode === "create" ? "Save" : "Update";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Acme Corp" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="billing@acme.com" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 555 555 5555" {...register("phone")} aria-invalid={!!errors.phone} />
            {errors.phone && (
              <p className="text-sm text-destructive" role="alert">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="123 Main St, Springfield" {...register("address")} aria-invalid={!!errors.address} />
            {errors.address && (
              <p className="text-sm text-destructive" role="alert">{errors.address.message}</p>
            )}
          </div>
          {serverError ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          ) : null}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={!!submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!!submitting}>
              {submitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
