const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CartItem = require('../models/cart');
const Product = require('../models/product');

// Get current user's cart
router.get('/', auth, async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user.id }).populate('productId');
    // map to useful shape
    const payload = items.map(i => ({
      _id: i._id,
      productId: i.productId._id,
      productName: i.productId.name,
      price: i.productId.price,
      quantity: i.quantity
    }));
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add to cart (auth)
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let item = await CartItem.findOne({ userId: req.user.id, productId });
    if (item) {
      item.quantity += quantity;
    } else {
      item = new CartItem({ userId: req.user.id, productId, quantity });
    }
    await item.save();
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Remove item by cart item id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (item.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await item.remove();
    res.json({ message: 'Removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;


