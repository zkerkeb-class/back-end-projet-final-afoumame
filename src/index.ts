import { swaggerOptions } from '@config/swagger';
import { errorHandler } from '@middlewares/errorHandler';
import { logger } from '@utils/logger';
import compression from 'compression';
import cors from 'cors';
import { config } from 'dotenv';
import express, { urlencoded } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

import albumRoutes from '@routes/albumRoutes';
import artistRoutes from '@routes/artistRoutes';
import mediaRoutes from '@routes/mediaRoutes';
import playlistRoutes from '@routes/playlistRoutes';
import trackRoutes from '@routes/trackRoutes';
import userRoutes from '@routes/userRoutes';

const envPath = path.resolve(process.cwd(), '.env');

config({
  path: envPath,
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
app.use(express.json());
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
app.use('/api/artist', artistRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/media', mediaRoutes);

app.use(errorHandler);

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI non défini dans les variables d'environnement");
    }

    await mongoose.connect(mongoURI);

    logger.info('MongoDB connecté avec succès');
  } catch (error) {
    logger.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB déconnecté');
});

mongoose.connection.on('error', err => {
  logger.error('Erreur MongoDB:', err);
});

connectDB();

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
