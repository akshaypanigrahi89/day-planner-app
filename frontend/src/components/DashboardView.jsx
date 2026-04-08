import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Droplet, Plus, Minus, Bell, Star } from 'lucide-react';

export default function DashboardView() {
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState("Loading AI insights...");
  const [water, setWater] = useState(parseInt(localStorage.getItem('water_intake')) || 0);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('water_intake', water);
  }, [water]);

  const requestNotification = () => {
    Notification.requestPermission().then(p => {
      if (p === 'granted') new Notification('Water Reminder', { body: "Time to hydrate! Drink a glass of water." });
    });
  };

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

  const topPriorities = currentTasks.filter(t => t.priority === 'High' && t.status !== 'Done');

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

  const PlannerBlock = ({ title, placeholder }) => {
    const blockKey = `planner_block_${title.replace(/\s+/g, '')}`;
    const [text, setText] = useState(localStorage.getItem(blockKey) || "");
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        <textarea value={text} onChange={e => { setText(e.target.value); localStorage.setItem(blockKey, e.target.value) }} style={{ padding: '0.5rem', background: 'var(--background)', margin: 0, border: '1px solid var(--surface-border)', borderRadius: '4px', minHeight: '65px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.85rem' }} placeholder={placeholder || `Plan your ${title.toLowerCase()}...\n- Note 1\n- Note 2`} />
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Interactive Dashboard</h2>
        <div style={{ display: 'flex', gap: '1.5rem', background: 'white', padding: '0.8rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Total: {currentTasks.length}</span>
          <span style={{ color: 'var(--warning)' }}>Todo: {todo}</span>
          <span style={{ color: 'var(--primary)' }}>Doing: {doing}</span>
          <span style={{ color: 'var(--success)' }}>Done: {done}</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr 1.5fr', gap: '2rem' }}>
        <motion.div whileHover={{ translateY: -5 }} className="glass-panel" style={{ padding: '2rem', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>Completion Rate</h3>
          <div style={{ fontSize: '4rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {completionRate}%
          </div>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>{done} of {currentTasks.length} tasks completed!</p>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: '1rem' }}>
            <motion.div whileHover={{ translateY: -2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Daily Summary Review</h3>
              <textarea placeholder="Write a summary of how your day is flowing..." defaultValue={localStorage.getItem('daily_summary')} onChange={(e) => localStorage.setItem('daily_summary', e.target.value)} style={{ padding: '0.8rem', border: 'none', background: 'var(--background)', borderRadius: '8px', resize: 'vertical', minHeight: '40px', fontSize: '0.85rem', width: '100%', color: 'var(--text-main)', fontFamily: 'inherit' }} />
            </motion.div>
            <motion.div whileHover={{ translateY: -2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--danger)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}><Star size={16} fill="var(--danger)"/> Top Priorities ({topPriorities.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '100px' }}>
                {topPriorities.length === 0 ? <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No high-priority tasks pending!</span> : topPriorities.map(t => (
                   <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--background)', borderRadius: '4px' }}>
                     <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.title}</span><span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>{t.status}</span>
                   </div>
                ))}
              </div>
            </motion.div>
            <motion.div whileHover={{ translateY: -2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Today's Goal Focus</h3>
              <input type="text" placeholder="What is your most important goal for today?" defaultValue={localStorage.getItem('today_goal')} onChange={(e) => localStorage.setItem('today_goal', e.target.value)} style={{ padding: '0.8rem', border: 'none', background: 'var(--background)', borderRadius: '8px', fontWeight: 500, color: 'var(--text-main)', width: '100%' }} />
            </motion.div>
        </div>

        <motion.div whileHover={{ translateY: -5 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <button onClick={requestNotification} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }} title="Send Hydration Reminder"><Bell size={18} /></button>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Droplet fill="var(--primary)" size={20} /> Water Tracker</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[...Array(8)].map((_, i) => (<motion.div key={i} animate={{ scale: i < water ? 1.1 : 1 }} style={{ color: i < water ? 'var(--primary)' : 'var(--surface-border)' }}><Droplet fill={i < water ? 'var(--primary)' : 'none'} size={28} /></motion.div>))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={() => setWater(Math.max(0, water - 1))} style={{ padding: '0.5rem', borderRadius: '50%' }}><Minus size={16}/></button>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>{water}/8</span>
            <button className="btn-primary" onClick={() => { setWater(Math.min(8, water + 1)); if(water<8) requestNotification(); }} style={{ padding: '0.5rem', borderRadius: '50%' }}><Plus size={16}/></button>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        <motion.div className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h4 style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Daily Schedule Blueprint</h4>
          <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', paddingRight: '0.5rem' }}>
            <PlannerBlock title="Emails" placeholder="Inbox zero..." />
            <PlannerBlock title="Meeting" />
            <PlannerBlock title="Appointment" />
            <PlannerBlock title="Breakfast" />
            <PlannerBlock title="1st Half Plan" />
            <PlannerBlock title="Lunch" />
            <PlannerBlock title="2nd Half Plan" />
            <PlannerBlock title="Dinner" />
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '400px' }}>
          <motion.div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Progress Pipeline</h4>
            <ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={5}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip /><Legend verticalAlign="bottom" height={24}/></PieChart></ResponsiveContainer>
          </motion.div>

          <motion.div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Categories Breakdown</h4>
            <ResponsiveContainer width="100%" height="90%"><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><RechartsTooltip cursor={{ fill: 'transparent' }}/><Legend verticalAlign="bottom" height={24}/><Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} /><Bar dataKey="done" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
