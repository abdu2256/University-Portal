// pages/student/Attendance.jsx
import React, { useEffect, useState } from 'react';
import { getAttendance } from '../../services/api';

const color = p => p >= 80 ? '#16a34a' : p >= 75 ? '#d97706' : '#dc2626';
const pill  = p => p >= 80 ? 'pill-green' : p >= 75 ? 'pill-amber' : 'pill-red';

const DEMO = [
  { course: { code:'ECO400', name:'Business Economics' },       total:30, present:30, absent:0, leave:0, percentage:100 },
  { course: { code:'MKT471', name:'Consumer Behavior' },        total:30, present:30, absent:0, leave:0, percentage:100 },
  { course: { code:'MGT243', name:'E-Business' },               total:30, present:28, absent:2, leave:0, percentage:94  },
  { course: { code:'MGT300', name:'Organizational Behavior' },  total:30, present:30, absent:0, leave:0, percentage:100 },
  { course: { code:'MKT477', name:'Service Marketing' },        total:25, present:22, absent:3, leave:0, percentage:88  },
];

export default function Attendance() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAttendance({ semester:'Spring 2025' }).then(r=>setData(r.data.data)).catch(()=>setData(DEMO)).finally(()=>setLoading(false));
  }, []);

  const rows = data.length ? data : DEMO;

  return (
    <div>
      <div className="sec-header">Attendance Report — Spring 2025</div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead><tr><th>Course Code</th><th>Course Name</th><th>Total Classes</th><th>Present</th><th>Absent</th><th>Leave</th><th>Percentage</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td style={{fontWeight:600,color:'var(--teal-dark)'}}>{r.course.code}</td>
                <td>{r.course.name}</td>
                <td style={{textAlign:'center'}}>{r.total}</td>
                <td style={{textAlign:'center',color:'var(--success)',fontWeight:600}}>{r.present}</td>
                <td style={{textAlign:'center',color:'var(--danger)',fontWeight:600}}>{r.absent}</td>
                <td style={{textAlign:'center',color:'var(--warn)',fontWeight:600}}>{r.leave}</td>
                <td>
                  <div className="att-wrap">
                    <div className="att-bar">
                      <div className="att-fill" style={{width:`${r.percentage}%`,background:color(r.percentage)}}>{r.percentage}%</div>
                    </div>
                  </div>
                </td>
                <td><span className={`pill ${pill(r.percentage)}`}>{r.percentage>=80?'Good':r.percentage>=75?'Warning':'Critical'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card" style={{marginTop:14}}>
        <div className="card-title">Attendance Policy</div>
        <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.7}}>
          <p>• Minimum <strong>80%</strong> attendance is required in each course to appear in final exams.</p>
          <p>• Students with attendance between <strong>75–79%</strong> may apply for relaxation with valid reasons.</p>
          <p>• Students below <strong>75%</strong> attendance will be <strong>de-barred</strong> from final examinations.</p>
        </div>
      </div>
    </div>
  );
}
