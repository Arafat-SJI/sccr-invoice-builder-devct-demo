import { Request, Response, NextFunction } from 'express';
import invoiceService from './invoice.service';
import { createInvoiceSchema } from './invoice.validation';

export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || (req as any).user?.id;
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
    const userId = req.userId || (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Validate payload using Zod
    const parsed = createInvoiceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    }

    const { customerId, items, issueDate, dueDate, discount, tax, notes } = parsed.data;

    try {
      const created = await invoiceService.create(userId as string, {
        customerId,
        items,
        issueDate,
        dueDate,
        discount,
        tax,
        notes,
      } as any);

      return res.status(201).json(created);
    } catch (serviceErr: any) {
      if (serviceErr.status === 403) return res.status(403).json({ message: serviceErr.message });
      if (serviceErr.status === 400) return res.status(400).json({ message: serviceErr.message });
      throw serviceErr;
    }
  } catch (err) {
    return next(err);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { customerId, items, status } = req.body || {};
    const updated = await invoiceService.update(id, { customerId, items, status });
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
