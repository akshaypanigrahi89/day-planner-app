import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [otpStep, setOtpStep] = useState(false);
  const [regData, setRegData] = useState(null);

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
        if (!otpStep) {
           setRegData({
              email,
              password,
              full_name: formData.get('full_name'),
              phone_no: formData.get('phone_no'),
              city: formData.get('city'),
              state: formData.get('state'),
              country: formData.get('country')
           });
           setOtpStep(true);
        } else {
           // OTP Verification Step
           const enteredOtp = formData.get('otp');
           if (enteredOtp !== '1234') {
              setError("Invalid OTP. Try 1234.");
              return;
           }
           await api.post('/auth/register', { ...regData, otp_verified: true });
           setIsLogin(true);
           setOtpStep(false);
           setRegData(null);
           setError("Registration verified successfully! Please sign in.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container" style={{ background: 'var(--background)', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel auth-form" style={{ background: 'white', padding: '3rem', width: '100%', maxWidth: isLogin ? '400px' : '500px' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
          {isLogin ? 'DayPlanner Connect' : (otpStep ? 'Verify OTP' : 'Join DayPlanner')}
        </h2>
        {error && <p style={{ color: 'var(--danger)', textAlign: 'center', fontWeight: 500, marginBottom: '1rem' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && !otpStep && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" name="full_name" placeholder="Full Name" required style={{ margin: 0 }} />
              <input type="tel" name="phone_no" placeholder="Phone Number" required style={{ margin: 0 }} />
              <input type="text" name="city" placeholder="City" required style={{ margin: 0 }} />
              <input type="text" name="state" placeholder="State/Province" required style={{ margin: 0 }} />
              <input type="text" name="country" placeholder="Country" required style={{ margin: 0, gridColumn: 'span 2' }} />
            </div>
          )}

          {(!otpStep || isLogin) && (
             <>
               <input type="text" name="email" placeholder="User ID" required style={{ margin: 0 }} />
               <input type="password" name="password" placeholder="Password" required style={{ margin: 0 }} />
             </>
          )}

          {otpStep && !isLogin && (
             <>
               <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>An OTP has been sent to your phone. Enter 1234 to verify.</p>
               <input type="text" name="otp" placeholder="Enter OTP 1234" required style={{ margin: 0, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }} />
             </>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" type="submit" style={{ padding: '0.9rem' }}>
            {isLogin ? 'Sign In Securely' : (otpStep ? 'Verify & Complete' : 'Continue to Verification')}
          </motion.button>
        </form>

        <p className="link-text" onClick={() => { setIsLogin(!isLogin); setOtpStep(false); setRegData(null); setError(null); }} style={{ marginTop: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </p>
      </motion.div>
    </div>
  );
}
