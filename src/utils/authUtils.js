import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param {string} id - The user ID
 * @returns {string} - The JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '7d'
    });
};

export { generateToken };
