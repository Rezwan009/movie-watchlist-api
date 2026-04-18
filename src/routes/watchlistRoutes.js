import express from 'express'
import { addMovieToWatchlist, getWatchlist, removeMovieFromWatchlist } from '../controllers/watchlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/', addMovieToWatchlist);
router.get('/', getWatchlist);
router.delete('/:id', removeMovieFromWatchlist);

export default router;