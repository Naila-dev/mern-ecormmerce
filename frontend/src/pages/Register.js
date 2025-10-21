// Importing React and necessary hooks for managing state and navigation
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Defining the Register component as a functional component
export default function Register() {
  // useState hook for managing the form data (username and password)
  const [form, setForm] = useState({ username: "", password: "" });
  
  // useNavigate hook to programmatically navigate to different pages (used after successful registration)
  const navigate = useNavigate();

  // handleChange function updates the form state whenever a user types in the input fields
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // handleRegister function is called when the form is submitted
  const handleRegister = (e) => {
    e.preventDefault(); // Preventing the default form submit behavior (page reload)
    alert("✅ Registration successful! Please login."); // Displaying a success message
    navigate("/login"); // Navigating to the login page after successful registration
  };

  // JSX for the registration form
  return (
    <div className="col-md-4 mx-auto"> {/* Centering the form inside a div */}
      <h3>Register</h3> {/* Title of the registration page */}
      
      {/* Form element that will call handleRegister function when submitted */}
      <form onSubmit={handleRegister}>
        
        {/* Username input field */}
        <div className="mb-3">
          <label>Username</label> {/* Label for the username input */}
          {/* Input field for the username, onChange calls handleChange to update the form state */}
          <input name="username" className="form-control" onChange={handleChange} required />
        </div>

        {/* Password input field */}
        <div className="mb-3">
          <label>Password</label> {/* Label for the password input */}
          {/* Input field for the password, type set to password to mask the input */}
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>

        {/* Submit button to trigger form submission */}
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}
