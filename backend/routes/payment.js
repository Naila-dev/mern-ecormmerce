 //payment.js
 // routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const protect = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

// @route POST /api/payment/create-payment-intent
// @desc Creates a Stripe Payment Intent for a specific order
router.post('/create-payment-intent', protect, async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to pay for this order' });
        }

        // Stripe requires the amount in the smallest currency unit (cents)
        const amountInCents = Math.round(order.totalPrice * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd', 
            metadata: { 
                order_id: order._id.toString(), 
                user_id: req.user._id.toString()
            },
        });

        // Send the client secret back to the frontend to complete the payment
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            orderId: order._id,
        });
        
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error);
        res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
    }
});

module.exports = router;