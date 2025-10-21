// Products routes

// Import necessary modules
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post("/", async (req, res) => {
    try {
        const { name, price, description } = req.body;
        // Save the product to the database
        const product = new Product({ name, price, description });
        await product.save();
        // Return created product and a message
        res.status(201).json({ message: "Product created successfully", product });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Read/Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        // If no products found/exists
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Send the products if they exist
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


// Read/get one product by its ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        // If product not found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product); // if product found
    } catch (err) {
        console.error(`Error fetching product ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Update a product by its ID
router.put("/:id", async (req, res) => {
    try {
        // Fetch the records from the form in the frontend
        const { name, price, description } = req.body;
        // Update the product in the database
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Product not found' });

        // If product updated successfully
        res.status(200).json({ message: "Product updated successfully", product: updated });
    } catch (err) {
        console.error(`Error updating product ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product by its ID
router.delete("/:id", async (req, res) => {
    try {
        // Get the product by its ID and delete it
        const product = await Product.findByIdAndDelete(req.params.id);
        // If product not found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // If product deleted successfully
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(`Error deleting product ${req.params.id}:`, err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;