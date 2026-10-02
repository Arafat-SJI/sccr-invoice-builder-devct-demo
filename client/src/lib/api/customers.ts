import { apiClient } from './client';

export async function fetchCustomers() {
  const response = await apiClient.get('/api/customers');
  return response.data;
}

export async function fetchCustomerById(id: string) {
  const response = await apiClient.get(`/api/customers/${id}`);
  return response.data;
}

export async function createCustomer(data: any) {
  const response = await apiClient.post('/api/customers', data);
  return response.data;
}

export async function updateCustomer(id: string, data: any) {
  const response = await apiClient.put(`/api/customers/${id}`, data);
  return response.data;
}

export async function deleteCustomer(id: string) {
  const response = await apiClient.delete(`/api/customers/${id}`);
  return response.data;
}
