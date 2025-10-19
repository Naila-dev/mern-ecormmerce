import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./context/AuthContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <p>{p.price}</p>
          {user && user._id === p.userId && (
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}
