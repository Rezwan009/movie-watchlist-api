import express from 'express'
import { getMovies } from '../controllers/movieController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name : Movies
 *   description : Movies APIs
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 */
router.get('/', getMovies);

export default router;