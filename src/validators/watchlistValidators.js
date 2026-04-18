import { z } from "zod";

const addMovieToWatchlistSchema = z.object({
    body: z.object({
        movieId: z.string().uuid('Invalid movie ID').min(1, 'Movie ID is required'),
        status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
            error: () => ({
                message: 'Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED'
            }),
        }).optional(),
        rating: z.coerce
            .number()
            .int('Rating must be an integer')
            .min(1, 'Rating must be at least 1')
            .max(10, 'Rating must be at most 10')
            .optional(),
        notes: z.string().optional()
    })
});

const updateWatchlistItemSchema = z.object({
    body: z.object({
        status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
            message: 'Invalid status'
        }).optional(),
        rating: z.number().optional(),
        notes: z.string().optional()
    })
});

const removeMovieFromWatchlistSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Watchlist item ID is required')
    })
});

export { addMovieToWatchlistSchema, updateWatchlistItemSchema, removeMovieFromWatchlistSchema };
