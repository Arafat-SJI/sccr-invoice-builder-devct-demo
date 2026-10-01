import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import healthRoutes from './routes/health.routes';
import authRoutes from './modules/auth/auth.routes';
import { authenticateToken } from './middlewares/auth.middleware';
import { AuthRequest } from './modules/auth/auth.types';
import customerRoutes from './modules/customers/customer.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);

// Example protected route to verify auth middleware
app.get('/api/protected', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
