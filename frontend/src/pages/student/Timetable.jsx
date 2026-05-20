import React, { useEffect, useState } from 'react';
import { getTimetable } from '../../services/api';

const COLORS = [
  { bg:'#dbeafe', color:'#1e40af' },
  { bg:'#dcfce7', color:'#166534' },
  { bg:'#fef3c7', color:'#92400e' },
  { bg:'#ede9fe', color:'#4c1d95' },
  { bg:'#fce7f3', color:'#9d174d' },
];

const DEMO_TT = [
  { code:'ECO400', name:'Business Economics',      schedule:[{day:'Monday',startTime:'8:00',room:'LR-1'},{day:'Wednesday',startTime:'8:00',room:'LR-1'}] },
  { code:'MKT471', name:'Consumer Behavior',       schedule:[{day:'Tuesday',startTime:'9:00',room:'LR-2'},{day:'Thursday',startTime:'9:00',room:'LR-2'}] },
  { code:'MGT243', name:'E-Business',              schedule:[{day:'Tuesday',startTime:'10:00',room:'LR-3'},{day:'Thursday',startTime:'10:00',room:'LR-3'}] },
  { code:'MGT300', name:'Organizational Behavior', schedule:[{day:'Monday',startTime:'11:00',room:'LR-1'},{day:'Wednesday',startTime:'11:00',room:'LR-1'}] },
  { code:'MKT477', name:'Service Marketing',       schedule:[{day:'Monday',startTime:'14:00',room:'LR-4'},{day:'Wednesday',startTime:'14:00',room:'LR-4'}] },
];

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const TIMES = ['8:00','9:00','10:00','11:00','12:00','14:00','15:00'];

export default function Timetable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimetable({ semester:'Spring 2025' })
      .then(r => setCourses(r.data.data))
      .catch(() => setCourses(DEMO_TT))
      .finally(() => setLoading(false));
  }, []);

  const data = courses.length ? courses : DEMO_TT;

  // Build lookup: day+time → course
  const lookup = {};
  data.forEach((c, idx) => {
    (c.schedule || []).forEach(s => {
      lookup[`${s.day}-${s.startTime}`] = { ...c, color: COLORS[idx % COLORS.length], room: s.room };
    });
  });

  if (loading) return <div className="empty-state"><span className="spinner" /> Loading…</div>;

  return (
    <div>
      <div className="sec-header">Class Timetable — Spring 2025 · BBA 5-A</div>
      <div className="card">
        <div className="tt-wrap">
          <div className="tt-grid">
            {/* Header row */}
            <div className="tt-head">Time</div>
            {DAYS.map(d => <div key={d} className="tt-head">{d}</div>)}

            {/* Time rows */}
            {TIMES.map(time => (
              <React.Fragment key={time}>
                <div className="tt-time">{time}</div>
                {DAYS.map(day => {
                  const cell = lookup[`${day}-${time}`];
                  return cell ? (
                    <div key={day} className="tt-class" style={{ background: cell.color.bg, color: cell.color.color }}>
                      <div style={{ fontWeight: 700, fontSize: 10 }}>{cell.code}</div>
                      <div style={{ fontSize: 9, marginTop: 2, opacity: .85 }}>{cell.room}</div>
                    </div>
                  ) : (
                    <div key={day} className="tt-empty" />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)' }}>
          {data.map((c, idx) => (
            <span key={c.code} style={{ fontSize:11, background:COLORS[idx%COLORS.length].bg, color:COLORS[idx%COLORS.length].color, padding:'3px 10px', borderRadius:4, fontWeight:600 }}>
              {c.code} — {c.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
