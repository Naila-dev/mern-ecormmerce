// models/Order.js
const mongoose = require('mongoose');

// Sub-schema for items (snapshot of the product details at the time of purchase)
const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String }, // Optional
    price: { type: Number, required: true }, // Price at time of order
    product: { // Reference to the original product
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    }
});

// Schema for Shipping Address (Required for Checkout Form)
const shippingAddressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
});


const orderSchema = new mongoose.Schema({
    // 1. User Association
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // 2. Order Items (Using the snapshot sub-schema)
    orderItems: [orderItemSchema],

    // 3. Shipping Details
    shippingAddress: shippingAddressSchema,
    
    // 4. Payment Details
    paymentMethod: { type: String, default: 'Stripe' },
    paymentResult: { // Holds data from the payment gateway after successful charge
        id: String,
        status: String,
        update_time: String,
    },
    
    // 5. Financials & Status
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },

}, { 
    timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);
