import { apiClient, extractApiError } from "@/lib/api/client";
import { Customer, CustomerCreateInput, CustomerUpdateInput } from "./customer.types";

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const res = await apiClient.get<Customer[]>("/customers");
    return res.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function getCustomerById(id: string): Promise<Customer> {
  try {
    const res = await apiClient.get<Customer>(`/customers/${id}`);
    return res.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function createCustomer(data: CustomerCreateInput): Promise<Customer> {
  try {
    const res = await apiClient.post<Customer>("/customers", data);
    return res.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function updateCustomer(id: string, data: CustomerUpdateInput): Promise<Customer> {
  try {
    const res = await apiClient.put<Customer>(`/customers/${id}`, data);
    return res.data;
  } catch (error) {
    throw extractApiError(error);
  }
}

export async function deleteCustomer(id: string): Promise<{ success: true } | void> {
  try {
    await apiClient.delete(`/customers/${id}`);
    return { success: true } as const;
  } catch (error) {
    throw extractApiError(error);
  }
}
