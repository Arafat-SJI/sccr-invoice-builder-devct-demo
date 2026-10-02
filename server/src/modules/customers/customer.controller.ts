import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import customerService, { ConflictError } from './customer.service';
import { createCustomerSchema, updateCustomerSchema } from './customer.validation';

function zodErrorResponse(err: any) {
  if (!err?.issues) return null;
  return {
    message: 'Validation error',
    errors: err.issues.map((i: any) => ({ path: i.path?.join('.') ?? '', message: i.message })),
  };
}

export async function listCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const customers = await customerService.listByUser(userId);
    return res.json(customers);
  } catch (err) {
    return next(err);
  }
}

export async function getCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const customer = await customerService.getById(id);
    if (!customer) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const parsed = createCustomerSchema.safeParse(req.body || {});
    if (!parsed.success) {
      const payload = zodErrorResponse(parsed.error);
      return res.status(400).json(payload ?? { message: 'Bad Request' });
    }

    const created = await customerService.create(userId, parsed.data);
    return res.status(201).json(created);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // Unique constraint failed, likely on email
      return res.status(409).json({ message: 'Conflict: A customer with this email already exists.' });
    }
    return next(err);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parsed = updateCustomerSchema.safeParse(req.body || {});
    if (!parsed.success) {
      const payload = zodErrorResponse(parsed.error);
      return res.status(400).json(payload ?? { message: 'Bad Request' });
    }

    const updated = await customerService.update(id, parsed.data);
    if (!updated) return res.status(404).json({ message: 'Not Found: Resource not found.' });

    return res.json(updated);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(409).json({ message: 'Conflict: A customer with this email already exists.' });
      }
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Not Found: Resource not found.' });
      }
    }
    return next(err);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ok = await customerService.remove(id);
    if (!ok) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.status(204).send();
  } catch (err: any) {
    if (err instanceof ConflictError) {
      return res.status(409).json({ message: err.message });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      // Foreign key constraint (safety net)
      return res
        .status(409)
        .json({ message: 'Conflict: Customer cannot be deleted because invoices reference it.' });
    }
    return next(err);
  }
}
