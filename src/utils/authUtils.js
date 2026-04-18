import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for a user
 * @param {string} id - The user ID
 * @returns {string} - The JWT token
 */
const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    // Set JWT as an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
};

/**
 * Clear the JWT cookie
 * @param {object} res - The response object
 */
const clearToken = (res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
};

export { generateToken, clearToken };
