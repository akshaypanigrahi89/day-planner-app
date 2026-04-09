import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Droplet, Plus, Minus, Bell, Star } from 'lucide-react';

export default function DashboardView({ profile }) {
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

  const PlannerBlock = ({ title, placeholder, color, borderColor }) => {
    const blockKey = `planner_block_${title.replace(/\s+/g, '')}`;
    const [text, setText] = useState(localStorage.getItem(blockKey) || "");
    const [isHovered, setIsHovered] = useState(false);
    return (
      <motion.div 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
        animate={{ scale: isHovered ? 1.02 : 1, y: isHovered ? -2 : 0, boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.05)' : 'none' }}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: isHovered ? 'white' : (color || 'var(--background)'), padding: '1rem', borderRadius: '12px', borderLeft: `6px solid ${borderColor || 'var(--primary)'}`, transition: 'background 0.3s' }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</span>
        <textarea value={text} onChange={e => { setText(e.target.value); localStorage.setItem(blockKey, e.target.value) }} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.8)', margin: 0, border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', minHeight: '75px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', color: 'var(--text-main)' }} placeholder={placeholder || `Plan your ${title.toLowerCase()}...\n- Note...`} />
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
           Hi {profile?.full_name?.split(' ')[0] || 'User'}, here is your dashboard
        </h2>
        <div style={{ display: 'flex', gap: '1.5rem', background: 'white', padding: '0.8rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>Total: {currentTasks.length}</span>
          <span style={{ color: 'var(--warning)' }}>Todo: {todo}</span>
          <span style={{ color: 'var(--primary)' }}>Doing: {doing}</span>
          <span style={{ color: 'var(--success)' }}>Done: {done}</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) 2.5fr', gap: '2rem', flex: 1 }}>
        
        {/* BIG LEFT SIDE: Daily Schedule Blueprint */}
        <motion.div whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.15)' }} className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(145deg, #ffffff, #f3f4fa)', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
          <h3 style={{ color: 'var(--primary)', borderBottom: '2px solid rgba(79, 70, 229, 0.1)', paddingBottom: '1rem', marginBottom: '0.5rem', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🗓️ Daily Schedule Blueprint</h3>
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            <PlannerBlock title="Morning Routine" placeholder="Yoga, Coffee..." color="rgba(16, 185, 129, 0.1)" borderColor="#10b981" />
            <PlannerBlock title="Deep Work Focus" placeholder="Top priority task..." color="rgba(79, 70, 229, 0.1)" borderColor="#4f46e5" />
            <PlannerBlock title="Meetings & Calls" placeholder="Team sync, clients..." color="rgba(245, 158, 11, 0.1)" borderColor="#f59e0b" />
            <PlannerBlock title="Admin & Shallow Work" placeholder="Emails, Slack..." color="rgba(236, 72, 153, 0.1)" borderColor="#ec4899" />
            <PlannerBlock title="Evening Review" placeholder="Plan tomorrow..." color="rgba(139, 92, 246, 0.1)" borderColor="#8b5cf6" />
          </div>
        </motion.div>

        {/* RIGHT SIDE: Everything Else */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr 1.5fr', gap: '2rem' }}>
              <motion.div whileHover={{ translateY: -5 }} className="glass-panel" style={{ padding: '2rem', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500 }}>Completion Rate</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {completionRate}%
                </div>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--success)', fontWeight: 600 }}>{done} of {currentTasks.length} tasks completed!</p>
              </motion.div>
              
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: '1rem' }}>
                  <motion.div whileHover={{ translateY: -2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Daily Summary Review</h3>
                    <textarea placeholder="Write a summary..." defaultValue={localStorage.getItem('daily_summary')} onChange={(e) => localStorage.setItem('daily_summary', e.target.value)} style={{ padding: '0.8rem', border: 'none', background: 'var(--background)', borderRadius: '8px', resize: 'vertical', minHeight: '40px', fontSize: '0.85rem', width: '100%', color: 'var(--text-main)', fontFamily: 'inherit' }} />
                  </motion.div>
                  <motion.div whileHover={{ translateY: -2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ color: 'var(--danger)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}><Star size={16} fill="var(--danger)"/> Priorities ({topPriorities.length})</h3>
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
                    <input type="text" placeholder="Most important goal?" defaultValue={localStorage.getItem('today_goal')} onChange={(e) => localStorage.setItem('today_goal', e.target.value)} style={{ padding: '0.8rem', border: 'none', background: 'var(--background)', borderRadius: '8px', fontWeight: 500, color: 'var(--text-main)', width: '100%' }} />
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
              <motion.div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Progress Pipeline</h4>
                <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip /><Legend verticalAlign="bottom" height={24}/></PieChart></ResponsiveContainer>
              </motion.div>

              <motion.div className="glass-panel" style={{ padding: '1.5rem', background: 'white' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>Categories Breakdown</h4>
                <ResponsiveContainer width="100%" height={250}><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><RechartsTooltip cursor={{ fill: 'transparent' }}/><Legend verticalAlign="bottom" height={24}/><Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} /><Bar dataKey="done" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
              </motion.div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
