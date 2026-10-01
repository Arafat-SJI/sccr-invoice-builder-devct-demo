import { Request, Response, NextFunction } from 'express';
import customerService from './customer.service';

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

    const { name, email, phone, address } = req.body || {};
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Bad Request: name is required.' });
    }

    const created = await customerService.create(userId, { name, email, phone, address });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body || {};

    const updated = await customerService.update(id, { name, email, phone, address });
    if (!updated) return res.status(404).json({ message: 'Not Found: Resource not found.' });

    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ok = await customerService.remove(id);
    if (!ok) return res.status(404).json({ message: 'Not Found: Resource not found.' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
