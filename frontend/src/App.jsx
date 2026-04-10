import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Auth from './components/Auth';
import DashboardView from './components/DashboardView';
import DailyPlannerView from './components/DailyPlannerView';
import TaskView from './components/TaskView';
import ProfileView from './components/ProfileView';
import RefreshView from './components/RefreshView';
import api from './api';

function Layout({ token, setToken }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/auth/me').then(res => setProfile(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <nav className="glass-panel" style={{ borderRadius: 0, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', zIndex: 10, background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Aion DayPlanner ✨</h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/') ? 700 : 500, transition: 'var(--transition)' }}>Dashboard</Link>
            <Link to="/planner" style={{ textDecoration: 'none', color: isActive('/planner') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/planner') ? 700 : 500, transition: 'var(--transition)' }}>Daily Planner</Link>
            <Link to="/tasks" style={{ textDecoration: 'none', color: isActive('/tasks') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/tasks') ? 700 : 500, transition: 'var(--transition)' }}>Task Board</Link>
            <Link to="/refresh" style={{ textDecoration: 'none', color: isActive('/refresh') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/refresh') ? 700 : 500, transition: 'var(--transition)' }}>Refresh Zone</Link>
          </div>
        </div>

        {/* Right Corner Profile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.4rem 1rem', borderRadius: '30px', background: isActive('/profile') ? 'rgba(79,70,229,0.1)' : 'transparent', transition: 'all 0.3s' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}</div>
             <span style={{ fontWeight: 600, color: isActive('/profile') ? 'var(--primary)' : 'var(--text-main)' }}>{profile?.full_name || 'User'}</span>
          </Link>
          <button className="btn-secondary" style={{ padding: '0.4rem 1rem', background: '#f8fafc', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Log Out</button>
        </div>
      </nav>
      
      <div style={{ flex: 1, overflowY: 'auto', background: 'transparent', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardView profile={profile} />} />
            <Route path="/planner" element={<DailyPlannerView profile={profile} />} />
            <Route path="/tasks" element={<TaskView />} />
            <Route path="/profile" element={<ProfileView setToken={setToken} />} />
            <Route path="/refresh" element={<RefreshView />} />
          </Routes>
        </div>
        <footer style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(20px)' }}>
          <div>&copy; {new Date().getFullYear()} Aion DayPlanner. Enhance your productivity and focus.</div>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600 }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <HashRouter>
      {token ? (
        <Layout token={token} setToken={setToken} />
      ) : (
        <Routes>
          <Route path="*" element={<Auth setToken={setToken} />} />
        </Routes>
      )}
    </HashRouter>
  );
}
