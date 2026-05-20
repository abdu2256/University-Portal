// pages/student/APS.jsx
import React, { useEffect, useState } from 'react';
import { getAPS } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEMO = { cgpa:3.71, completedCreditHours:75, totalCreditHours:90, requiredCreditHours:130 };

const Bar = ({ label, value, total, color }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
      <span style={{ fontWeight:500 }}>{label}</span>
      <span style={{ color:'var(--teal-dark)', fontWeight:600 }}>{value} / {total} completed</span>
    </div>
    <div style={{ height:14, background:'#e5e7eb', borderRadius:99, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${Math.min((value/total)*100,100)}%`, background: color || 'var(--teal)', borderRadius:99, transition:'width .5s' }} />
    </div>
  </div>
);

export default function APS() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAPS().then(r=>setData(r.data.data)).catch(()=>setData(DEMO)).finally(()=>setLoading(false)); }, []);
  const d = data || DEMO;

  return (
    <div>
      <div className="sec-header">Academic Progress Sheet (APS)</div>
      <div className="metrics" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        <div className="metric"><div className="metric-icon">🏆</div><div className="metric-val">{d.cgpa||user?.cgpa||'3.71'}</div><div className="metric-lbl">CGPA</div></div>
        <div className="metric"><div className="metric-icon">📚</div><div className="metric-val">{d.completedCreditHours}</div><div className="metric-lbl">Credit Hours Completed</div></div>
        <div className="metric"><div className="metric-icon">🎯</div><div className="metric-val">{d.requiredCreditHours - d.completedCreditHours}</div><div className="metric-lbl">Credit Hours Remaining</div></div>
      </div>
      <div className="card">
        <div className="card-title">Degree Completion Progress</div>
        <Bar label="Core Courses"     value={18} total={24}  color="#0f7d68" />
        <Bar label="Elective Courses" value={6}  total={12}  color="#1d9e75" />
        <Bar label="Lab / Practical"  value={4}  total={6}   color="#0d6e5a" />
        <Bar label="Total Credit Hours" value={d.completedCreditHours} total={d.requiredCreditHours} color="var(--teal)" />
      </div>
      <div className="card">
        <div className="card-title">Semester-wise GPA Trend</div>
        <table className="uni-table">
          <thead><tr><th>Semester</th><th>Credit Hours</th><th>GPA</th><th>Status</th></tr></thead>
          <tbody>
            {[['Spring 2025',15,'3.71','In Progress'],['Fall 2024',12,'3.65','Completed'],['Spring 2024',15,'3.58','Completed'],['Fall 2023',12,'3.45','Completed'],['Spring 2023',15,'3.30','Completed']].map(([s,c,g,st])=>(
              <tr key={s}>
                <td style={{ fontWeight:600 }}>{s}</td>
                <td style={{ textAlign:'center' }}>{c}</td>
                <td style={{ textAlign:'center', fontWeight:700, color:'var(--teal-dark)' }}>{g}</td>
                <td><span className={`pill ${st==='In Progress'?'pill-blue':'pill-green'}`}>{st}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
