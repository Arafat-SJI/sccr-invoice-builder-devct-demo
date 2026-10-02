import { Request, Response, NextFunction } from 'express';
import customerService from './customer.service';
import { NotFoundError, UnauthorizedError, ConflictError } from '../../utils/errors';

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
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const customer = await customerService.getById(id, userId);
    if (!customer) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.json(customer);
  } catch (err) {
    if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
    if (err instanceof UnauthorizedError) return res.status(403).json({ message: err.message });
    return next(err);
  }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const customerData = req.body;
    const created = await customerService.create(userId, customerData);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const customerData = req.body;
    const updated = await customerService.update(id, userId, customerData);
    if (!updated) return res.status(404).json({ message: 'Not Found: Resource not found.' });

    return res.json(updated);
  } catch (err) {
    if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
    if (err instanceof UnauthorizedError) return res.status(403).json({ message: err.message });
    return next(err);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId || req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const ok = await customerService.remove(id, userId);
    if (!ok) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.status(204).send();
  } catch (err) {
    if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
    if (err instanceof UnauthorizedError) return res.status(403).json({ message: err.message });
    if (err instanceof ConflictError) return res.status(409).json({ message: err.message });
    return next(err);
  }
}
