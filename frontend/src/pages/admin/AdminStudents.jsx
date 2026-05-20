import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/api';
import toast from 'react-hot-toast';

const DEMO = [
  { _id:'1', name:'Ali Raza',    regNo:'SP24-BBA-201/ISB', department:'Business', program:'BBA',  semester:5, cgpa:3.71, isActive:true },
  { _id:'2', name:'Sara Malik',  regNo:'SP24-BBA-202/ISB', department:'Business', program:'BBA',  semester:5, cgpa:3.85, isActive:true },
  { _id:'3', name:'Ahmed Khan',  regNo:'SP21-BCS-042/ISB', department:'CS & IT',  program:'BSCS', semester:7, cgpa:3.55, isActive:true },
  { _id:'4', name:'Fatima Noor', regNo:'FA22-BCS-089/ISB', department:'CS & IT',  program:'BSCS', semester:5, cgpa:3.92, isActive:true },
  { _id:'5', name:'Usman Tariq', regNo:'FA23-BBA-055/ISB', department:'Business', program:'BBA',  semester:3, cgpa:3.10, isActive:true },
];

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getUsers({ role:'student' }).then(r=>setStudents(r.data.data)).catch(()=>setStudents(DEMO)).finally(()=>setLoading(false));
  }, []);

  const filtered = (students.length ? students : DEMO).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.regNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await deleteUser(id); setStudents(s=>s.filter(u=>u._id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="sec-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span>Student Management</span>
        <button className="btn btn-sm" style={{ background:'rgba(255,255,255,.2)', color:'#fff', border:'1px solid rgba(255,255,255,.3)' }}>+ Add Student</button>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        <input className="form-control" placeholder="Search by name or registration no…" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1 }} />
        <select className="form-control" style={{ width:160 }}><option>All Departments</option><option>CS & IT</option><option>Business</option><option>EE</option></select>
        <select className="form-control" style={{ width:130 }}><option>All Programs</option><option>BBA</option><option>BSCS</option><option>BEE</option></select>
      </div>
      <div className="table-wrap">
        <table className="uni-table">
          <thead><tr><th>Name</th><th>Registration No</th><th>Department</th><th>Program</th><th>Semester</th><th>CGPA</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s._id}>
                <td style={{ fontWeight:600 }}>{s.name}</td>
                <td style={{ fontSize:12, color:'var(--text2)' }}>{s.regNo}</td>
                <td>{s.department}</td>
                <td>{s.program}</td>
                <td style={{ textAlign:'center' }}>{s.semester}th</td>
                <td style={{ textAlign:'center', fontWeight:700, color:'var(--teal-dark)' }}>{s.cgpa}</td>
                <td><span className={`pill ${s.isActive?'pill-green':'pill-red'}`}>{s.isActive?'Active':'Inactive'}</span></td>
                <td>
                  <div style={{ display:'flex', gap:5 }}>
                    <button className="btn btn-sm btn-teal">Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(s._id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div className="empty-state"><div className="empty-state-icon">🔍</div>No students found.</div>}
      </div>
    </div>
  );
}
