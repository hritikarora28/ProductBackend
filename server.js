const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import jwt for token operations

// Initialize Express app
const app = express();

// Hard-coded JWT secret key (not recommended for production)
const jwtSecret = 'yourHardcodedSecretKey'; // Replace with your actual secret key

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded

// MongoDB connection
mongoose.connect('mongodb+srv://hritikarora875:eQl5M0RMkwt3xP5J@cluster0.vwss2yc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error: ' + err));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Use decoded payload directly
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Admin middleware
const adminMiddleware = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
};




// Product routes
app.use('/api/products', require('./routes/products'));

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


