import apiClient, { extractApiError } from "@/lib/api/client";
import type { CreateInvoicePayload, CreatedInvoice, CustomerLite } from "@/lib/api/invoice.types";

export async function getCustomers(): Promise<CustomerLite[]> {
  try {
    const res = await apiClient.get("/customers");
    const data = res.data as any[];
    // Normalize minimal shape used by selector
    return (data || []).map((c: any) => ({ id: String(c.id), name: String(c.name ?? "Unnamed"), email: c.email ?? null }));
  } catch (err) {
    const e = extractApiError(err);
    throw new Error(e.message || "Failed to fetch customers");
  }
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<CreatedInvoice> {
  try {
    // Server may ignore some fields; this call focuses on successful creation
    const res = await apiClient.post("/invoices", {
      customerId: payload.customerId,
      items: payload.items,
      status: "DRAFT",
      // Include extended fields if backend supports them
      issueDate: payload.issueDate,
      dueDate: payload.dueDate,
      discountPercentage: payload.discountPercentage,
      taxPercentage: payload.taxPercentage,
      notes: payload.notes,
    });
    return res.data as CreatedInvoice;
  } catch (err) {
    const e = extractApiError(err);
    throw new Error(e.message || "Failed to create invoice");
  }
}
