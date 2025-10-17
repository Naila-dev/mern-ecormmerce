// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // CRITICAL: Links the cart to the User. 'unique: true' ensures one cart per user.
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Matches the User model name
        required: true,
        unique: true 
    },
    // Array of cart items (products and quantity)
    items: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', // Matches the Product model name
                required: true 
            },
            qty: { 
                type: Number, 
                required: true, 
                default: 1,
                min: [1, 'Quantity must be at least 1']
            },
        }
    ]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Cart', cartSchema);
