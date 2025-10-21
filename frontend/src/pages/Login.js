// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();

    if (form.username === "Rkamunu" && form.password === "41831655") {
      localStorage.setItem("user", JSON.stringify(form));
      alert("✅ Logged in as admin!");
      navigate("/dashboard");
    } else {
      localStorage.setItem("user", JSON.stringify(form));
      alert("✅ Logged in as viewer!");
      navigate("/");
    }
  };

  return (
    <div className="col-md-4 mx-auto">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Username</label>
          <input name="username" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
