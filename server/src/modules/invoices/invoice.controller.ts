import { Request, Response, NextFunction } from 'express';
import invoiceService from './invoice.service';
import { createInvoiceSchema } from './invoice.validation';

export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const invoices = await invoiceService.listByUser(userId);
    return res.json(invoices);
  } catch (err) {
    return next(err);
  }
}

export async function getInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getById(id);
    if (!invoice) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.json(invoice);
  } catch (err) {
    return next(err);
  }
}

export async function createInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Validate input using Zod
    const parseResult = createInvoiceSchema.safeParse(req.body || {});
    if (!parseResult.success) {
      const formatted = parseResult.error.format();
      return res.status(400).json({ message: 'Validation failed', errors: formatted });
    }

    const { customerId, items, issueDate, dueDate, discount, tax, notes } = parseResult.data;

    const created = await invoiceService.create(userId, {
      customerId,
      items,
      issueDate,
      dueDate,
      discount,
      tax,
      notes,
    });
    return res.status(201).json(created);
  } catch (err: any) {
    // Standardized error handling: if service attached a status use it
    if (err && typeof err === 'object' && (err.status || err.statusCode)) {
      const status = (err.status || err.statusCode) as number;
      const message = err.message || 'Error';
      return res.status(status).json({ message });
    }
    return next(err);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { customerId, items, status } = req.body || {};
    const updated = await invoiceService.update(id, { customerId, items, status } as any);
    if (!updated) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ok = await invoiceService.remove(id);
    if (!ok) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
