/*
  Client-side API helpers for customers.
  Uses the NEXT_PUBLIC_API_URL environment variable and a simple Authorization header
  read from localStorage under the 'ib_auth_token' key. This file provides basic
  functions for the UI to call customer endpoints.
*/

import { CustomerCreatePayload, CustomerUpdatePayload } from '@/types/customer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ib_auth_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function url(path: string) {
  // ensure no double slashes
  return `${API_BASE.replace(/\/$/, '')}/api/customers${path}`;
}

export async function listCustomers(): Promise<any[]> {
  const res = await fetch(url('/'), {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch customers');
  }
  return res.json();
}

export async function getCustomer(id: string): Promise<any> {
  const res = await fetch(url(`/${id}`), {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch customer');
  }
  return res.json();
}

export async function createCustomer(payload: CustomerCreatePayload): Promise<any> {
  const res = await fetch(url('/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create customer');
  }
  return res.json();
}

export async function updateCustomer(id: string, payload: CustomerUpdatePayload): Promise<any> {
  const res = await fetch(url(`/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update customer');
  }
  return res.json();
}

export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(url(`/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  if (res.status === 404) {
    throw new Error('Not Found');
  }
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete customer');
  }
}
