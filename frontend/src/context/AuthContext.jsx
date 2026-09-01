import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  _id: 'usr-default-01',
  name: 'Sairam Vittanala',
  email: 'sairam@hospitalop.in',
  role: 'patient',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=180&h=180&q=80',
  abhaId: '9821-4412-8820',
  city: 'Visakhapatnam',
  state: 'Andhra Pradesh',
  age: 28,
  gender: 'Male',
  token: 'mock-jwt-token-active'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediop_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mediop_token') || 'mock-jwt-token-active';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediop_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediop_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mediop_token', token);
    } else {
      localStorage.removeItem('mediop_token');
    }
  }, [token]);

  // Login action
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json();
      setUser(data);
      setToken(data.token);
      return { success: true, user: data };
    } catch (err) {
      // Fallback for offline/demo credentials
      if (email === 'sairam@hospitalop.in' || email === 'sairam') {
        setUser(DEFAULT_USER);
        setToken('mock-jwt-token-active');
        return { success: true, user: DEFAULT_USER };
      }
      if (email.includes('deepthi')) {
        const doctorUser = {
          _id: 'usr-doctor-01',
          name: 'Dr. Deepthi',
          email: 'dr.deepthi@hospitalop.in',
          role: 'doctor',
          phone: '+91 98480 12345',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=180&h=180&q=80',
          abhaId: 'DOC-8820-4100',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          age: 42,
          gender: 'Female',
          token: 'mock-jwt-token-doctor'
        };
        setUser(doctorUser);
        setToken('mock-jwt-token-doctor');
        return { success: true, user: doctorUser };
      }
      throw err;
    }
  };

  // Register action
  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }

      const data = await res.json();
      setUser(data);
      setToken(data.token);
      return { success: true, user: data };
    } catch (err) {
      // Mock fallback if network fails
      const newUser = {
        _id: 'usr-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'patient',
        phone: userData.phone || '+91 98765 00000',
        avatar: userData.gender === 'Female' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80'
          : 'https://images.unsplash.com/photo-1594824813571-638f026361a1?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: '9821-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        city: userData.city || 'Hyderabad',
        state: userData.state || 'Telangana',
        age: userData.age || 25,
        gender: userData.gender || 'Male',
        token: 'mock-jwt-token-' + Date.now()
      };
      setUser(newUser);
      setToken(newUser.token);
      return { success: true, user: newUser };
    }
  };

  // Quick switch demo user
  const switchDemoUser = (userType) => {
    if (userType === 'doctor') {
      const doc = {
        _id: 'usr-doctor-01',
        name: 'Dr. Deepthi',
        email: 'dr.deepthi@hospitalop.in',
        role: 'doctor',
        phone: '+91 98480 12345',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: 'DOC-8820-4100',
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        age: 42,
        gender: 'Female',
        token: 'mock-jwt-token-doctor'
      };
      setUser(doc);
      setToken(doc.token);
      return doc;
    } else if (userType === 'priya') {
      const priya = {
        _id: 'usr-priya-01',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'patient',
        phone: '+91 91234 56789',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80',
        abhaId: '9821-7711-2091',
        city: 'Hyderabad',
        state: 'Telangana',
        age: 26,
        gender: 'Female',
        token: 'mock-jwt-token-priya'
      };
      setUser(priya);
      setToken(priya.token);
      return priya;
    } else {
      setUser(DEFAULT_USER);
      setToken(DEFAULT_USER.token);
      return DEFAULT_USER;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mediop_user');
    localStorage.removeItem('mediop_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchDemoUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
