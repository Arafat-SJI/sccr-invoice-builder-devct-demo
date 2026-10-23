"use client";

import React from "react";
import InvoiceForm from "@/components/invoices/InvoiceForm";

export default function CreateInvoicePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Create Invoice</h1>
        <p className="text-sm text-muted-foreground">Fill out the form below to create a new invoice.</p>
      </header>

      <InvoiceForm />
    </div>
  );
}
