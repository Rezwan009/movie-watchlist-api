import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { generateToken, clearToken } from '../utils/authUtils.js';

/**
 * @desc    Register a new user
 * @route   POST /auth/register
 * @access  Public
 */
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // TODO: Add validation for email and password
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        // res.json(userExists);

        if (userExists) {
            return res
                .status(400)
                .json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    },
                    token: generateToken(user.id, res)
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

/**
 * @desc    Authenticate a user
 * @route   POST /auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    // TODO: Add validation for email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    },
                    token: generateToken(user.id, res)
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

/**
 * @desc    Logout a user
 * @route   POST /auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
    try {
        clearToken(res);
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during logout' });
    }
}

export { register, login, logout }
