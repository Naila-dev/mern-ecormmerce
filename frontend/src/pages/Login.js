// import necessary libraries
import React, { useState } from "react";
import api from '../api/axios'; // Use the centralized API instance
import styles from './Login.module.css'; // Import CSS Module

// define the Login component
function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on new input
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const res = await api.post("/auth/login", form); // Use the api instance
      localStorage.setItem("token", res.data.token);
      setSuccessMessage("Login successful! Redirecting...");
      onLoginSuccess();
    } catch (err) {
      setError("Invalid name or password.");
    }
  };

  return (
    // Outer container with Bootstrap margin for spacing
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className={`card p-4 ${styles.card}`}>
            <div className="card-body">
              <h2 className={`text-center mb-4 ${styles.title}`}>🔐 Sign In</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    name="username"
                    placeholder="Username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
                {successMessage && <p className="text-success mt-3">{successMessage}</p>}
                {error && <p className="text-danger mt-3">{error}</p>}
              </form>
              <p className={`mt-3 text-center ${styles.switchText}`}>
                Don’t have an account?{" "}
                <button onClick={onSwitchToRegister} className="btn btn-link p-0">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;