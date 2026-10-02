import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
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
router.get('/:id', getCustomer); // Ownership handled in service
router.post('/', createCustomer);
router.put('/:id', updateCustomer); // Ownership handled in service
router.delete('/:id', deleteCustomer); // Ownership handled in service

export default router;
