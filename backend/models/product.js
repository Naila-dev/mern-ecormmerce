// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price'],
        default: 0,
    },
    description: {
        type: String,
        required: [true, 'A product must have a description'],
    },
    image: {
        type: String,
        default: '/images/sample.jpg', // Placeholder
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    // CRITICAL: Link to the User who created the product for authorization checks
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User', // Must match the exported model name above
        required: true, 
    },
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);