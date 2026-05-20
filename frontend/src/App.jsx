import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalLayout from './components/layout/PortalLayout';
import Login from './pages/auth/Login';
// Student pages
import StudentDashboard from './pages/student/Dashboard';
import Attendance   from './pages/student/Attendance';
import Result       from './pages/student/Result';
import Fees         from './pages/student/Fees';
import Timetable    from './pages/student/Timetable';
import Registration from './pages/student/Registration';
import Profile      from './pages/student/Profile';
import FYP          from './pages/student/FYP';
import APS          from './pages/student/APS';
import Clearance    from './pages/student/Clearance';
// Faculty pages
import FacultyDashboard  from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyMarks      from './pages/faculty/FacultyMarks';
// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents  from './pages/admin/AdminStudents';
import './index.css';

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--teal)' }}><span className="spinner" /> &nbsp;Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} />;
  return <PortalLayout>{children}</PortalLayout>;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={`/${user.role}/dashboard`} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration:3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeRedirect />} />
          {/* Student routes */}
          <Route path="/student/dashboard"    element={<Protected roles={['student']}><StudentDashboard /></Protected>} />
          <Route path="/student/attendance"   element={<Protected roles={['student']}><Attendance /></Protected>} />
          <Route path="/student/result"       element={<Protected roles={['student']}><Result /></Protected>} />
          <Route path="/student/fees"         element={<Protected roles={['student']}><Fees /></Protected>} />
          <Route path="/student/timetable"    element={<Protected roles={['student']}><Timetable /></Protected>} />
          <Route path="/student/registration" element={<Protected roles={['student']}><Registration /></Protected>} />
          <Route path="/student/profile"      element={<Protected roles={['student']}><Profile /></Protected>} />
          <Route path="/student/fyp"          element={<Protected roles={['student']}><FYP /></Protected>} />
          <Route path="/student/aps"          element={<Protected roles={['student']}><APS /></Protected>} />
          <Route path="/student/clearance"    element={<Protected roles={['student']}><Clearance /></Protected>} />
          {/* Faculty routes */}
          <Route path="/faculty/dashboard"    element={<Protected roles={['faculty']}><FacultyDashboard /></Protected>} />
          <Route path="/faculty/courses"      element={<Protected roles={['faculty']}><FacultyDashboard /></Protected>} />
          <Route path="/faculty/attendance"   element={<Protected roles={['faculty']}><FacultyAttendance /></Protected>} />
          <Route path="/faculty/marks"        element={<Protected roles={['faculty']}><FacultyMarks /></Protected>} />
          <Route path="/faculty/profile"      element={<Protected roles={['faculty']}><Profile /></Protected>} />
          {/* Admin routes */}
          <Route path="/admin/dashboard"      element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
          <Route path="/admin/students"       element={<Protected roles={['admin']}><AdminStudents /></Protected>} />
          <Route path="/admin/faculty"        element={<Protected roles={['admin']}><AdminStudents /></Protected>} />
          <Route path="/admin/courses"        element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
          <Route path="/admin/fees"           element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
          <Route path="/admin/announcements"  element={<Protected roles={['admin']}><AdminDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
