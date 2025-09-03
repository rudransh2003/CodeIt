import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('UserContext: Checking authentication state');
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('UserContext: No token found');
      setUser(null);
      setLoading(false);
      return;
    }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log('UserContext: Validation successful', res.data.user.email);
      setUser(res.data.user);
    })
    .catch(err => {
      console.error('UserContext: Validation failed', {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err.message
      });
      
      localStorage.removeItem('token');
      setUser(null);
    })
    .finally(() => {
      console.log('UserContext: Loading complete');
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};