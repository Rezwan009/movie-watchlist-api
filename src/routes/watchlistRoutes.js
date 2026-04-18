import express from 'express'
import { addMovieToWatchlist, getWatchlist, removeMovieFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController.js';
import { protect } from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { addMovieToWatchlistSchema, removeMovieFromWatchlistSchema, updateWatchlistItemSchema } from '../validators/watchlistValidators.js';

const router = express.Router();
router.use(protect);

router.post('/', validateRequest(addMovieToWatchlistSchema), addMovieToWatchlist);
router.get('/', getWatchlist);
router.put('/:id', validateRequest(updateWatchlistItemSchema), updateWatchlistItem);
router.delete('/:id', validateRequest(removeMovieFromWatchlistSchema), removeMovieFromWatchlist);

export default router;