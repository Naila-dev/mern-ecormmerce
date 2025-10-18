import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import API from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    const res = await API.get('/cart');
    setCart(res.data);
  }, [user]);

  const addToCart = async (productId) => {
    await API.post('/cart/add', { productId });
    fetchCart();
  };

  const removeFromCart = async (id) => {
    await API.delete(`/cart/${id}`);
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

