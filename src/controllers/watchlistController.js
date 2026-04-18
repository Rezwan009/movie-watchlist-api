import 'dotenv/config';
import { prisma } from "../config/db.js";

/**
 * Add movie to watchlist
 * Adds a movie to the watchlist for the authenticated user
 * Requires protect middleware
 */
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

/**
 * Get watchlist
 * Returns all watchlist items for the authenticated user
 * Requires protect middleware
 */
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

/**
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;

    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: { id: req.params.id },
    });

    if (!watchlistItem) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
        return res
            .status(403)
            .json({ error: "Not allowed to update this watchlist item" });
    }

    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;

    // Update watchlist item
    const updatedItem = await prisma.watchlistItem.update({
        where: { id: req.params.id },
        data: updateData,
    });

    res.status(200).json({
        success: true,
        message: 'Watchlist item updated successfully',
        data: {
            watchlistItem: updatedItem,
        },
    });
};

/**
 * Remove movie from watchlist
 * Removes a movie from the watchlist for the authenticated user
 * Ensures only owner can remove
 * Requires protect middleware
 */
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

export { addMovieToWatchlist, getWatchlist, updateWatchlistItem, removeMovieFromWatchlist };