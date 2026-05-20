// pages/student/FYP.jsx
import React, { useEffect, useState } from 'react';
import { getFYP } from '../../services/api';

const DEMO = {
  title:'AI-Powered Supply Chain Management System',
  supervisor:'Dr. Sana Mirza', coSupervisor:'Dr. Umar Farooq',
  fypId:'FYP-2025-BBA-042', status:'in_progress',
  milestones:[
    { name:'Proposal submission',  dueDate:'Oct 15, 2024', status:'Completed'   },
    { name:'Literature review',    dueDate:'Nov 30, 2024', status:'Completed'   },
    { name:'System design',        dueDate:'Dec 30, 2024', status:'In progress' },
    { name:'Development phase',    dueDate:'Feb 28, 2025', status:'Pending'     },
    { name:'Final defense',        dueDate:'Apr 15, 2025', status:'Pending'     },
  ],
};

export default function FYP() {
  const [fyp, setFyp]       = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getFYP().then(r=>setFyp(r.data.data||DEMO)).catch(()=>setFyp(DEMO)).finally(()=>setLoading(false)); }, []);
  const data = fyp || DEMO;

  return (
    <div>
      <div className="sec-header">Final Year Project (FYP)</div>
      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{data.title}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginBottom:4 }}>Supervisor: <strong>{data.supervisor}</strong> · Co-Supervisor: <strong>{data.coSupervisor}</strong></div>
            <div style={{ fontSize:11, color:'var(--text2)' }}>FYP ID: <code>{data.fypId}</code></div>
          </div>
          <span className={`pill ${data.status==='completed'?'pill-green':data.status==='in_progress'?'pill-blue':'pill-amber'}`} style={{ fontSize:12 }}>
            {data.status?.replace('_',' ')}
          </span>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Project Milestones</div>
        <table className="uni-table">
          <thead><tr><th>#</th><th>Milestone</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {data.milestones?.map((m,i)=>(
              <tr key={i}>
                <td style={{ textAlign:'center', fontWeight:700, color:'var(--teal-dark)' }}>{i+1}</td>
                <td style={{ fontWeight:500 }}>{m.name}</td>
                <td style={{ color:'var(--text2)' }}>{m.dueDate}</td>
                <td><span className={`pill ${m.status==='Completed'?'pill-green':m.status==='In progress'?'pill-blue':'pill-gray'}`}>{m.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
