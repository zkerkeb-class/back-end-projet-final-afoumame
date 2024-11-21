import { swaggerOptions } from '@config/swagger';
import { errorHandler } from '@middlewares/errorHandler';
import userRoutes from '@routes/userRoutes';
import { logger } from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

config({
  path: path.resolve(process.cwd(), envFile),
});

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

if (!isProduction) {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', serve, setup(swaggerSpec));
}

app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
