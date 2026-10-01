import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());

app.use('/api/health', healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
