const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// POST add a new product
router.post('/', async (req, res) => {
    const { name, price, description, tax, discount } = req.body;

    // Basic validation
    if (!name || !price) {
        return res.status(400).json({ msg: 'Name and price are required' });
    }

    try {
        const product = new Product({
            name,
            price,
            description: description || '',
            tax: tax || 0,
            discount: discount || 0
        });

        await product.save();
        res.status(201).json({ msg: 'Product added' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// GET product by ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// PUT update product by ID
router.put('/:productId', async (req, res) => {
    const { name, price, description, tax, discount } = req.body;

    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.tax = tax || product.tax;
        product.discount = discount || product.discount;

        await product.save();
        res.json({ msg: 'Product updated' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// DELETE product by ID
router.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await product.remove();
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

