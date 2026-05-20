import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ITEMS = [
  { dept:'Library',                  note:'No pending dues or borrowed books',      status:'Cleared', pill:'pill-green' },
  { dept:'Accounts / Finance',       note:'Fee paid in full — Spring 2025',         status:'Cleared', pill:'pill-green' },
  { dept:'Sports Department',        note:'Sports equipment return pending',         status:'Pending', pill:'pill-amber' },
  { dept:'Hostel',                   note:'Day scholar — not applicable',            status:'N/A',     pill:'pill-gray'  },
  { dept:'IT Department',            note:'Laptop not returned to IT lab',           status:'Hold',    pill:'pill-red'   },
  { dept:'Department Office',        note:'All academic documents submitted',        status:'Cleared', pill:'pill-green' },
  { dept:'Examinations Office',      note:'No pending exam dues',                   status:'Cleared', pill:'pill-green' },
  { dept:'Student Affairs',          note:'No disciplinary action pending',          status:'Cleared', pill:'pill-green' },
];

export default function Clearance() {
  const { user } = useAuth();
  const pending = ITEMS.filter(i => i.status !== 'Cleared' && i.status !== 'N/A').length;

  return (
    <div>
      <div className="sec-header">Clearance Certificate</div>
      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--text2)', marginBottom:2, fontWeight:600, textTransform:'uppercase' }}>Student</div>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--teal-dark)' }}>{user?.name || 'Ali Raza'}</div>
            <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{user?.regNo} · {user?.program} · {user?.campus}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:800, color: pending === 0 ? 'var(--success)' : 'var(--danger)' }}>
              {pending === 0 ? '✓' : pending}
            </div>
            <span className={`pill ${pending === 0 ? 'pill-green' : 'pill-red'}`}>
              {pending === 0 ? 'All Clear' : `${pending} Items Pending`}
            </span>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Department-wise Clearance Status</div>
        <table className="uni-table">
          <thead><tr><th>#</th><th>Department</th><th>Remarks</th><th>Status</th></tr></thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={i}>
                <td style={{ textAlign:'center', fontWeight:700, color:'var(--teal-dark)' }}>{i+1}</td>
                <td style={{ fontWeight:600 }}>{item.dept}</td>
                <td style={{ color:'var(--text2)', fontSize:12 }}>{item.note}</td>
                <td><span className={`pill ${item.pill}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pending === 0 && (
        <div style={{ background:'var(--success-bg)', border:'1px solid var(--success)', borderRadius:'var(--radius)', padding:'14px 18px', display:'flex', alignItems:'center', gap:12, fontSize:13, color:'var(--success)', fontWeight:600 }}>
          ✅ All departments have cleared you. You may collect your clearance certificate from the Registrar's office.
        </div>
      )}
    </div>
  );
}
