import 'dotenv/config';
import { prisma } from "../config/db.js";

const getMovies = async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.status(200).json({
            success: true,
            message: 'Movies fetched successfully',
            data: {
                movies
            }
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
}

export { getMovies };