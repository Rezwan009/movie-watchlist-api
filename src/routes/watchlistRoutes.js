import express from 'express'
import { addMovieToWatchlist, getWatchlist, removeMovieFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { addMovieToWatchlistSchema, removeMovieFromWatchlistSchema, updateWatchlistItemSchema } from '../validators/watchlistValidators.js';

const router = express.Router();
router.use(protect);
/**
 * @swagger
 * tags:
 *   name : Watchlist
 *   description : Watchlist APIs
 */

/**
 * @swagger
 * /watchlist:
 *   post:
 *     summary: Add a movie to watchlist
 *     tags: [Watchlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId: { type: string }
 *               status: { type: string }
 *               rating: { type: number }
 *             required:
 *               - movieId
 *               - status
 *               - rating
 *     responses:
 *       201:
 *         description: Movie added to watchlist successfully
 *       400:
 *         description: Invalid request
 */
router.post('/', validateRequest(addMovieToWatchlistSchema), addMovieToWatchlist);

/**
 * @swagger
 * /watchlist:
 *   get:
 *     summary: Get watchlist
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Watchlist retrieved successfully
 */
router.get('/', getWatchlist);

/**
 * @swagger
 * /watchlist/{id}:
 *   put:
 *     summary: Update a watchlist item
 *     tags: [Watchlist]
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
 *               status: { type: string }
 *               rating: { type: number }
 *             required:
 *               - status
 *               - rating
 *     responses:
 *       200:
 *         description: Watchlist item updated successfully
 *       400:
 *         description: Invalid request
 */
router.put('/:id', validateRequest(updateWatchlistItemSchema), updateWatchlistItem);

/**
 * @swagger
 * /watchlist/{id}:
 *   delete:
 *     summary: Remove a movie from watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie removed from watchlist successfully
 *       400:
 *         description: Invalid request
 */
router.delete('/:id', validateRequest(removeMovieFromWatchlistSchema), removeMovieFromWatchlist);

export default router;