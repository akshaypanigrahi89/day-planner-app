import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Bell, Shield, Mail } from 'lucide-react';

export default function ProfileView({ setToken }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '3rem 4rem', display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', fontWeight: 800, boxShadow: '0 10px 25px rgba(79,70,229,0.3)' }}>
          A
        </div>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>Akshay Sharma</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><Mail size={16}/> akshay@planner.app</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <h3 style={{ marginBottom: '2rem', color: 'var(--text-main)', display: 'flex', gap: '0.8rem', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}><User size={22} color="var(--primary)"/> Profile Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
             <input type="text" defaultValue="Akshay Sharma" style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</label>
             <input type="email" defaultValue="akshay@planner.app" style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profession / Role</label>
             <input type="text" defaultValue="Product Leader" style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location</label>
             <input type="text" defaultValue="India" style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--background)', border: '1px solid var(--surface-border)', borderRadius: '8px', fontSize: '1rem', color: 'var(--text-main)' }} />
           </div>
        </div>
        <button className="btn-primary" style={{ marginTop: '2.5rem', padding: '0.8rem 2rem', fontSize: '1rem' }}>Save Metadata</button>
      </div>

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

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div>
               <h4 style={{ color: 'var(--text-main)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '1.1rem' }}>Dark Mode Theme Interface</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Swap interface backgrounds to low-light display configurations.</p>
             </div>
             <button onClick={() => setDarkMode(!darkMode)} style={{ width: '50px', height: '24px', borderRadius: '12px', background: darkMode ? 'var(--primary)' : 'var(--surface-border)', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
                <div style={{ position: 'absolute', top: '2px', left: darkMode ? '28px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
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
