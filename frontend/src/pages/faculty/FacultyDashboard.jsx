// pages/faculty/FacultyDashboard.jsx
import React, { useEffect, useState } from 'react';
import { getFacDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEMO_COURSES = [
  { _id:'c1', code:'ECO400', name:'Business Economics',      section:'BBA 5 A', creditHours:3, facultyName:'Maryam Saleem' },
  { _id:'c2', code:'MKT471', name:'Consumer Behavior',       section:'BBA 5 A', creditHours:3, facultyName:'Maryam Saleem' },
  { _id:'c3', code:'MGT300', name:'Organizational Behavior', section:'BBA 6 B', creditHours:3, facultyName:'Maryam Saleem' },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacDashboard().then(r=>setData(r.data.data)).catch(()=>setData({ courses: DEMO_COURSES, totalStudents:142, pendingMarks:12 })).finally(()=>setLoading(false));
  }, []);

  const d = data || {};
  const courses = d.courses?.length ? d.courses : DEMO_COURSES;

  return (
    <div>
      <div className="metrics">
        <div className="metric"><div className="metric-icon">📚</div><div className="metric-val">{courses.length}</div><div className="metric-lbl">Courses Assigned</div></div>
        <div className="metric"><div className="metric-icon">👥</div><div className="metric-val">{d.totalStudents || 142}</div><div className="metric-lbl">Total Students</div></div>
        <div className="metric"><div className="metric-icon">📝</div><div className="metric-val">{d.pendingMarks || 0}</div><div className="metric-lbl">Marks Uploaded</div></div>
        <div className="metric"><div className="metric-icon">📅</div><div className="metric-val">3</div><div className="metric-lbl">Classes Today</div></div>
      </div>
      <div className="sec-header">My Courses — Spring 2025</div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead><tr><th>Course Code</th><th>Course Name</th><th>Section</th><th>Credit Hours</th><th>Actions</th></tr></thead>
          <tbody>
            {courses.map(c => (
              <tr key={c._id}>
                <td style={{ fontWeight:700, color:'var(--teal-dark)' }}>{c.code}</td>
                <td style={{ fontWeight:500 }}>{c.name}</td>
                <td>{c.section}</td>
                <td style={{ textAlign:'center' }}>{c.creditHours}</td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-sm btn-teal">Mark Attendance</button>
                    <button className="btn btn-sm">Upload Marks</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
