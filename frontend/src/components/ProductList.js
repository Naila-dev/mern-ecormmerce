import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useContext(AuthContext); // keep context subscription if needed elsewhere

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        if (mounted) setProducts(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      setError(err);
    }
  };

  // Helper to decode JWT payload and get user id (if available)
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded._id || null;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();

  return (
    <div>
      <h2>Products</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color: 'red'}}>Error loading products</p>}
      {!loading && !error && products.map((p) => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <p>{p.price}</p>
          {currentUserId && p.user && p.user._id && currentUserId === String(p.user._id) && (
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}
