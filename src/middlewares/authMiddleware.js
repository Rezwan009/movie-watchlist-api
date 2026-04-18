import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

/**
 * Middleware to protect private routes using JWT
 */
const protect = async (req, res, next) => {
    let token;

    // Check if token exists
    if (req.headers?.authorization && req.headers?.authorization.startsWith('Bearer')) {
        // Split the header to get the token
        token = req.headers?.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
        // Get token from cookie
        token = req.cookies?.jwt;
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

        // Get user from token (don't include password)
        req.user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export { protect };
