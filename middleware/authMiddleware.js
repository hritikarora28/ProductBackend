const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'yourJWTSecret'); // Replace with your secret
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminMiddleware = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
