// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // adjust if your backend runs elsewhere
});

export default API;
