import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import API from '../api/axios';

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const total = cart.reduce((a, b) => a + b.price * b.quantity, 0);

  const checkout = async () => {
    const res = await API.post('/orders/create-checkout-session', {
      items: cart.map(c => ({
        name: c.productName,
        price: c.price,
        quantity: c.quantity
      })),
    });
    window.location.href = res.data.url;
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map(i => (
        <div key={i._id}>
          {i.productName} x {i.quantity} = ${i.price * i.quantity}
          <button onClick={() => removeFromCart(i._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ${total}</h3>
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}

