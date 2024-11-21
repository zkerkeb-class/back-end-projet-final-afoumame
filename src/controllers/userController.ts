import { NextFunction, Request, Response } from 'express';
// import { ApiError } from '@middlewares/errorHandler';

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       500:
   *         description: Internal server error
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Implementation
      res.json({ message: 'Get all users' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Implementation
      res.json({ message: `Get user ${id}` });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *             required:
   *               - name
   *               - email
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      // Implementation
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData = req.body;
      // Implementation
      res.json({ message: `Update user ${id}` });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // Implementation
      res.json({ message: `Delete user ${id}` });
    } catch (error) {
      next(error);
    }
  }
}
