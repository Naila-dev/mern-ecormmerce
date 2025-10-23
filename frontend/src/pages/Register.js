// src/Register.js
import React, { useState } from "react";
import api from '../api/axios'; // Use the centralized API instance
import styles from './Register.module.css'; // Import CSS Module

function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form); // Use the api instance
      setMessage("✅ Registration successful! You can now log in.");
      setIsError(false);
      setTimeout(onSwitchToLogin, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "❌ Error registering user. Please try again.";
      setMessage(errorMessage);
      setIsError(true);
      console.error("Registration error:", err);
    }
  };

  return (
     // Outer container with Bootstrap margin for spacing
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className={`card p-4 ${styles.card}`}>
            <div className="card-body">
              <h2 className={`text-center mb-4 ${styles.title}`}>🧍‍♂️ Create Account</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <input
                    name="username"
                    placeholder="Username"
                    className="form-control form-control-lg"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="form-control form-control-lg"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control form-control-lg"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 btn-lg">Sign Up</button>
              </form>
              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-4`}>{message}</div>
              )}
              <p className={`mt-4 text-center ${styles.switchText}`}>
                Already have an account?{" "}
                <button 
                onClick={onSwitchToLogin}
                className="btn btn-link p-0"
                >Login</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;