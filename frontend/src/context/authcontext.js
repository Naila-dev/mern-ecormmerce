import { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ token });
  }, []);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setUser({ token: res.data.token });
  };

  const register = async (username, password) => {
    const res = await API.post('/auth/register', { username, password });
    localStorage.setItem('token', res.data.token);
    setUser({ token: res.data.token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
