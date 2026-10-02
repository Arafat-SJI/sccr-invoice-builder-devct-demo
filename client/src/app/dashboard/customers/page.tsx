"use client";

import * as React from "react";
import { Customer, CustomerCreateInput, CustomerUpdateInput } from "@/lib/api/customer.types";
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/api/customers";
import { CustomerList } from "@/components/customers/CustomerList";
import { CustomerForm, type CustomerFormValues } from "@/components/customers/CustomerForm";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message as string;
  }
  return "An unexpected error occurred.";
}

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [formSubmitting, setFormSubmitting] = React.useState(false);
  const [formServerError, setFormServerError] = React.useState<string | null>(null);
  const [activeCustomer, setActiveCustomer] = React.useState<Customer | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleAdd = () => {
    setFormMode("create");
    setActiveCustomer(null);
    setFormServerError(null);
    setFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setFormMode("edit");
    setActiveCustomer(customer);
    setFormServerError(null);
    setFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setActiveCustomer(customer);
    setDeleteError(null);
    setDeleteOpen(true);
  };

  const submitForm = async (values: CustomerFormValues) => {
    setFormSubmitting(true);
    setFormServerError(null);
    setSuccess(null);
    try {
      if (formMode === "create") {
        const payload: CustomerCreateInput = {
          name: values.name,
          email: values.email,
          phone: values.phone ?? undefined,
          address: values.address ?? undefined,
        };
        await createCustomer(payload);
        setSuccess("Customer created successfully.");
      } else if (activeCustomer) {
        const payload: CustomerUpdateInput = {
          name: values.name,
          email: values.email,
          phone: values.phone ?? undefined,
          address: values.address ?? undefined,
        };
        await updateCustomer(activeCustomer.id, payload);
        setSuccess("Customer updated successfully.");
      }
      setFormOpen(false);
      await load();
      // Clear success after a short delay to avoid lingering messages
      window.setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setFormServerError(getErrorMessage(e));
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!activeCustomer) return;
    setDeleteLoading(true);
    setDeleteError(null);
    setSuccess(null);
    try {
      await deleteCustomer(activeCustomer.id);
      setDeleteOpen(false);
      setSuccess("Customer deleted successfully.");
      await load();
      window.setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setDeleteError(getErrorMessage(e));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {success ? (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          {success}
        </div>
      ) : null}
      <CustomerList
        customers={customers}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomerForm
        open={formOpen}
        mode={formMode}
        defaultValues={activeCustomer}
        submitting={formSubmitting}
        serverError={formServerError}
        onOpenChange={setFormOpen}
        onSubmit={submitForm}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        customerName={activeCustomer?.name}
        loading={deleteLoading}
        error={deleteError}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
