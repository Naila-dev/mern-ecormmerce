
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <h4>{product.name}</h4>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product._id)}>Add to Cart</button>
    </div>
  );
}
