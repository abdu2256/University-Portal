import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO = [
  { label: 'Student', regNo: 'SP24-BBA-201/ISB', pass: 'Student@1234' },
  { label: 'Faculty', regNo: 'FAC-BBA-001',       pass: 'Faculty@1234' },
  { label: 'Admin',   regNo: 'ADMIN-001',           pass: 'Admin@1234'   },
];

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [regNo,   setRegNo]   = useState('');
  const [pass,    setPass]    = useState('');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const user = await login(regNo, pass);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard');
    } catch (e) {
      setErr(e.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Top bar */}
      <div className="login-top-bar">
        <span>COMSATS University Islamabad — Student Information System</span>
        <span>Helpdesk: 051-9247000</span>
      </div>

      {/* Header */}
      <div className="login-header">
        <div className="univ-brand">
          <div className="univ-logo">
            <div className="univ-logo-inner">CUI<br/>ISB</div>
          </div>
          <div className="univ-name">
            <h1>COMSATS University Islamabad</h1>
            <p>STUDENT INFORMATION SYSTEM — CUOnline</p>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, textAlign: 'right' }}>
          <div>Spring Semester 2025</div>
          <div style={{ fontSize: 11, marginTop: 2 }}>Principal Seat, Park Road, Islamabad</div>
        </div>
      </div>

      {/* Body */}
      <div className="login-body">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-left-logo">
            <span style={{ fontSize: 60 }}>🎓</span>
          </div>
          <h2>Welcome to CUOnline</h2>
          <p>Your complete academic management portal for COMSATS University Islamabad</p>
          <div className="login-features">
            {[
              'View registered courses & attendance',
              'Check result cards & CGPA',
              'Pay & track fee challan',
              'Class timetable & schedule',
              'FYP submission & tracking',
              'Academic Progress Sheet (APS)',
              'Clearance certificate',
            ].map((f, i) => (
              <div className="login-feat" key={i}>
                <div className="login-feat-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="login-right">
          <h2>Sign In</h2>
          <p>Enter your registration number and password</p>

          {err && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 6, marginBottom: 14, fontSize: 13 }}>
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Registration / Employee Number</label>
              <input className="form-control" required
                placeholder="e.g. SP24-BBA-201/ISB"
                value={regNo} onChange={e => setRegNo(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-control" type="password" required
                placeholder="Enter your password"
                value={pass} onChange={e => setPass(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', color: 'var(--text2)' }}>
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span className="login-link" style={{ fontSize: 12 }}>Forgot password?</span>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in…</> : '🔐 Sign In to CUOnline'}
            </button>
          </form>

          <div className="login-demo-box">
            <b>🧪 Demo Accounts (for testing):</b>
            {DEMO.map(d => (
              <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{d.label}:</span>
                <button
                  onClick={() => { setRegNo(d.regNo); setPass(d.pass); }}
                  style={{ fontSize: 11, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {d.regNo}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
            Having trouble? Contact IT Support: <span className="login-link">itsupport@comsats.edu.pk</span>
          </div>
        </div>
      </div>

      <div className="login-footer">
        <a href="#!" style={{ color: 'rgba(255,255,255,.8)' }}>CUOnline</a> · Principal Seat © 2025 COMSATS University Islamabad ®
      </div>
    </div>
  );
}
