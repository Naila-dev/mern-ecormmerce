import { useState } from "react";
import api from "../api/axios";

export default function Checkout() {
  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/orders", form);
    alert("Order placed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <button type="submit">Checkout</button>
    </form>
  );
}
