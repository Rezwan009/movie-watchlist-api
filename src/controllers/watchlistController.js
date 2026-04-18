import 'dotenv/config';
import { prisma } from "../config/db.js";

const addMovieToWatchlist = async (req, res) => {

    const { movieId, status, rating, notes } = req.body;

    // TODO: Add validation for status and rating
    if (!req.user?.id || !movieId) {
        return res.status(400).json({ message: 'User ID and Movie ID are required' });
    }

    // Check if the movie exists in the database
    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId
        }
    });

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the movie is already in the watchlist
    const existingWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user?.id,
                movieId: movieId
            }
        }
    });

    if (existingWatchlist) {
        return res.status(400).json({ message: 'Movie already in watchlist' });
    }

    try {
        const watchlist = await prisma.watchlistItem.create({
            data: {
                userId: req.user?.id,
                movieId,
                status: status || 'PLANNED',
                rating: rating || null,
                notes: notes || ''
            }
        });
        res.status(201).json({
            success: true,
            message: 'Movie added to watchlist successfully',
            data: {
                watchlist
            }
        });
    } catch (error) {
        console.error('Error adding movie to watchlist:', error);
        res.status(500).json({ message: 'Failed to add movie to watchlist' });
    }
}

const getWatchlist = async (req, res) => {
    try {
        const watchlist = await prisma.watchlistItem.findMany({
            where: {
                userId: req.user?.id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Watchlist fetched successfully',
            data: {
                watchlist
            }
        });
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        res.status(500).json({ message: 'Failed to fetch watchlist' });
    }
}

const removeMovieFromWatchlist = async (req, res) => {
    const { id } = req.params;

    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: {
            id
        }
    });

    if (!watchlistItem) {
        return res.status(404).json({ message: 'Watchlist item not found' });
    }

    // Check if the user is the owner of the watchlist item
    if (watchlistItem.userId !== req.user?.id) {
        return res.status(403).json({ message: 'Not authorized to remove this movie from watchlist' });
    }

    try {
        const watchlist = await prisma.watchlistItem.delete({
            where: {
                id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Movie removed from watchlist successfully',
            data: {
                watchlist
            }
        });
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        res.status(500).json({ message: 'Failed to remove movie from watchlist' });
    }
}

export { addMovieToWatchlist, getWatchlist, removeMovieFromWatchlist };