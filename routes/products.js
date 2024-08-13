const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');

const router = express.Router();

// @route   POST /api/products
// @desc    Add a new product
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, description = '', tax = 0, discount = 0 } = req.body;

        try {
            const newProduct = new Product({ name, price, description, tax, discount });
            const product = await newProduct.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   GET /api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
router.put(
    '/:id',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, description = '', tax = 0, discount = 0 } = req.body;

        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { name, price, description, tax, discount },
                { new: true }
            );

            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
