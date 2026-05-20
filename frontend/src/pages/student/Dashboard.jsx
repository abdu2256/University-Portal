import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const attColor = p => p >= 80 ? '#16a34a' : p >= 75 ? '#d97706' : '#dc2626';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard({ semester: 'Spring 2025' })
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty-state"><span className="spinner" /> Loading…</div>;

  // Fallback demo data if API not connected
  const enrollments = data?.enrollments?.length ? data.enrollments : [
    { course: { code: 'ECO400', name: 'Business Economics',       creditHours: 3, facultyName: 'Maryam Saleem',        section: 'BBA 5 A' }, attendance: 100 },
    { course: { code: 'MKT471', name: 'Consumer Behavior',        creditHours: 3, facultyName: 'Sara Sheraz',          section: 'BBA 5 A' }, attendance: 100 },
    { course: { code: 'MGT243', name: 'E-Business',               creditHours: 3, facultyName: 'Shahkar Ullah Khan',   section: 'BBA 5 A' }, attendance: 94 },
    { course: { code: 'MGT300', name: 'Organizational Behavior',  creditHours: 3, facultyName: 'Muhammad Shahid Iqbal',section: 'BBA 5 A' }, attendance: 100 },
    { course: { code: 'MKT477', name: 'Service Marketing',        creditHours: 3, facultyName: 'Laeeq Hassan Jaswal',  section: 'BBA 5 A' }, attendance: 88  },
  ];

  const announcements = data?.announcements?.length ? data.announcements : [
    { _id: 1, title: 'Mid-term exams schedule published',       postedBy: 'Examinations Office' },
    { _id: 2, title: 'Fee deadline extended to Dec 1',          postedBy: 'Accounts Office' },
    { _id: 3, title: 'Library extended hours: 8am–11pm',       postedBy: 'Library' },
    { _id: 4, title: 'FYP registration open for 7th semester', postedBy: 'CS Department' },
  ];

  const feeStatus = data?.fee?.status || 'paid';

  return (
    <div>
      {/* Metrics */}
      <div className="metrics">
        <div className="metric">
          <div className="metric-icon">🏆</div>
          <div className="metric-val">{user?.cgpa || '3.71'}</div>
          <div className="metric-lbl">CGPA</div>
        </div>
        <div className="metric">
          <div className="metric-icon">📚</div>
          <div className="metric-val">{enrollments.length}</div>
          <div className="metric-lbl">Courses Enrolled</div>
        </div>
        <div className="metric">
          <div className="metric-icon">✅</div>
          <div className="metric-val">
            {enrollments.length ? Math.round(enrollments.reduce((s,e)=>s+e.attendance,0)/enrollments.length) : 0}%
          </div>
          <div className="metric-lbl">Avg Attendance</div>
        </div>
        <div className="metric">
          <div className="metric-icon">💳</div>
          <div className="metric-val" style={{ fontSize: 16, color: feeStatus === 'paid' ? 'var(--success)' : 'var(--danger)' }}>
            {feeStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
          </div>
          <div className="metric-lbl">Fee Status</div>
        </div>
      </div>

      {/* Registered Courses */}
      <div className="sec-header">Registered Courses List — Spring 2025</div>
      <div className="table-wrap" style={{ marginBottom: 18 }}>
        <table className="uni-table">
          <thead>
            <tr>
              <th>Course No</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Teacher</th>
              <th>Class</th>
              <th>Attendance Summary</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enr, i) => {
              const att = enr.attendance;
              const color = attColor(att);
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--teal-dark)' }}>{enr.course.code}</td>
                  <td>{enr.course.name}</td>
                  <td style={{ textAlign: 'center' }}>{enr.course.creditHours}</td>
                  <td>{enr.course.facultyName}</td>
                  <td>{enr.course.section || `${user?.program} ${user?.semester} A`}</td>
                  <td>
                    <div className="att-wrap">
                      <div className="att-bar">
                        <div className="att-fill" style={{ width: `${att}%`, background: color }}>
                          {att}%
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Announcements */}
      <div className="sec-header">Announcements</div>
      <div className="card">
        {announcements.map((a, i) => (
          <div className="notice-item" key={a._id || i}>
            <div className="notice-dot" style={{ background: ['#2563eb','#d97706','#0f7d68','#16a34a'][i % 4] }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>{a.postedBy}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
