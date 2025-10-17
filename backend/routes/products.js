// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Use capitalized model name
const protect = require('../middleware/auth'); 

// @route POST /api/products
// @desc Create a new product (Protected & links to creator)
router.post("/", protect, async (req, res) => {
    try {
        const { name, price, description, countInStock = 0, image } = req.body;
        
        const product = new Product({
            name, price, description, countInStock, image,
            user: req.user._id, // LINK TO CREATOR (Requirement 1c)
        });
        
        const createdProduct = await product.save();
        return res.status(201).json(createdProduct);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// @route GET /api/products
// @desc Get all products (Public view)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate('user', 'username'); 
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// @route GET /api/products/:id
// @desc Get single product (Public view)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user', 'username');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: "Product not found (Invalid ID format)" });
        }
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// @route PUT /api/products/:id
// @desc Update a product (Protected & Authorized check)
router.put("/:id", protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // AUTHORIZATION CHECK (Requirement 1c)
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true, runValidators: true } 
        );

        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
});

// @route DELETE /api/products/:id
// @desc Delete a product (Protected & Authorized check)
router.delete("/:id", protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        // AUTHORIZATION CHECK (Requirement 1c)
        if (product.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
});

module.exports = router;
