import { logger } from '@utils/logger';
import { Request, Response } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof ApiError) {
    logger.error(`API Error: ${err.message}`);
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  logger.error(`Unhandled Error: ${err.message}`);
  return res.status(500).json({
    message: 'Internal server error',
  });
};
