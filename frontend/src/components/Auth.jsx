import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email'); 
    const password = formData.get('password');

    try {
      if (isLogin) {
        const body = new URLSearchParams();
        body.append('username', email); // OAuth2 expects username field
        body.append('password', password);
        const res = await api.post('/auth/token', body);
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
      } else {
        await api.post('/auth/register', { email, password });
        setIsLogin(true);
        setError("Account created perfectly! Please sign in.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container" style={{ background: 'var(--background)', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel auth-form" style={{ background: 'white', padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          {isLogin ? 'DayPlanner Connect' : 'Join DayPlanner'}
        </h2>
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input type="email" name="email" placeholder="Email Address" required style={{ margin: 0 }} />
          <input type="password" name="password" placeholder="Password" required style={{ margin: 0 }} />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" type="submit" style={{ padding: '0.9rem' }}>
            {isLogin ? 'Sign In Securely' : 'Create Account'}
          </motion.button>
        </form>
        <p className="link-text" onClick={() => { setIsLogin(!isLogin); setError(null); }} style={{ marginTop: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </p>
      </motion.div>
    </div>
  );
}
