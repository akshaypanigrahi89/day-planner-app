import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Bell, Shield, Mail, CheckCircle } from 'lucide-react';
import api from '../api';

export default function ProfileView({ setToken }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to load profile", err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      full_name: formData.get('full_name'),
      profession: formData.get('profession'),
      location: formData.get('location'),
      phone_no: formData.get('phone_no'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country')
    };

    try {
      const res = await api.put('/auth/me', updates);
      setProfile(res.data);
      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      setSaveStatus('Failed to save changes.');
    }
  };

  if (!profile) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading user data...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 800, boxShadow: '0 10px 25px rgba(79,70,229,0.3)' }}>
          {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
        </div>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>{profile.full_name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
             <Mail size={16}/> {profile.email} 
             {profile.otp_verified && <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', marginLeft: '0.5rem', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '12px' }}><CheckCircle size={12}/> OTP Verified</span>}
          </p>
        </div>
      </div>

      <form className="glass-panel" onSubmit={handleUpdate} style={{ padding: '2.5rem', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginBottom: '2rem', color: 'var(--text-main)', display: 'flex', gap: '0.8rem', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}><User size={22} color="var(--primary)"/> Profile Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
             <input name="full_name" type="text" defaultValue={profile.full_name} required style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Phone Number</label>
             <input name="phone_no" type="text" defaultValue={profile.phone_no} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profession / Role</label>
             <input name="profession" type="text" defaultValue={profile.profession} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>City</label>
             <input name="city" type="text" defaultValue={profile.city} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>State/Province</label>
             <input name="state" type="text" defaultValue={profile.state} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Country</label>
             <input name="country" type="text" defaultValue={profile.country} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Save</button>
          {saveStatus && <span style={{ color: saveStatus.includes('Failed') ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>{saveStatus}</span>}
        </div>
      </form>

      <div className="glass-panel" style={{ padding: '2.5rem', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginBottom: '2rem', color: 'var(--text-main)', display: 'flex', gap: '0.8rem', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}><Settings size={22} color="var(--primary)"/> System Settings</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
               <h4 style={{ color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.1rem' }}><Bell size={18}/> Daily Notifications</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Receive active desktop prompts for Water Reminders.</p>
             </div>
             <button onClick={() => setNotifications(!notifications)} style={{ width: '50px', height: '24px', borderRadius: '12px', background: notifications ? 'var(--primary)' : 'var(--surface-border)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', top: '2px', left: notifications ? '28px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
             </button>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
             <div>
               <h4 style={{ color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.1rem' }}><Shield size={18}/> Account Security</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Manage your active sessions and secure network passwords.</p>
             </div>
             <button className="btn-secondary" style={{ fontWeight: 600 }}>Modify Password</button>
           </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex' }}>
        <button onClick={() => { localStorage.removeItem('token'); setToken(null); }} className="btn-secondary" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.8rem', borderColor: 'var(--danger)', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600 }}>
          <LogOut size={20}/> Log Out of DayPlanner
        </button>
      </div>

    </motion.div>
  );
}
