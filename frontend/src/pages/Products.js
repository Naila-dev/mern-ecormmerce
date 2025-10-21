// src/pages/Products.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
useEffect(() => {
  const token = localStorage.getItem("token"); // ✅ Moved inside
  axios.get("http://localhost:5000/simple-ecom/products", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => setProducts(res.data))
    .catch(err => console.error("Error fetching products:", err));
}, []); // ✅ No need to list token now


  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

