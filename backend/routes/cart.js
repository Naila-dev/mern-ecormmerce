// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Use capitalized model name
const Product = require('../models/product'); // Use capitalized model name
const protect = require('../middleware/auth');

// @route GET /api/cart
// @desc Get user's cart (creates one if it doesn't exist)
router.get('/', protect, async (req, res) => {
    try {
        // Find the user's cart and populate product details
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price image countInStock');
        
        // If no cart exists, create a new empty one
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error while fetching cart' });
    }
});

// @route POST /api/cart/add
// @desc Add product to cart or increase quantity
router.post('/add', protect, async (req, res) => {
    const { productId, qty = 1 } = req.body;
    
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = new Cart({ user: req.user._id, items: [] });

        const index = cart.items.findIndex(i => i.product.equals(productId));
        
        if (index > -1) {
            // Item exists: increase quantity
            cart.items[index].qty += qty;
        } else {
            // Item is new: push to array
            cart.items.push({ product: productId, qty });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error while adding to cart' });
    }
});

// @route DELETE /api/cart/remove/:productId
// @desc Remove specific product from cart
router.delete('/remove/:productId', protect, async (req, res) => {
    const productId = req.params.productId;
    
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        // Filter out the product to be removed
        cart.items = cart.items.filter(i => !i.product.equals(productId));
        
        await cart.save();
        res.json({ msg: 'Item removed from cart', cart });
    } catch (err) {
        res.status(500).json({ msg: 'Server error while removing from cart' });
    }
});

// @route DELETE /api/cart/clear
// @desc Clear entire cart
router.delete('/clear', protect, async (req, res) => {
    try {
        // Find the user's cart and reset the items array
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
        res.json({ msg: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error while clearing cart' });
    }
});

module.exports = router;

