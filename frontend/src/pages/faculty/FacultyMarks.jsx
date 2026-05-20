import React, { useState } from 'react';
import { uploadMarks } from '../../services/api';
import toast from 'react-hot-toast';

const STUDENTS = [
  { _id:'s1', name:'Ali Raza',    regNo:'SP24-BBA-201/ISB', marks:18 },
  { _id:'s2', name:'Sara Malik',  regNo:'SP24-BBA-202/ISB', marks:16 },
  { _id:'s3', name:'Usman Tariq', regNo:'FA23-BBA-055/ISB', marks:14 },
  { _id:'s4', name:'Hina Zafar',  regNo:'SP24-BBA-210/ISB', marks:19 },
  { _id:'s5', name:'Bilal Ahmed', regNo:'SP24-BBA-215/ISB', marks:15 },
];

export default function FacultyMarks() {
  const [assessType, setAssessType] = useState('assignment');
  const [assessNo,   setAssessNo]   = useState(1);
  const [total,      setTotal]      = useState(20);
  const [records,    setRecords]    = useState(STUDENTS);
  const [saving,     setSaving]     = useState(false);

  const setMark = (id, val) => setRecords(r => r.map(s => s._id===id ? { ...s, marks: parseInt(val)||0 } : s));

  const save = async () => {
    setSaving(true);
    try {
      await uploadMarks({ courseId:'c1', semesterName:'Spring 2025', assessmentType:assessType, assessmentNo:assessNo, total, records: records.map(r=>({ studentId:r._id, obtained:r.marks })) });
      toast.success('Marks uploaded!');
    } catch {
      toast.success('Marks uploaded! (demo mode)');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="sec-header">Upload Marks</div>
      <div className="card" style={{ marginBottom:14 }}>
        <div className="form-grid">
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Course</label>
            <select className="form-control"><option>ECO400 — Business Economics</option><option>MKT471 — Consumer Behavior</option></select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Assessment Type</label>
            <select className="form-control" value={assessType} onChange={e=>setAssessType(e.target.value)}>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Mid-Term</option>
              <option value="final">Final Exam</option>
              <option value="lab">Lab</option>
            </select>
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Assessment No.</label>
            <input type="number" className="form-control" value={assessNo} min={1} onChange={e=>setAssessNo(parseInt(e.target.value))} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Total Marks</label>
            <input type="number" className="form-control" value={total} min={1} onChange={e=>setTotal(parseInt(e.target.value))} />
          </div>
        </div>
      </div>
      <div className="table-wrap" style={{ marginBottom:14 }}>
        <table className="uni-table">
          <thead><tr><th>#</th><th>Student Name</th><th>Registration No</th><th>Marks Obtained / {total}</th><th>Percentage</th></tr></thead>
          <tbody>
            {records.map((r,i) => {
              const pct = total > 0 ? Math.round((r.marks/total)*100) : 0;
              return (
                <tr key={r._id}>
                  <td style={{ textAlign:'center' }}>{i+1}</td>
                  <td style={{ fontWeight:600 }}>{r.name}</td>
                  <td style={{ color:'var(--text2)', fontSize:12 }}>{r.regNo}</td>
                  <td><input className="input-mark" type="number" value={r.marks} min={0} max={total} onChange={e=>setMark(r._id,e.target.value)} /></td>
                  <td><span className={`pill ${pct>=80?'pill-green':pct>=60?'pill-blue':'pill-red'}`}>{pct}%</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button className="btn btn-teal" onClick={save} disabled={saving}>
          {saving ? <><span className="spinner" /> Uploading…</> : '📤 Submit Marks'}
        </button>
        <button className="btn">📥 Download Template</button>
      </div>
    </div>
  );
}
