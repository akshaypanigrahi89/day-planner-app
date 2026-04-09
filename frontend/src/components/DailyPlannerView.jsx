import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Snowflake, CloudLightning, Droplet, Bell } from 'lucide-react';

export default function DailyPlannerView() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Reusable blocks
  const [data, setData] = useState(JSON.parse(localStorage.getItem('daily_planner_data')) || {});
  
  const updateData = (key, value) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    localStorage.setItem('daily_planner_data', JSON.stringify(newData));
  };

  const PlannerBox = ({ title, children, gridArea, bg = 'white', color = 'var(--text-main)' }) => (
    <motion.div whileHover={{ scale: 1.01, boxShadow: '0 15px 30px rgba(0,0,0,0.05)', translateY: -2 }} style={{ gridArea, background: bg, padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', border: '1px solid var(--surface-border)' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.4rem', textAlign: 'center' }}>{title}</h3>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </motion.div>
  );

  const Lines = ({ count, modelKey }) => (
    <textarea 
      defaultValue={data[modelKey] || ''} 
      onChange={(e) => updateData(modelKey, e.target.value)}
      style={{ flex: 1, width: '100%', background: 'transparent', resize: 'vertical', minHeight: `${count * 25}px`, lineHeight: '25px', fontSize: '0.9rem', color: 'var(--text-main)', border: 'none', backgroundImage: 'linear-gradient(transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px)', backgroundSize: '100% 25px', fontFamily: 'inherit' }}
    />
  );

  const ListInput = ({ count, modelKey }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {[...Array(count)].map((_, i) => (
        <input key={i} type="text" defaultValue={data[`${modelKey}_${i}`] || ''} onChange={(e) => updateData(`${modelKey}_${i}`, e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'transparent', padding: '0.4rem 0', fontSize: '0.9rem', outline: 'none' }} />
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 4rem', display: 'flex', flexDirection: 'column', gap: '2rem', minHeight: '100%', background: '#f8fafc' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--surface-border)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 300, color: 'var(--text-main)', margin: 0, letterSpacing: '2px', fontFamily: 'serif' }}>DAILY PLANNER</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <span style={{ fontWeight: 600, fontSize: '1.2rem', letterSpacing: '1px' }}>DATE:</span>
               <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', background: 'white', fontSize: '1.1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)' }}>
              {['S','M','T','W','T','F','S'].map((day, i) => (
                <div key={i} style={{ width: '25px', height: '25px', borderRadius: '50%', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: new Date(date).getDay() === i ? 800 : 400, background: new Date(date).getDay() === i ? 'var(--primary)' : 'transparent', color: new Date(date).getDay() === i ? 'white' : 'inherit' }}>{day}</div>
              ))}
            </div>
        </div>
      </div>

      <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'minmax(150px, auto)',
          gap: '1.5rem'
      }}>
        
        {/* ROW 1 */}
        <PlannerBox title="Mood">
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', cursor: 'pointer' }}>
             {['😄', '🙂', '😐', '🙁', '😢'].map((m) => (
                <span key={m} style={{ fontSize: '1.5rem', opacity: data.mood === m ? 1 : 0.3, filter: data.mood === m ? 'drop-shadow(0 0 5px rgba(0,0,0,0.2))' : 'none' }} onClick={() => updateData('mood', m)}>{m}</span>
             ))}
           </div>
           <div style={{ flex: 1, marginTop: '1rem', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 0, left: '-10px', fontSize: '3rem', color: 'rgba(0,0,0,0.03)', zIndex: 0 }}>"</span>
              <Lines count={2} modelKey="mood_notes" />
              <span style={{ position: 'absolute', bottom: 0, right: 0, fontSize: '3rem', color: 'rgba(0,0,0,0.03)', zIndex: 0, lineHeight: '0' }}>"</span>
           </div>
        </PlannerBox>
        
        <PlannerBox title="Today's Goals">
           <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'absolute', opacity: 0.05, borderRadius: '50%', border: '10px solid black', width: '100px', height: '100px', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', opacity: 0.05, borderRadius: '50%', border: '10px solid black', width: '60px', height: '60px', pointerEvents: 'none' }}></div>
              <div style={{ position: 'absolute', opacity: 0.05, borderRadius: '50%', background: 'black', width: '20px', height: '20px', pointerEvents: 'none' }}></div>
              <Lines count={4} modelKey="goals" />
           </div>
        </PlannerBox>

        <PlannerBox title="Weather">
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
             {[<Sun/>, <Cloud/>, <CloudRain/>, <Wind/>, <Snowflake/>, <CloudLightning/>].map((Icon, idx) => {
                const wKey = `w_${idx}`;
                return <div key={idx} onClick={() => updateData('weather', idx)} style={{ color: data.weather === idx ? 'var(--primary)' : 'inherit', transform: data.weather === idx ? 'scale(1.2)' : 'none', transition: 'all 0.2s' }}>{Icon}</div>
             })}
           </div>
           <Lines count={2} modelKey="weather_notes" />
        </PlannerBox>

        {/* ROW 2 Col 1: Exercise */}
        <PlannerBox title="Exercise">
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '0.5rem 0' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL MINUTES:</span>
                        <input type="text" defaultValue={data.ex_min} onChange={e=>updateData('ex_min', e.target.value)} style={{ width: '60px', border: 'none', background: 'transparent', textAlign: 'right', outline: 'none' }}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL STEPS:</span>
                        <input type="text" defaultValue={data.ex_steps} onChange={e=>updateData('ex_steps', e.target.value)} style={{ width: '60px', border: 'none', background: 'transparent', textAlign: 'right', outline: 'none' }}/>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Lines count={3} modelKey="exercise_notes" />
            </div>
        </PlannerBox>

        {/* ROW 2 Col 2: Appointments */}
        <div style={{ gridRow: 'span 2' }}>
            <PlannerBox title="Today's Appointment" bg="#fff" color="var(--primary)">
                <div style={{ display: 'flex', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '2px solid rgba(0,0,0,0.1)', paddingBottom: '0.2rem' }}>
                   <div style={{ width: '60px' }}>TIME:</div>
                   <div>EVENT:</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                   {[...Array(10)].map((_, i) => (
                      <div key={i} style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                         <input type="text" defaultValue={data[`app_time_${i}`] || ''} onChange={e=>updateData(`app_time_${i}`, e.target.value)} style={{ width: '60px', border: 'none', background: 'transparent', borderRight: '1px solid rgba(0,0,0,0.05)', padding: '0.4rem', outline: 'none', fontSize: '0.85rem' }} />
                         <input type="text" defaultValue={data[`app_ev_${i}`] || ''} onChange={e=>updateData(`app_ev_${i}`, e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', padding: '0.4rem', outline: 'none', fontSize: '0.85rem' }} />
                      </div>
                   ))}
                </div>
            </PlannerBox>
        </div>

        {/* ROW 2 Col 3: Reminder */}
        <PlannerBox title="Reminder To">
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
               <Bell style={{ position: 'absolute', opacity: 0.03, width: '100px', height: '100px', pointerEvents: 'none' }} />
               <Lines count={5} modelKey="reminder" />
            </div>
        </PlannerBox>

        {/* ROW 3 Col 1: Water */}
        <PlannerBox title="Water Intake">
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 0' }}>
               {[...Array(8)].map((_, i) => (
                  <Droplet 
                     key={i} 
                     onClick={() => updateData('planner_water', i + 1)}
                     fill={data.planner_water > i ? '#60a5fa' : 'transparent'}
                     stroke={data.planner_water > i ? '#3b82f6' : '#cbd5e1'}
                     style={{ cursor: 'pointer', transition: 'all 0.2s', filter: data.planner_water > i ? 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.4))' : 'none' }}
                  />
               ))}
            </div>
        </PlannerBox>

        {/* ROW 3 Col 3: Things To Do */}
        <div style={{ gridRow: 'span 2' }}>
            <PlannerBox title="Things To Get Done Today">
                <ListInput count={14} modelKey="todo" />
            </PlannerBox>
        </div>

        {/* ROW 4 Col 1: Meals */}
        <PlannerBox title="Meal Tracker">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>BREAKFAST:</div>
                  <Lines count={2} modelKey="meal_b"/>
               </div>
               <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>LUNCH:</div>
                  <Lines count={2} modelKey="meal_l"/>
               </div>
               <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>DINNER:</div>
                  <Lines count={2} modelKey="meal_d"/>
               </div>
               <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>SNACKS:</div>
                  <Lines count={2} modelKey="meal_s"/>
               </div>
            </div>
        </PlannerBox>

        {/* ROW 4 Col 2: Calls */}
        <PlannerBox title="To Call Or Email">
            <Lines count={5} modelKey="calls" />
        </PlannerBox>

        {/* ROW 4 Col 3: Money Tracker */}
        <PlannerBox title="Money Tracker">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
               <div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MONEY IN:</div>
                 <input type="text" defaultValue={data.money_in} onChange={e=>updateData('money_in', e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'transparent', outline: 'none' }}/>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>MONEY OUT:</div>
                 <input type="text" defaultValue={data.money_out} onChange={e=>updateData('money_out', e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'transparent', outline: 'none' }}/>
               </div>
               <div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FROM:</div>
                 <input type="text" defaultValue={data.money_from} onChange={e=>updateData('money_from', e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'transparent', outline: 'none' }}/>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>FOR:</div>
                 <input type="text" defaultValue={data.money_for} onChange={e=>updateData('money_for', e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', background: 'transparent', outline: 'none' }}/>
               </div>
            </div>
        </PlannerBox>

        {/* ROW 5 */}
        <PlannerBox title="Today I Am Grateful For">
            <Lines count={6} modelKey="grateful" />
        </PlannerBox>

        <PlannerBox title="Notes">
            <Lines count={6} modelKey="plan_notes" />
        </PlannerBox>

        <PlannerBox title="For Tomorrow">
            <Lines count={6} modelKey="tomorrow" />
        </PlannerBox>

      </div>
    </motion.div>
  );
}
