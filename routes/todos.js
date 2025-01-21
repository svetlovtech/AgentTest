/**
 * Todo routes
 * @module routes/todos
 */

import express from 'express';
import { body, query } from 'express-validator';

import {
  getTodos,
  createTodo,
  updateTodo,
  shareTodo,
  deleteTodo,
} from '../controllers/todoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get todos with filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: deadlineBefore
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter todos with deadline before this date
 */
router.get(
  '/',
  [query('completed').optional().isBoolean(), query('deadlineBefore').optional().isISO8601()],
  getTodos
);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('tags').optional().isArray(),
    body('deadline').optional().isISO8601(),
  ],
  createTodo
);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               completed:
 *                 type: boolean
 */
router.put(
  '/:id',
  [
    body('title').optional().notEmpty(),
    body('description').optional(),
    body('tags').optional().isArray(),
    body('deadline').optional().isISO8601(),
    body('completed').optional().isBoolean(),
  ],
  updateTodo
);

/**
 * @swagger
 * /api/todos/{id}/share:
 *   post:
 *     summary: Share a todo with other users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 */
router.post('/:id/share', [body('userIds').isArray()], shareTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', deleteTodo);

export default router;
