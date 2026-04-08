import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Analytics({ tasks }) {
  const cats = {};
  const statCounts = { 'not started': 0, 'in progress': 0, 'completed': 0, 'incomplete': 0 };
  let totalTime = 0;

  tasks.forEach(t => {
    const c = t.category || 'Uncategorized';
    cats[c] = (cats[c] || 0) + 1;
    
    const s = t.status || 'not started';
    statCounts[s] = (statCounts[s] || 0) + 1;
    
    totalTime += (t.time_spent_minutes || 0);
  });

  const pieData = {
    labels: ['Not Started', 'In Progress', 'Completed', 'Incomplete'],
    datasets: [
      {
        data: [
          statCounts['not started'],
          statCounts['in progress'],
          statCounts['completed'],
          statCounts['incomplete']
        ],
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          '#94a3b8', '#f59e0b', '#10b981', '#ef4444'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: Object.keys(cats),
    datasets: [
      {
        label: 'Tasks per Category',
        data: Object.values(cats),
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderColor: '#4f46e5',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: '#f8fafc' } } },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    maintainAspectRatio: false,
  };

  const pieOptions = {
    plugins: { legend: { labels: { color: '#f8fafc' }, position: 'bottom' } },
    maintainAspectRatio: false,
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '2rem' }}>Productivity Insights</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', flex: 1 }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Task Status Distribution</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Volume by Category</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(135deg, var(--secondary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Total Productivity
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
          {Math.floor(totalTime / 60)}h {totalTime % 60}m tracked today! Keep up the great work!
        </p>
      </div>
    </div>
  );
}
