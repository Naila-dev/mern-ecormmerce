const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const auth = require('../middleware/auth'); // middleware name

// Create product
router.post("/", auth, async (req, res) => {
  try {
    const { name, price, description, countInStock = 0, image } = req.body;

    const product = new Product({
      name,
      price,
      description,
      countInStock,
      image,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'username');
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'username');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ message: 'Invalid ID' });
    return res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// Update product
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: 'Updated', product: updatedProduct });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error: ' + err.message });
  }
});

module.exports = router;

