import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Droplet, Plus, Minus, Bell, Star, GlassWater } from 'lucide-react';

export default function DashboardView({ profile }) {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState("Loading AI insights...");
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    api.get('/tasks/').then(res => {
      setTasks(res.data);
      const done = res.data.filter(t => t.status === 'Done').length;
      const rate = res.data.length ? Math.round((done / res.data.length) * 100) : 0;
      setInsights(rate > 50 ? "Great job today! You're highly productive. Keep crushing it!" : "You have many pending tasks. Focus on knocking out the 'Doing' tasks first to build momentum.");
    });
  }, []);

  const currentTasks = tasks.filter(t => (t.target_date || t.date || new Date().toISOString().split('T')[0]) === selectedDate);
  
  const todo = currentTasks.filter(t => t.status === 'Todo').length;
  const doing = currentTasks.filter(t => t.status === 'Doing').length;
  const done = currentTasks.filter(t => t.status === 'Done').length;
  const completionRate = currentTasks.length ? Math.round((done / currentTasks.length) * 100) : 0;

  const pieData = [
    { name: 'Todo', value: todo, color: '#f59e0b' },
    { name: 'Doing', value: doing, color: '#4f46e5' },
    { name: 'Done', value: done, color: '#10b981' }
  ];

  const barData = tasks.reduce((acc, t) => {
    const c = t.category || 'General';
    const existing = acc.find(x => x.name === c);
    if (existing) { existing[t.status === 'Done' ? 'done' : 'pending'] += 1; }
    else { acc.push({ name: c, pending: t.status !== 'Done' ? 1 : 0, done: t.status === 'Done' ? 1 : 0 }); }
    return acc;
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
           Hi {profile?.full_name?.split(' ')[0] || 'User'}, here is your dashboard
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Total: {currentTasks.length}</span>
          <span style={{ color: 'var(--warning)' }}>Todo: {todo}</span>
          <span style={{ color: 'var(--primary)' }}>Doing: {doing}</span>
          <span style={{ color: 'var(--success)' }}>Done: {done}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        {/* Top Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Completion Rate */}
          <motion.div whileHover={{ translateY: -5, scale: 1.01, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.03), rgba(79,70,229,0.03))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>Daily Completion Rate</h3>
            <div style={{ fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {completionRate}%
            </div>
            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>{done} of {currentTasks.length} tasks completed!</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, minHeight: '350px' }}>
          <motion.div whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Progress Pipeline</h4>
            <ResponsiveContainer width="100%" height="85%"><PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip /><Legend verticalAlign="bottom" height={24}/></PieChart></ResponsiveContainer>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Categories Breakdown</h4>
            <ResponsiveContainer width="100%" height="85%"><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><RechartsTooltip cursor={{ fill: 'transparent' }}/><Legend verticalAlign="bottom" height={24}/><Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} /><Bar dataKey="done" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
