import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    ['Registration No', user?.regNo],
    ['Full Name',       user?.name],
    ['Father Name',     user?.fatherName || 'Muhammad Raza'],
    ['CNIC',            user?.cnic       || '35202-1234567-1'],
    ['Date of Birth',   user?.dob        || 'March 15, 2002'],
    ['Gender',          'Male'],
    ['Department',      user?.department || 'Business Administration'],
    ['Program',         user?.program    || 'BBA'],
    ['Semester',        user?.semester   ? `${user.semester}th` : '5th'],
    ['Section',         user?.section    || 'A'],
    ['Batch',           user?.batch      || 'Spring 2024'],
    ['Campus',          user?.campus     || 'Islamabad'],
    ['Email',           user?.email      || 'ali.raza@student.cui.edu.pk'],
    ['Phone',           user?.phone      || '+92-300-1234567'],
    ['CGPA',            user?.cgpa       || '3.71'],
    ['Academic Advisor','Dr. Ahmed Saeed'],
    ['Permanent Address', user?.address  || 'House 45, Street 12, G-9/2, Islamabad'],
    ['City',            'Islamabad'],
  ];

  return (
    <div>
      <div className="sec-header">Student Profile</div>
      <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        {/* Profile header */}
        <div className="profile-header">
          <div className="profile-photo-big">👤</div>
          <div>
            <h2>{user?.name || 'Ali Raza'}</h2>
            <p>{user?.regNo} · {user?.program} {user?.semester}th Semester · Section {user?.section}</p>
            <p style={{ marginTop:4 }}>{user?.department} · {user?.campus} Campus</p>
            <span className="pill pill-green" style={{ marginTop:8, display:'inline-flex' }}>Active Student</span>
          </div>
        </div>

        {/* Fields grid */}
        <div className="profile-body">
          <div className="profile-grid">
            {fields.map(([label, value]) => (
              <div className="profile-field" key={label}>
                <div className="profile-field-label">{label}</div>
                <div className="profile-field-value">{value || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
