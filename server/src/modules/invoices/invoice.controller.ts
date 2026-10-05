import { Request, Response, NextFunction } from 'express';
import invoiceService from './invoice.service';
import { createInvoiceSchema, updateInvoiceSchema } from './invoice.validation';
import { ZodError } from 'zod';

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

    const validatedData = createInvoiceSchema.parse(req.body);
    const created = await invoiceService.create(userId, validatedData);
    return res.status(201).json(created);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: err.flatten().fieldErrors });
    }
    return next(err);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const validatedData = updateInvoiceSchema.parse(req.body);
    const updated = await invoiceService.update(id, userId, validatedData);
    if (!updated) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.json(updated);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: err.flatten().fieldErrors });
    }
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
