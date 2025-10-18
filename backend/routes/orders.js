const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');
const CartItem = require('../models/cart');
const Product = require('../models/product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create order from checkout form (simple)
router.post('/', auth, async (req, res) => {
  try {
    const { items, shipping, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }
    const order = new Order({
      userId: req.user.id,
      items,
      total,
      shipping,
      status: 'placed'
    }); 
    await order.save();

    // Optionally clear user's cart
    await CartItem.deleteMany({ userId: req.user.id });

    res.json({ message: 'Order placed', order });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Stripe create checkout session (simple)
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { items } = req.body; // items: [{ name, price, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    const line_items = items.map(i => ({
      price_data: {
        currency: 'usd',
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100)
      },
      quantity: i.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe error' });
  }
});

module.exports = router;

