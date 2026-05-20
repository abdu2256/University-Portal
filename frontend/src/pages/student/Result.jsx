// pages/student/Result.jsx
import React, { useEffect, useState } from 'react';
import { getResult } from '../../services/api';

const DEMO = [
  { semester:'Spring 2025', gpa:'3.71', creditHours:15, courses:[
    { course:{code:'ECO400',name:'Business Economics',creditHours:3}, grade:'A',  gradePoints:4.0 },
    { course:{code:'MKT471',name:'Consumer Behavior',creditHours:3},  grade:'A-', gradePoints:3.7 },
    { course:{code:'MGT243',name:'E-Business',creditHours:3},         grade:'A',  gradePoints:4.0 },
    { course:{code:'MGT300',name:'Org. Behavior',creditHours:3},      grade:'A',  gradePoints:4.0 },
    { course:{code:'MKT477',name:'Service Marketing',creditHours:3},  grade:'B+', gradePoints:3.3 },
  ]},
  { semester:'Fall 2024', gpa:'3.65', creditHours:12, courses:[
    { course:{code:'MGT201',name:'Principles of Mgmt',creditHours:3}, grade:'A',  gradePoints:4.0 },
    { course:{code:'MKT301',name:'Marketing Mgmt',creditHours:3},     grade:'A-', gradePoints:3.7 },
    { course:{code:'ECO301',name:'Microeconomics',creditHours:3},     grade:'B+', gradePoints:3.3 },
    { course:{code:'FIN301',name:'Business Finance',creditHours:3},   grade:'A',  gradePoints:4.0 },
  ]},
];
const gradeColor = g => g?.startsWith('A') ? 'var(--success)' : g?.startsWith('B') ? '#2563eb' : 'var(--warn)';

export default function Result() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getResult().then(r=>setData(r.data.data)).catch(()=>setData(DEMO)).finally(()=>setLoading(false));
  }, []);
  const rows = data.length ? data : DEMO;
  return (
    <div>
      <div className="sec-header">Result Card — All Semesters</div>
      {rows.map((sem,i)=>(
        <div key={i} style={{marginBottom:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,padding:'8px 14px',background:'var(--teal-light)',borderRadius:'var(--radius)',border:'1px solid var(--teal-border)'}}>
            <span style={{fontWeight:700,color:'var(--teal-dark)',fontSize:14}}>{sem.semester}</span>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:12,color:'var(--text2)'}}>Credit Hours: <b>{sem.creditHours}</b></span>
              <span style={{fontSize:12,color:'var(--text2)'}}>Semester GPA:</span>
              <span className="pill pill-teal" style={{fontSize:12}}>{sem.gpa}</span>
            </div>
          </div>
          <div className="table-wrap">
            <table className="uni-table">
              <thead><tr><th>Course Code</th><th>Course Name</th><th>Cr Hrs</th><th>Grade</th><th>Grade Points</th></tr></thead>
              <tbody>
                {sem.courses.map((c,j)=>(
                  <tr key={j}>
                    <td style={{fontWeight:600,color:'var(--teal-dark)'}}>{c.course.code}</td>
                    <td>{c.course.name}</td>
                    <td style={{textAlign:'center'}}>{c.course.creditHours}</td>
                    <td style={{textAlign:'center',fontWeight:700,color:gradeColor(c.grade)}}>{c.grade}</td>
                    <td style={{textAlign:'center'}}>{c.gradePoints?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
