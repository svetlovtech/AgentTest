/**
 * Todo routes
 * @module routes/todos
 */

const express = require('express');
const { body, query } = require('express-validator');
const TodoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

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
router.get('/', [
  query('completed').optional().isBoolean(),
  query('deadlineBefore').optional().isISO8601()
], TodoController.getTodos);

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
 *             required:
 *               - title
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
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString(),
  body('deadline').optional().isISO8601()
], TodoController.createTodo);

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
 */
router.put('/:id', [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('completed').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('tags.*').optional().isString(),
  body('deadline').optional().isISO8601()
], TodoController.updateTodo);

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
 */
router.post('/:id/share', [
  body('userIds').isArray().withMessage('userIds must be an array'),
  body('userIds.*').isString().withMessage('Each userId must be a string')
], TodoController.shareTodo);

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
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
