import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { requireOwnership } from '../../middlewares/authorization.middleware';
import invoiceService from './invoice.service';
import {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from './invoice.controller';

const router = Router();

// All invoice routes require authentication
router.use(authenticateToken);

router.get('/', listInvoices);
router.get('/:id', requireOwnership(invoiceService.getById), getInvoice);
router.post('/', createInvoice);
router.put('/:id', requireOwnership(invoiceService.getById), updateInvoice);
router.delete('/:id', requireOwnership(invoiceService.getById), deleteInvoice);

export default router;
