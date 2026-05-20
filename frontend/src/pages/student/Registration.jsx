// pages/student/Registration.jsx
import React, { useEffect, useState } from 'react';
import { getAvailCourses, enrollCourse } from '../../services/api';
import toast from 'react-hot-toast';

const DEMO = [
  { _id:'1', code:'MGT501', name:'Strategic Management', creditHours:3, facultyName:'Dr. Ahmed Saeed',    totalSeats:28, semesterName:'Fall 2025', prereq:'MGT300', alreadyEnrolled:false },
  { _id:'2', code:'MKT502', name:'Digital Marketing',    creditHours:3, facultyName:'Ms. Nadia Iqbal',    totalSeats:32, semesterName:'Fall 2025', prereq:'MKT471', alreadyEnrolled:false },
  { _id:'3', code:'ECO502', name:'Managerial Economics', creditHours:3, facultyName:'Dr. Asif Mehmood',   totalSeats:25, semesterName:'Fall 2025', prereq:'ECO400', alreadyEnrolled:false },
  { _id:'4', code:'FIN401', name:'Financial Management', creditHours:3, facultyName:'Dr. Bilal Khan',     totalSeats:30, semesterName:'Fall 2025', prereq:'—',      alreadyEnrolled:false },
  { _id:'5', code:'HU401',  name:'Technical Writing',    creditHours:2, facultyName:'Ms. Rabia Noor',     totalSeats:40, semesterName:'Fall 2025', prereq:'—',      alreadyEnrolled:false },
  { _id:'6', code:'MGT490', name:'Business Research',    creditHours:3, facultyName:'Dr. Sara Ahmed',     totalSeats:20, semesterName:'Fall 2025', prereq:'MGT243', alreadyEnrolled:false },
];

export default function Registration() {
  const [courses, setCourses] = useState([]);
  const [added,   setAdded]   = useState({});
  const [totalCr, setTotalCr] = useState(0);

  useEffect(() => {
    getAvailCourses({ semester:'Fall 2025' })
      .then(r => setCourses(r.data.data))
      .catch(() => setCourses(DEMO));
  }, []);

  const handleAdd = async (course) => {
    if (totalCr + course.creditHours > 18) { toast.error('Max 18 credit hours allowed'); return; }
    try {
      await enrollCourse({ courseId: course._id, semesterName: 'Fall 2025' });
      setAdded(a => ({ ...a, [course._id]: true }));
      setTotalCr(t => t + course.creditHours);
      toast.success(`${course.code} added!`);
    } catch (e) {
      if (e.response?.data?.message === 'Already enrolled') {
        setAdded(a => ({ ...a, [course._id]: true }));
      } else {
        // Demo mode — just mark as added
        setAdded(a => ({ ...a, [course._id]: true }));
        setTotalCr(t => t + course.creditHours);
        toast.success(`${course.code} added!`);
      }
    }
  };

  return (
    <div>
      <div className="sec-header">Course Registration — Fall 2025</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <span style={{ fontSize:13, color:'var(--text2)' }}>
          Max 18 credit hours · Registered: <strong style={{ color:'var(--teal-dark)' }}>{totalCr} cr hrs</strong>
        </span>
        <span className="pill pill-amber">Registration Period: Dec 1–15, 2025</span>
      </div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead>
            <tr><th>Code</th><th>Course Name</th><th>Cr Hrs</th><th>Instructor</th><th>Seats</th><th>Pre-req</th><th>Action</th></tr>
          </thead>
          <tbody>
            {(courses.length ? courses : DEMO).map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight:700, color:'var(--teal-dark)' }}>{c.code}</td>
                <td style={{ fontWeight:500 }}>{c.name}</td>
                <td style={{ textAlign:'center' }}>{c.creditHours}</td>
                <td style={{ color:'var(--text2)', fontSize:12 }}>{c.facultyName}</td>
                <td style={{ textAlign:'center' }}>
                  <span className={`pill ${c.totalSeats < 25 ? 'pill-amber' : 'pill-green'}`}>{c.totalSeats}</span>
                </td>
                <td style={{ fontSize:12, color:'var(--text2)' }}>{c.prereq || '—'}</td>
                <td>
                  {added[c._id] || c.alreadyEnrolled ? (
                    <span className="pill pill-green">✓ Added</span>
                  ) : (
                    <button className="btn btn-teal btn-sm" onClick={() => handleAdd(c)}>Add Course</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
