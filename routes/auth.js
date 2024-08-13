const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Hard-coded JWT secret key (not recommended for production)
const jwtSecret = 'yourHardcodedSecretKey'; // Replace with your actual secret key

// Register a new user
router.post('/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').isIn(['user', 'admin']).withMessage('Invalid role')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                role
            });

            await user.save();
            res.json({ msg: 'User registered successfully' });
        } catch (err) {
            console.error('Error during registration:', err.message);
            res.status(500).send('Server error');
        }
    }
);

// Login a user
router.post('/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').exists().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });

            res.json({ token });
        } catch (err) {
            console.error('Error during login:', err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;



// Login route remains the same
