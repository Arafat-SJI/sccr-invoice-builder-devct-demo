import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate invoice numbers with format: INV-YYYYMMDD-XXXXXX (6 random digits)
 * Ensures uniqueness by checking DB and retrying a few times.
 */
export async function generateInvoiceNumber(): Promise<string> {
  const prefix = 'INV-';
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
    const candidate = `${prefix}${datePart}-${randomPart}`;

    // Check uniqueness
    const existing = await prisma.invoice.findUnique({ where: { invoiceNumber: candidate } });
    if (!existing) return candidate;
    // else retry
  }

  // fallback: uuid-based invoice number (should be extremely rare)
  const fallback = `${prefix}${datePart}-${Date.now()}`;
  return fallback;
}
