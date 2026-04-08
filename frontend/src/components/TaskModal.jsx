import React, { useState, useEffect } from 'react';

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'not started',
    time_spent_minutes: 0,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        status: task.status || 'not started',
        time_spent_minutes: task.time_spent_minutes || 0,
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target.className.includes('modal-overlay')) onClose(); }}>
      <div className="glass-panel modal-content" style={{ animation: 'slideUp 0.3s ease' }}>
        <h2 style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {task ? 'Edit Agenda Item' : 'New Agenda Item'}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Title *</label>
            <input 
              type="text" 
              required 
              style={{ marginBottom: 0 }}
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea 
              rows="3"
              style={{ marginBottom: 0 }}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</label>
            <input 
              type="text" 
              style={{ marginBottom: 0 }}
              placeholder="e.g. Work, Personal, Meeting"
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ marginBottom: 0 }}>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time Logged (min)</label>
              <input 
                type="number" 
                min="0"
                style={{ marginBottom: 0 }}
                value={formData.time_spent_minutes} 
                onChange={e => setFormData({...formData, time_spent_minutes: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            {task && (
              <button type="button" className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)', marginRight: 'auto' }} onClick={() => onDelete(task.id)}>
                Delete
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
