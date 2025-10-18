// server.js
// basic express + mongoose server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));

app.use(express.json());

// connect mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/simple_ecom')
  .then(() => console.log(' 🦾 ✅ success,mongo is running'))
  .catch(err => console.error('mongo error:', err));

// routes
app.use('/simple-ecom/auth', require('./routes/auth'));
app.use('/simple-ecom/products', require('./routes/products'));
app.use('/simple-ecom/cart', require('./routes/cart'));
app.use('/simple-ecom/orders', require('./routes/orders'));

// start
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on ${port}`));
