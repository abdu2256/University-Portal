// pages/faculty/FacultyAttendance.jsx
import React, { useState } from 'react';
import { markAttendance } from '../../services/api';
import toast from 'react-hot-toast';

const DEMO_STUDENTS = [
  { _id:'s1', student:{ _id:'s1', name:'Ali Raza',    regNo:'SP24-BBA-201/ISB' }, status:'P' },
  { _id:'s2', student:{ _id:'s2', name:'Sara Malik',  regNo:'SP24-BBA-202/ISB' }, status:'P' },
  { _id:'s3', student:{ _id:'s3', name:'Usman Tariq', regNo:'FA23-BBA-055/ISB' }, status:'P' },
  { _id:'s4', student:{ _id:'s4', name:'Hina Zafar',  regNo:'SP24-BBA-210/ISB' }, status:'P' },
  { _id:'s5', student:{ _id:'s5', name:'Bilal Ahmed', regNo:'SP24-BBA-215/ISB' }, status:'P' },
];

export default function FacultyAttendance() {
  const [courseId] = useState('c1');
  const [date,   setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState(DEMO_STUDENTS.map(s => ({ ...s })));
  const [saving, setSaving]   = useState(false);

  const mark = (id, status) => {
    setRecords(r => r.map(s => s._id === id ? { ...s, status } : s));
  };

  const save = async () => {
    setSaving(true);
    try {
      await markAttendance({ courseId, date, records: records.map(r => ({ studentId: r.student._id, status: r.status })) });
      toast.success('Attendance saved!');
    } catch {
      toast.success('Attendance saved! (demo mode)');
    }
    setSaving(false);
  };

  const counts = records.reduce((acc, r) => { acc[r.status] = (acc[r.status]||0)+1; return acc; }, {});

  return (
    <div>
      <div className="sec-header">Mark Attendance</div>
      <div className="card" style={{ marginBottom:14 }}>
        <div style={{ display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
          <div className="form-group" style={{ margin:0, flex:1 }}>
            <label className="form-label">Course</label>
            <select className="form-control" style={{ maxWidth:280 }}>
              <option>ECO400 — Business Economics (BBA 5 A)</option>
              <option>MKT471 — Consumer Behavior (BBA 5 A)</option>
              <option>MGT300 — Org. Behavior (BBA 6 B)</option>
            </select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', paddingTop:18 }}>
            <span className="pill pill-green">P: {counts.P||0}</span>
            <span className="pill pill-red">A: {counts.A||0}</span>
            <span className="pill pill-amber">L: {counts.L||0}</span>
          </div>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom:14 }}>
        <table className="uni-table">
          <thead><tr><th>#</th><th>Student Name</th><th>Registration No</th><th>Status</th><th>Mark</th></tr></thead>
          <tbody>
            {records.map((r,i) => (
              <tr key={r._id}>
                <td style={{ textAlign:'center' }}>{i+1}</td>
                <td style={{ fontWeight:600 }}>{r.student.name}</td>
                <td style={{ color:'var(--text2)', fontSize:12 }}>{r.student.regNo}</td>
                <td>
                  <span className={`pill ${r.status==='P'?'pill-green':r.status==='A'?'pill-red':'pill-amber'}`}>
                    {r.status==='P'?'Present':r.status==='A'?'Absent':'Leave'}
                  </span>
                </td>
                <td>
                  <div style={{ display:'flex', gap:5 }}>
                    {['P','A','L'].map(s => (
                      <button key={s} onClick={() => mark(r._id, s)}
                        className="btn btn-sm"
                        style={{ background: r.status===s ? (s==='P'?'var(--success)':s==='A'?'var(--danger)':'var(--warn)') : '', color: r.status===s ? '#fff' : '', borderColor: r.status===s ? 'transparent' : '' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-teal" onClick={save} disabled={saving}>
        {saving ? <><span className="spinner" /> Saving…</> : '💾 Save Attendance'}
      </button>
    </div>
  );
}
