// src/pages/Products.js
import React, { useState, useEffect } from "react";
import API from "../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get('/simple-ecom/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const payWithMpesa = (price) => {
    API.post('/mpesa/stkpush', {
      phone: '254748397839',
      amount: price,
    })
      .then(() => alert('📲 STK Push sent! Check your phone.'))
      .catch(() => alert('❌ Error sending STK push'));
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`🛒 Added ${product.name} to cart!`);
  };

  return (
    <div>
      <h3>Available Products</h3>
      <div className="row">
        {products.map(p => (
          <div key={p._id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5>{p.name}</h5>
                <p>{p.description}</p>
                <h6>KES {p.price}</h6>

                {user && user.username === "Rkamunu" ? (
                  <button
                    onClick={() => payWithMpesa(p.price)}
                    className="btn btn-success w-100"
                  >
                    💰 Pay with M-Pesa
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => addToCart(p)}
                      className="btn btn-outline-primary w-100 mb-2"
                    >
                      ➕ Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}