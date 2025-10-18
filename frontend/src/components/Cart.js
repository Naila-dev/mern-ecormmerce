import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/cart").then((res) => setCart(res.data));
  }, []);

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    setCart(cart.filter((item) => item._id !== id));
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item._id}>
          <p>{item.productName}</p>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
