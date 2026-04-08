import React, { useState, useEffect } from 'react';
import { LogOut, Plus, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import api from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingTask, setEditingTask] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  useEffect(() => { 
    fetchTasks();
    api.get('/auth/me').then(res => setProfile(res.data)).catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const currentTasks = tasks.filter(t => (t.target_date || new Date().toISOString().split('T')[0]) === selectedDate);
  const backlogTasks = currentTasks.filter(t => t.time_block === 'Backlog' || !t.time_block);
  const morningTasks = currentTasks.filter(t => t.time_block === 'Morning');
  const afternoonTasks = currentTasks.filter(t => t.time_block === 'Afternoon');
  const eveningTasks = currentTasks.filter(t => t.time_block === 'Evening');

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleDrop = async (e, newBlock) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === parseInt(taskId));
    if (task && task.time_block !== newBlock) {
      try {
        await api.put(`/tasks/${task.id}`, { ...task, time_block: newBlock });
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleComplete = async (e, task) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'not started' : 'completed';
    try {
      await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      time_block: formData.get('time_block'),
      target_date: formData.get('target_date'),
      time_spent_minutes: parseInt(formData.get('time_spent_minutes')) || 0
    };
    
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, data);
      } else {
        await api.post('/tasks/', data);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Focus graph on completed vs incomplete planned tasks
  const completedCount = currentTasks.filter(t => t.status === 'completed').length;
  const pendingCount = currentTasks.length - completedCount;

  const graphData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      label: 'Day Progress',
      data: [completedCount, pendingCount],
      backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)'],
      borderRadius: 4,
    }]
  };
  const graphOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { grid: { display: false } } }
  };

  const renderTask = (t) => {
    const isCompleted = t.status === 'completed';
    return (
      <div key={t.id} className="task-item" draggable onDragStart={e => handleDragStart(e, t)} onClick={() => { setEditingTask(t); setIsModalOpen(true); }} style={{ opacity: isCompleted ? 0.6 : 1, display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <button onClick={(e) => handleToggleComplete(e, t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', color: isCompleted ? 'var(--success)' : 'var(--text-muted)' }}>
          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', textDecoration: isCompleted ? 'line-through' : 'none' }}>{t.title}</h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.priority} • {t.category || 'General'}</span>
            {t.time_spent_minutes > 0 && <span>{t.time_spent_minutes}m</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <div className="glass-panel sidebar" style={{ border: 'none', background: 'white', boxShadow: '1px 0 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          Hi {profile?.full_name?.split(' ')[0] || 'User'},<br/><span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>here is your dashboard.</span>
        </h2>
        
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedDate} Summary</h4>
          <div style={{ height: '120px' }}>
            <Bar data={graphData} options={graphOptions} />
          </div>
        </div>

        <button className="btn-secondary" onClick={handleLogout} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <div className="date-selector">
            <button onClick={() => changeDate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={20}/></button>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              style={{ border: 'none', background: 'transparent', marginBottom: 0, padding: 0, fontWeight: 600, color: 'var(--text-main)', width: 'auto' }}
            />
            <button onClick={() => changeDate(1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronRight size={20}/></button>
          </div>
          
          <button className="btn-primary" onClick={() => { setEditingTask(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Schedule Task
          </button>
        </div>

        {/* Kanban Board - Time Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))', gap: '1.5rem', height: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>
          
          <div className="kanban-column" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'Backlog')}>
            <h3 style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>Unscheduled <span style={{opacity: 0.5}}>{backlogTasks.length}</span></h3>
            {backlogTasks.map(renderTask)}
          </div>
          
          <div className="kanban-column" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'Morning')}>
            <h3 style={{ color: 'var(--warning)', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.5rem' }}>Morning <span style={{opacity: 0.5}}>{morningTasks.length}</span></h3>
            {morningTasks.map(renderTask)}
          </div>

          <div className="kanban-column" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'Afternoon')}>
            <h3 style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(79, 70, 229, 0.2)', paddingBottom: '0.5rem' }}>Afternoon <span style={{opacity: 0.5}}>{afternoonTasks.length}</span></h3>
            {afternoonTasks.map(renderTask)}
          </div>

          <div className="kanban-column" onDragOver={e => e.preventDefault()} onDrop={e => handleDrop(e, 'Evening')}>
            <h3 style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(139, 92, 246, 0.2)', paddingBottom: '0.5rem' }}>Evening <span style={{opacity: 0.5}}>{eveningTasks.length}</span></h3>
            {eveningTasks.map(renderTask)}
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={e => { if(e.target.className.includes('modal')) setIsModalOpen(false); }}>
          <div className="glass-panel modal-content" style={{ animation: 'slideUp 0.3s ease' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSaveTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input name="title" type="text" placeholder="Task Title" defaultValue={editingTask?.title || ''} required style={{ marginBottom: 0 }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Date</label>
                  <input name="target_date" type="date" defaultValue={editingTask?.target_date || selectedDate} required style={{ marginBottom: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time Block</label>
                  <select name="time_block" defaultValue={editingTask?.time_block || 'Backlog'} style={{ marginBottom: 0 }}>
                    <option value="Backlog">Unscheduled / Backlog</option>
                    <option value="Morning">Morning Planner</option>
                    <option value="Afternoon">Afternoon Deep Work</option>
                    <option value="Evening">Evening Wind Down</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label>
                  <input name="category" type="text" placeholder="Work, Home, etc." defaultValue={editingTask?.category || ''} style={{ marginBottom: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Priority</label>
                  <select name="priority" defaultValue={editingTask?.priority || 'Medium'} style={{ marginBottom: 0 }}>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completion Status</label>
                  <select name="status" defaultValue={editingTask?.status || 'not started'} style={{ marginBottom: 0 }}>
                    <option value="not started">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duration (minutes)</label>
                  <input type="number" name="time_spent_minutes" placeholder="Mins" defaultValue={editingTask?.time_spent_minutes || 0} min="0" style={{ marginBottom: 0 }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                {editingTask && (
                  <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', marginRight: 'auto' }} onClick={() => handleDeleteTask(editingTask.id)}>Delete Task</button>
                )}
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save to Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
