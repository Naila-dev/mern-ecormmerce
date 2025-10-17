// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order'); // Use capitalized model name
const Cart = require('../models/cart'); // Use capitalized model name
const protect = require('../middleware/auth');

// @route POST /api/orders
// @desc Create a new order (Checkout submission)
router.post('/', protect, async (req, res) => {
    // Requires shippingAddress, paymentMethod, taxPrice, shippingPrice from frontend body
    const { shippingAddress, paymentMethod, taxPrice = 0, shippingPrice = 0 } = req.body; 

    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty. Cannot place order.' });
        }

        // Calculate prices
        const itemsPrice = cart.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        // Map cart items to the OrderItemSchema snapshot
        const orderItems = cart.items.map(item => ({
            name: item.product.name,
            qty: item.qty,
            image: item.product.image,
            price: item.product.price, 
            product: item.product._id
        }));

        const order = new Order({
            user: req.user._id,
            orderItems, 
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid: false,
        });

        const createdOrder = await order.save();

        // Clear the cart after successful order creation
        await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

        res.status(201).json(createdOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create order: ' + err.message });
    }
});

// @route GET /api/orders
// @desc Get all user orders (Order History)
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching orders' });
    }
});

// @route GET /api/orders/:id
// @desc Get single order details
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'username email'); 

        if (!order) return res.status(404).json({ msg: 'Order not found' });
        
        // Authorization check: Must be the owner
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching order details' });
    }
});

// @route PUT /api/orders/:id/pay
// @desc Update order payment status (Final step after payment confirmation)
router.put('/:id/pay', protect, async (req, res) => {
    const { id, status, update_time } = req.body; 

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        
        if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ msg: 'Forbidden' });
        if (order.isPaid) return res.status(400).json({ message: 'Order already paid' });

        // Update the payment fields
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = { id, status, update_time };

        const updatedOrder = await order.save();
        res.json({ message: 'Payment successful', order: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: 'Server error updating payment status' });
    }
});

module.exports = router;
