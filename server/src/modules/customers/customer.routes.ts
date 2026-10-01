import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { requireOwnership } from '../../middlewares/authorization.middleware';
import customerService from './customer.service';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customer.controller';

const router = Router();

// All customer routes require authentication
router.use(authenticateToken);

router.get('/', listCustomers);
router.get('/:id', requireOwnership(customerService.getById), getCustomer);
router.post('/', createCustomer);
router.put('/:id', requireOwnership(customerService.getById), updateCustomer);
router.delete('/:id', requireOwnership(customerService.getById), deleteCustomer);

export default router;
