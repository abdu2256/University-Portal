import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STUDENT_NAV = [
  { path: '/student/dashboard',     label: 'Dashboard',        icon: '🏠' },
  { path: '/student/registration',  label: 'Registration\nCard', icon: '📋' },
  { path: '/student/fees',          label: 'Fees',             icon: '💳' },
  { path: '/student/result',        label: 'Result Card',      icon: '📊' },
  { path: '/student/profile',       label: 'Profile',          icon: '👤' },
  { path: '/student/timetable',     label: 'Timetable',        icon: '📅' },
  { path: '/student/attendance',    label: 'Attendance',       icon: '✅' },
  { path: '/student/fyp',           label: 'FYP',              icon: '🔬' },
  { path: '/student/aps',           label: 'APS',              icon: '📈' },
  { path: '/student/clearance',     label: 'Clearance',        icon: '🧾' },
];

const FACULTY_NAV = [
  { path: '/faculty/dashboard',     label: 'Dashboard',        icon: '🏠' },
  { path: '/faculty/courses',       label: 'My Courses',       icon: '📚' },
  { path: '/faculty/attendance',    label: 'Attendance',       icon: '✅' },
  { path: '/faculty/marks',         label: 'Upload Marks',     icon: '📝' },
  { path: '/faculty/profile',       label: 'Profile',          icon: '👤' },
];

const ADMIN_NAV = [
  { path: '/admin/dashboard',       label: 'Dashboard',        icon: '🏠' },
  { path: '/admin/students',        label: 'Students',         icon: '👥' },
  { path: '/admin/faculty',         label: 'Faculty',          icon: '🎓' },
  { path: '/admin/courses',         label: 'Courses',          icon: '📚' },
  { path: '/admin/fees',            label: 'Fees',             icon: '💳' },
  { path: '/admin/announcements',   label: 'Announcements',    icon: '📢' },
];

export default function PortalLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const nav = user?.role === 'admin' ? ADMIN_NAV : user?.role === 'faculty' ? FACULTY_NAV : STUDENT_NAV;

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };

  const roleLabel = user?.role === 'student'
    ? `${user.program} ${user.semester}-${user.section}`
    : user?.designation || user?.role?.toUpperCase();

  return (
    <div>
      {/* Top bar */}
      <div className="top-bar">
        <span>Welcome : {user?.regNo}</span>
        <div className="top-bar-right">
          <span className="top-bar-link">📞 Helpdesk</span>
          <span className="top-bar-link">❓ FAQ</span>
          <span className="top-bar-link" onClick={handleLogout}>🚪 Logout</span>
        </div>
      </div>

      {/* Main header */}
      <div className="main-header">
        <div className="univ-brand">
          <div className="univ-logo">
            <div className="univ-logo-inner">CUI<br/>ISB</div>
          </div>
          <div className="univ-name">
            <h1>COMSATS University Islamabad</h1>
            <p>STUDENT INFORMATION SYSTEM</p>
          </div>
        </div>
        <div className="header-right">
          <div className="header-user">
            <b>{user?.name}</b>
            <span>{roleLabel} · {user?.campus || 'Islamabad'}</span>
          </div>
          <div className="user-photo">👤</div>
        </div>
      </div>

      {/* Nav icon grid */}
      <div className="nav-grid">
        {nav.map(n => (
          <div key={n.path}
            className={`nav-btn ${pathname === n.path ? 'active' : ''}`}
            onClick={() => navigate(n.path)}>
            <span className="nav-btn-icon">{n.icon}</span>
            <span className="nav-btn-label">{n.label}</span>
          </div>
        ))}
        <div className="nav-btn" onClick={handleLogout} style={{ color: '#dc2626' }}>
          <span className="nav-btn-icon">🚪</span>
          <span className="nav-btn-label">Logout</span>
        </div>
      </div>

      {/* Content */}
      <div className="content">{children}</div>

      {/* Footer */}
      <div className="portal-footer">
        <a href="#!" className="login-link">CUOnline</a> , Principal Seat © 2025 COMSATS University Islamabad ®
      </div>
    </div>
  );
}
