import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Auth from './components/Auth';
import DashboardView from './components/DashboardView';
import TaskView from './components/TaskView';
import ProfileView from './components/ProfileView';

function Layout({ token, setToken }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <nav className="glass-panel" style={{ borderRadius: 0, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--surface-border)', zIndex: 10, background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.4rem' }}>DayPlanner ✨</h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/') ? 700 : 500, transition: 'var(--transition)' }}>Dashboard</Link>
            <Link to="/tasks" style={{ textDecoration: 'none', color: isActive('/tasks') ? 'var(--primary)' : 'var(--text-muted)', fontWeight: isActive('/tasks') ? 700 : 500, transition: 'var(--transition)' }}>Tasks Planner</Link>
          </div>
        </div>

        {/* Right Corner Profile Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.4rem 1rem', borderRadius: '30px', background: isActive('/profile') ? 'rgba(79,70,229,0.1)' : 'transparent', transition: 'all 0.3s' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
             <span style={{ fontWeight: 600, color: isActive('/profile') ? 'var(--primary)' : 'var(--text-main)' }}>Akshay Sharma</span>
          </Link>
          <button className="btn-secondary" style={{ padding: '0.4rem 1rem', background: '#f8fafc', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }} onClick={() => { localStorage.removeItem('token'); setToken(null); }}>Log Out</button>
        </div>
      </nav>
      
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--background)' }}>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/tasks" element={<TaskView />} />
          <Route path="/profile" element={<ProfileView setToken={setToken} />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      {token ? (
        <Layout token={token} setToken={setToken} />
      ) : (
        <Routes>
          <Route path="*" element={<Auth setToken={setToken} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
