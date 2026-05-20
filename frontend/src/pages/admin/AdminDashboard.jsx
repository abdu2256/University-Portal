import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/api';

const DEMO = { students:3842, faculty:187, courses:241, enrollments:9621, feesPaid:3412,
  recentStudents:[
    { name:'Ali Raza',    regNo:'SP24-BBA-201/ISB', program:'BBA', semester:5 },
    { name:'Sara Malik',  regNo:'SP24-BBA-202/ISB', program:'BBA', semester:5 },
    { name:'Ahmed Khan',  regNo:'SP21-BCS-042/ISB', program:'BSCS',semester:7 },
    { name:'Fatima Noor', regNo:'FA22-BCS-089/ISB', program:'BSCS',semester:5 },
    { name:'Usman Tariq', regNo:'FA23-BBA-055/ISB', program:'BBA', semester:3 },
  ]
};

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAdminStats().then(r=>setData(r.data.data)).catch(()=>setData(DEMO)).finally(()=>setLoading(false)); }, []);
  const d = data || DEMO;

  return (
    <div>
      <div className="metrics">
        <div className="metric"><div className="metric-icon">👥</div><div className="metric-val">{d.students?.toLocaleString()}</div><div className="metric-lbl">Total Students</div></div>
        <div className="metric"><div className="metric-icon">🎓</div><div className="metric-val">{d.faculty}</div><div className="metric-lbl">Faculty Members</div></div>
        <div className="metric"><div className="metric-icon">📚</div><div className="metric-val">{d.courses}</div><div className="metric-lbl">Active Courses</div></div>
        <div className="metric"><div className="metric-icon">💳</div><div className="metric-val">{d.feesPaid?.toLocaleString()}</div><div className="metric-lbl">Fees Paid</div></div>
      </div>
      <div className="sec-header">Department Overview</div>
      <div className="table-wrap" style={{ marginBottom:16 }}>
        <table className="uni-table">
          <thead><tr><th>Department</th><th>Students</th><th>Faculty</th><th>Courses</th><th>Avg Attendance</th></tr></thead>
          <tbody>
            {[['CS & IT',1240,48,78,83],['Business Admin',940,41,61,85],['Electrical Eng',680,32,52,79],['Civil Eng',420,28,38,81],['Mathematics',340,22,32,88],['Physics',222,16,20,82]].map(([dept,s,f,c,att])=>(
              <tr key={dept}>
                <td style={{ fontWeight:600 }}>{dept}</td>
                <td>{s.toLocaleString()}</td><td>{f}</td><td>{c}</td>
                <td>
                  <div className="att-wrap">
                    <div className="att-bar"><div className="att-fill" style={{ width:`${att}%`, background:att>=85?'var(--success)':'var(--teal)' }}>{att}%</div></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sec-header">Recently Added Students</div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead><tr><th>Name</th><th>Reg No</th><th>Program</th><th>Semester</th></tr></thead>
          <tbody>
            {(d.recentStudents||[]).map((s,i)=>(
              <tr key={i}><td style={{ fontWeight:600 }}>{s.name}</td><td style={{ fontSize:12, color:'var(--text2)' }}>{s.regNo}</td><td>{s.program}</td><td style={{ textAlign:'center' }}>{s.semester}th</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
