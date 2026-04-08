import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { Check, X, Play, Square } from 'lucide-react';

const emptyTask = () => {
  const d = new Date();
  return { title: '', category: '', date: d.toISOString().split('T')[0], day: d.toLocaleDateString('en-US',{weekday:'long'}), progress: 0, comment: '', subtasks_str: '', status: 'Todo', priority: 'Medium' };
};

const inputStyle = { margin:0, padding:'0.4rem', border:'1px solid var(--surface-border)', borderRadius:'4px', background:'var(--background)', width:'100%', fontSize:'0.82rem' };

export default function TaskView() {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([emptyTask()]);
  const [editingTask, setEditingTask] = useState(null);
  
  // Custom Feature: Global Pomodoro Timer
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  useEffect(() => {
    let intv;
    if(timerActive) intv = setInterval(() => setTimer(v => v+1), 1000);
    return () => clearInterval(intv);
  }, [timerActive]);

  const fetchTasks = async () => { api.get('/tasks/').then(r => setTasks(r.data)).catch(console.error); };
  useEffect(() => { fetchTasks(); }, []);

  const todoTasks = tasks.filter(t => t.status === 'Todo' && !t.is_reviewed);
  const doingTasks = tasks.filter(t => t.status === 'Doing' && !t.is_reviewed);
  const doneTasks = tasks.filter(t => t.status === 'Done' && !t.is_reviewed);

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const task = tasks.find(t => t.id == e.dataTransfer.getData('taskId'));
    if (task && task.status !== newStatus) {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus, progress: newStatus==='Done'?100:task.progress });
      fetchTasks();
    }
  };

  const syncSheet = async () => {
    const valid = newTasks.filter(t => t.title.trim() !== '');
    if(!valid.length) return;
    const payload = valid.map(t => ({
      ...t, status: t.status||'Todo', priority: t.priority||'Medium', subtasks: t.subtasks_str ? t.subtasks_str.split(',').map(s=>({title:s.trim(), done:false})) : []
    }));
    await api.post('/tasks/bulk', payload);
    setNewTasks([emptyTask()]); fetchTasks();
  };

  const update = (i, f, v) => { const a=[...newTasks]; a[i][f]=v; setNewTasks(a); };
  const getCardVariant = { hidden: { opacity:0, scale:0.95 }, visible: { opacity:1, scale:1 } };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding:'2rem 4rem', display:'flex', flexDirection:'column', gap:'2rem' }}>
      
      {/* Header Log */}
      <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
        <h2 style={{ fontSize:'1.8rem', color:'var(--text-main)' }}>Task Control Center</h2>
        <div style={{ display:'flex', gap:'1.5rem', background:'white', padding:'0.8rem 1.5rem', borderRadius:'30px', boxShadow:'0 4px 15px rgba(0,0,0,0.03)', fontWeight:600 }}>
          <span style={{ color:'var(--text-muted)' }}>Active: {tasks.filter(t=>!t.is_reviewed).length}</span>
          <span style={{ color:'var(--warning)' }}>Todo: {todoTasks.length}</span>
          <span style={{ color:'var(--primary)' }}>Doing: {doingTasks.length}</span>
          <span style={{ color:'var(--success)' }}>Done: {doneTasks.length}</span>
        </div>
        
        {/* Custom Idea: Pomodoro Focus Timer directly on the Task Dashboard to help productivity! */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--text-main)', padding: '0.5rem 1rem', borderRadius: '30px', color: 'white' }}>
           <span style={{ fontWeight: 600 }}>Focus Timer: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</span>
           <button onClick={()=>setTimerActive(!timerActive)} style={{ background:'none', border:'none', color:'white', cursor:'pointer' }}>{timerActive ? <Square size={16}/> : <Play size={16}/>}</button>
           {timer > 0 && !timerActive && <button onClick={()=>setTimer(0)} style={{ background:'none', border:'none', color:'var(--danger)', cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>Reset</button>}
        </div>
        
        <motion.button whileHover={{ scale:1.05 }} onClick={()=>api.post('/tasks/review',{date:new Date().toISOString().split('T')[0]}).then(()=>{alert('Archived!'); fetchTasks();})} className="btn-primary" style={{ backgroundColor:'var(--text-main)', border:'none' }}>End-Day Review</motion.button>
      </div>

      {/* EXACT EXCEL SHEET MAPPING AS REQUESTED */}
      <div className="glass-panel" style={{ padding:'1.5rem', background:'white', overflowX:'auto' }}>
        <h4 style={{ marginBottom:'1rem', color:'var(--text-muted)' }}>Excel Matrix Sync</h4>
        <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left', minWidth:'1100px' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid var(--surface-border)', color:'var(--text-main)', fontSize:'0.85rem' }}>
              <th style={{ padding:'0.5rem' }}>Date</th>
              <th style={{ padding:'0.5rem' }}>Day</th>
              <th style={{ padding:'0.5rem' }}>Task Title</th>
              <th style={{ padding:'0.5rem' }}>Subtask Title</th>
              <th style={{ padding:'0.5rem' }}>Categories</th>
              <th style={{ padding:'0.5rem', minWidth:'120px' }}>% of Completion</th>
              <th style={{ padding:'0.5rem' }}>Comment</th>
              <th style={{ padding:'0.5rem' }}>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {newTasks.map((t, idx) => (
              <tr key={idx} style={{ borderBottom:'1px solid rgba(0,0,0,0.02)' }}>
                <td style={{ padding:'0.5rem 0.2rem' }}>
                  <input type="date" value={t.date} onChange={e=>{ 
                    update(idx, 'date', e.target.value); 
                    if(e.target.value) update(idx, 'day', new Date(e.target.value).toLocaleDateString('en-US',{weekday:'long'}));
                  }} style={inputStyle} />
                </td>
                <td style={{ padding:'0.5rem 0.2rem', fontSize:'0.8rem', color:'var(--text-muted)' }}>{t.day}</td>
                <td style={{ padding:'0.5rem 0.2rem' }}><input placeholder="Target..." value={t.title} onChange={e=>update(idx, 'title', e.target.value)} style={inputStyle} /></td>
                <td style={{ padding:'0.5rem 0.2rem' }}><input placeholder="CSV string" value={t.subtasks_str} onChange={e=>update(idx, 'subtasks_str', e.target.value)} style={inputStyle} /></td>
                <td style={{ padding:'0.5rem 0.2rem' }}><input placeholder="Tags..." value={t.category} onChange={e=>update(idx, 'category', e.target.value)} style={inputStyle} /></td>
                <td style={{ padding:'0.5rem 0.2rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                    <input type="number" min="0" max="100" value={t.progress} onChange={e=>update(idx, 'progress', e.target.value)} style={{...inputStyle, width:'100%'}} />
                    <div style={{ width:'100%', background:'var(--surface-border)', height:'4px', borderRadius:'2px', overflow:'hidden' }}><div style={{ width:`${t.progress}%`, background:'var(--primary)', height:'100%' }} /></div>
                  </div>
                </td>
                <td style={{ padding:'0.5rem 0.2rem' }}><input placeholder="Notes..." value={t.comment} onChange={e=>update(idx, 'comment', e.target.value)} style={inputStyle} /></td>
                <td style={{ padding:'0.5rem 0.2rem' }}>
                  <select value={t.status} onChange={e=>update(idx,'status',e.target.value)} style={inputStyle}><option>Todo</option><option>Doing</option><option>Done</option></select>
                </td>
                <td style={{ padding:'0.5rem 0.2rem', textAlign:'center' }}>
                  <button onClick={()=>{ if(newTasks.length>1) setNewTasks(newTasks.filter((_,i)=>i!==idx)) }} style={{ background:'none', border:'none', color:'var(--danger)', cursor:'pointer' }}><X size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
          <button className="btn-secondary" onClick={()=>setNewTasks([...newTasks, emptyTask()])} style={{ background:'var(--background)' }}>+ Expand Excel Sheet</button>
          <button className="btn-primary" onClick={syncSheet}>Sync to Todo Kanban</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem', flex:1 }}>
        <div className="kanban-column" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e, 'Todo')}>
          <h3 style={{ color:'var(--warning)', borderBottom:'2px solid rgba(245,158,11,0.2)', paddingBottom:'0.5rem', marginBottom:'1rem' }}>Todo <span style={{ opacity:0.5, fontSize:'0.8em', float:'right' }}>{todoTasks.length}</span></h3>
          {todoTasks.map(t => (
            <motion.div key={t.id} variants={getCardVariant} initial="hidden" animate="visible" whileHover={{ y:-4, boxShadow:'0 10px 20px rgba(0,0,0,0.06)' }} className="task-item" draggable onDragStart={e => e.dataTransfer.setData('taskId', t.id)} onClick={() => setEditingTask(t)} style={{ display:'flex', flexDirection:'column', gap:'0.5rem', cursor:'grab' }}>
              <div style={{ display:'flex', justifyContent:'space-between', width:'100%' }}><strong style={{ color:'var(--text-main)' }}>{t.title}</strong></div>
              <div style={{ display:'flex', gap:'0.5rem', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', background:'var(--background)', color:'var(--text-muted)' }}>{t.category||'General'}</span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{t.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="kanban-column" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e, 'Doing')}>
          <h3 style={{ color:'var(--primary)', borderBottom:'2px solid rgba(79,70,229,0.2)', paddingBottom:'0.5rem', marginBottom:'1rem' }}>Doing <span style={{ opacity:0.5, fontSize:'0.8em', float:'right' }}>{doingTasks.length}</span></h3>
          {doingTasks.map(t => (
            <motion.div key={t.id} variants={getCardVariant} initial="hidden" animate="visible" whileHover={{ y:-4, boxShadow:'0 10px 20px rgba(0,0,0,0.06)' }} className="task-item" draggable onDragStart={e => e.dataTransfer.setData('taskId', t.id)} onClick={() => setEditingTask(t)} style={{ display:'flex', flexDirection:'column', gap:'0.5rem', borderLeft:'4px solid var(--primary)', cursor:'grab' }}>
              <div style={{ display:'flex', justifyContent:'space-between', width:'100%' }}><strong style={{ color:'var(--text-main)' }}>{t.title}</strong></div>
              <div style={{ display:'flex', gap:'0.5rem', width:'100%', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.75rem', padding:'0.2rem 0.5rem', background:'var(--background)', color:'var(--text-muted)' }}>{t.category||'General'}</span>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', width:'100%', paddingLeft:'1rem' }}>
                   <span style={{ fontSize:'0.7rem', color:'var(--primary)', fontWeight:600 }}>{t.progress}%</span>
                   <div style={{ width:'100%', background:'var(--surface-border)', height:'4px', borderRadius:'2px', overflow:'hidden' }}><div style={{ width:`${t.progress}%`, background:'var(--primary)', height:'100%' }} /></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="kanban-column" onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e, 'Done')}>
          <h3 style={{ color:'var(--success)', borderBottom:'2px solid rgba(16,185,129,0.2)', paddingBottom:'0.5rem', marginBottom:'1rem' }}>Done <span style={{ opacity:0.5, fontSize:'0.8em', float:'right' }}>{doneTasks.length}</span></h3>
          {doneTasks.map(t => (
            <motion.div key={t.id} variants={getCardVariant} initial="hidden" animate="visible" whileHover={{ y:-4, boxShadow:'0 10px 20px rgba(0,0,0,0.06)' }} className="task-item" draggable onDragStart={e => e.dataTransfer.setData('taskId', t.id)} onClick={() => setEditingTask(t)} style={{ opacity: 0.6, display:'flex', gap:'1rem', alignItems:'center', cursor:'grab' }}>
              <div style={{ background:'var(--success)', borderRadius:'50%', padding:'0.2rem', color:'white', alignSelf:'flex-start', marginTop:'0.2rem' }}><Check size={14} strokeWidth={3} /></div>
              <div style={{ display:'flex', flexDirection:'column' }}>
                <strong style={{ fontSize:'1.1rem', textDecoration:'line-through', color:'var(--text-muted)' }}>{t.title}</strong>
                <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{t.comment}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {editingTask && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="glass-panel modal-content" style={{ animation:'slideUp 0.3s ease', maxWidth:'600px' }}>
            <h2 style={{ marginBottom:'1.5rem', color:'var(--text-main)' }}>Edit & Reset to Todo</h2>
            <form onSubmit={async e => { 
                e.preventDefault(); 
                const d=new FormData(e.target); 
                const subStr=d.get('subtasks_str'); 
                const data={ title:d.get('title'), category:d.get('category'), comment:d.get('comment'), priority:d.get('priority')||'Medium', date:d.get('date'), progress:parseInt(d.get('progress'))||0, status:'Todo', subtasks: subStr?subStr.split(',').map(s=>({title:s.trim(),done:false})):[] };
                await api.put(`/tasks/${editingTask.id}`, data);
                setEditingTask(null); fetchTasks();
              }} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <input name="title" defaultValue={editingTask.title} placeholder="Task title" required />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div><label style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Date</label><input type="date" name="date" defaultValue={editingTask.date} /></div>
                <div><label style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Category</label><input name="category" defaultValue={editingTask.category} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'1rem', alignItems:'center' }}>
                 <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
                    <label style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Subtasks (CSV)</label>
                    <input name="subtasks_str" defaultValue={(editingTask.subtasks || []).map(s=>s.title).join(', ')} />
                 </div>
                 <div>
                    <label style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Progress %</label>
                    <input type="number" name="progress" min="0" max="100" defaultValue={editingTask.progress} />
                 </div>
              </div>
              <textarea name="comment" placeholder="Add comments..." defaultValue={editingTask.comment} rows={3} style={{ resize:'none' }} />
              <div style={{ display:'flex', justifyContent:'flex-end', gap:'1rem', marginTop:'1rem' }}>
                <button type="button" className="btn-secondary" style={{ color:'var(--danger)', marginRight:'auto' }} onClick={() => { api.delete(`/tasks/${editingTask.id}`); setEditingTask(null); fetchTasks(); }}>Delete</button>
                <button type="button" className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Update & Move to Todo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
