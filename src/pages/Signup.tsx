import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { Eye, EyeOff, GraduationCap, User, ArrowLeft } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

type Role = 'student' | 'teacher' | 'staff';

const ROLES: { value: Role; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'student', label: 'Student', icon: <GraduationCap size={28} color="#16a34a" />, desc: 'Submit campus repair requests' },
  { value: 'teacher', label: 'Teacher', icon: <User size={28} color="#2563eb" />, desc: 'Must use @vcet.edu.in email' },
];

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!name.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (!role) return setError('Please select a role.');
    if ((role === 'student' || role === 'teacher') && !email.trim().toLowerCase().endsWith('@vcet.edu.in')) return setError('Students and teachers must use a @vcet.edu.in email.');
    if (!password) return setError('Please enter a password.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!agreed) return setError('Please accept the Terms & Conditions.');
    setLoading(true);
    try {
      await authAPI.signup(name.trim(), email.trim().toLowerCase(), password, role);
      nav(`/otp-verification?email=${encodeURIComponent(email.trim().toLowerCase())}&fullName=${encodeURIComponent(name.trim())}&password=${encodeURIComponent(password)}&role=${role}&type=email-verification`);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally { setLoading(false); }
  };

  const formContent = (isDesktop: boolean) => (
    <>
      <div className={isDesktop ? 'unf-d-field-group' : ''} style={isDesktop ? {} : { marginBottom: 0 }}>
        <label className={isDesktop ? 'unf-d-field-label' : ''} style={isDesktop ? {} : lbl}>Full Name</label>
        <div className={isDesktop ? 'unf-d-input-wrap' : ''} style={isDesktop ? {} : iWrap}>
          <input className={isDesktop ? 'unf-d-inp' : ''} style={isDesktop ? {} : inp} placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} autoCapitalize="words" />
        </div>
      </div>

      <div className={isDesktop ? 'unf-d-field-group' : ''} style={isDesktop ? {} : { marginBottom: 0 }}>
        <label className={isDesktop ? 'unf-d-field-label' : ''} style={isDesktop ? {} : { ...lbl, marginTop: 16 }}>College Email</label>
        <div className={isDesktop ? 'unf-d-input-wrap' : ''} style={isDesktop ? {} : iWrap}>
          <input className={isDesktop ? 'unf-d-inp' : ''} style={isDesktop ? {} : inp} type="email" placeholder="email@vcet.edu.in" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </div>

      <div className={isDesktop ? 'unf-d-field-group' : ''} style={isDesktop ? {} : { marginBottom: 0 }}>
        <label className={isDesktop ? 'unf-d-field-label' : ''} style={isDesktop ? {} : { ...lbl, marginTop: 16 }}>Select Role</label>
        <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
          {ROLES.map(r => (
            <button key={r.value} onClick={() => setRole(r.value)} style={{ ...(isDesktop ? dRoleCard : roleCard), ...(role === r.value ? (isDesktop ? dRoleCardActive : roleCardActive) : {}) }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.icon}</span>
              <span style={{ fontSize: 12, fontWeight: role === r.value ? 700 : 600, color: role === r.value ? '#16a34a' : '#94a3b8' }}>{r.label}</span>
            </button>
          ))}
        </div>
        {role && (
          <div style={infoBox}>
            <span style={{ fontSize: 13, color: '#16a34a', lineHeight: 1.5 }}>{ROLES.find(r => r.value === role)?.desc}</span>
          </div>
        )}
      </div>

      <div className={isDesktop ? 'unf-d-field-group' : ''} style={isDesktop ? {} : { marginBottom: 0 }}>
        <label className={isDesktop ? 'unf-d-field-label' : ''} style={isDesktop ? {} : { ...lbl, marginTop: 16 }}>Password</label>
        <div className={isDesktop ? 'unf-d-input-wrap' : ''} style={isDesktop ? {} : iWrap}>
          <input className={isDesktop ? 'unf-d-inp' : ''} style={isDesktop ? {} : inp} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => setShowPw(!showPw)} style={eyeBtn}>{showPw ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}</button>
        </div>
      </div>

      <div className={isDesktop ? 'unf-d-field-group' : ''} style={isDesktop ? {} : { marginBottom: 0 }}>
        <label className={isDesktop ? 'unf-d-field-label' : ''} style={isDesktop ? {} : { ...lbl, marginTop: 16 }}>Confirm Password</label>
        <div className={isDesktop ? 'unf-d-input-wrap' : ''} style={isDesktop ? {} : iWrap}>
          <input className={isDesktop ? 'unf-d-inp' : ''} style={isDesktop ? {} : inp} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>{showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#16a34a', cursor: 'pointer' }} />
        <a href="https://unifix-app.onrender.com/terms" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#16a34a', fontWeight: 700 }}>Terms & Conditions</a>
      </div>

      {error && <div style={isDesktop ? dErrBox : errBox}>{error}</div>}

      <button onClick={handleSignup} disabled={loading || !agreed} style={{ ...(isDesktop ? dPrimaryBtn : primaryBtn), opacity: loading || !agreed ? 0.45 : 1 }}>
        {loading ? 'Sending OTP...' : 'Sign Up'}
      </button>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#64748b' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
        <a href="https://unifix-app.onrender.com/terms" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>Terms & Conditions</a>
        <span style={{ fontSize: 12, color: '#cbd5e1' }}>·</span>
        <a href="https://unifix-app.onrender.com/privacy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
      </div>
    </>
  );

  const leftContent = (
    <>
      <style>{`
        .unf-su-left-eyebrow {
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #86efac;
          margin-bottom: 0.75rem;
        }
        .unf-su-left-heading {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #fff;
          margin-bottom: 1rem;
        }
        .unf-su-left-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #bbf7d0;
          margin-bottom: 2rem;
        }
        .unf-su-left-features {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .unf-su-left-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: #dcfce7;
        }
        .unf-su-left-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
        }
      `}</style>
      <div className="unf-su-left-eyebrow">Join the Community</div>
      <h1 className="unf-su-left-heading">Your Campus,<br />Your Voice.</h1>
      <p className="unf-su-left-body">
        Create your UniFiX account to start reporting campus issues, tracking complaints, and connecting with your campus support team.
      </p>
      <div className="unf-su-left-features">
        {[
          'Free for all VCET students and staff',
          'Real-time complaint tracking',
          'Direct escalation to admin',
          'Secure and private reporting',
        ].map(f => (
          <div key={f} className="unf-su-left-feature">
            <span className="unf-su-left-dot" />
            {f}
          </div>
        ))}
      </div>
    </>
  );

  const desktopForm = (
    <>
      <style>{`
        @media (min-width: 768px) {
          .unf-su-back-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1.5rem;
          }
          .unf-su-back-btn {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            background: #f1f5f9;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .unf-su-form-heading {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.3rem;
          }
          .unf-su-form-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 1.5rem;
          }
          .unf-d-field-group { margin-bottom: 1rem; }
          .unf-d-field-label {
            display: block;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #475569;
            margin-bottom: 0.4rem;
          }
          .unf-d-input-wrap {
            display: flex;
            align-items: center;
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 0 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .unf-d-input-wrap:focus-within {
            border-color: #16a34a;
            box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
            background: #fff;
          }
          .unf-d-inp {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #0f172a;
            padding: 12px 0;
            outline: none;
          }
        }
      `}</style>
      <div className="unf-su-back-row">
        <button onClick={() => nav('/login')} className="unf-su-back-btn"><ArrowLeft size={17} /></button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Back to login</span>
      </div>
      <h2 className="unf-su-form-heading">Create Account</h2>
      <p className="unf-su-form-sub">Join the UniFiX community today.</p>
      {formContent(true)}
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent} rightFlex="0 0 58%" minHeight="100vh">
        {desktopForm}
      </AuthLayout>

      <div className="unf-signup-mobile" style={page}>
        <div style={card}>
          <div style={header}>
            <button onClick={() => nav('/login')} style={backBtn}><ArrowLeft size={18} /></button>
            <span style={headerTitle}>UniFiX</span>
            <div style={{ width: 36 }} />
          </div>
          <h1 style={h1}>Create Account</h1>
          <p style={sub}>Join the UniFiX community today</p>
          {formContent(false)}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-signup-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const page: React.CSSProperties = { minHeight: '100dvh', background: '#f8fafc', display: 'flex', justifyContent: 'center' };
const card: React.CSSProperties = { width: '100%', maxWidth: 480, padding: '0 20px 48px', background: '#fff', minHeight: '100dvh' };
const header: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 4 };
const backBtn: React.CSSProperties = { width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const headerTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#0f172a' };
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: -0.5, paddingTop: 16 };
const sub: React.CSSProperties = { fontSize: 14, color: '#64748b', marginBottom: 20 };
const lbl: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 };
const iWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px' };
const inp: React.CSSProperties = { flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0f172a', padding: '14px 0', outline: 'none' };
const eyeBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' };
const roleCard: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', borderRadius: 12, background: '#fff', border: '1.5px solid #e2e8f0', cursor: 'pointer', gap: 8 };
const roleCardActive: React.CSSProperties = { background: '#f0fdf4', borderColor: '#16a34a' };
const infoBox: React.CSSProperties = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginTop: 8, marginBottom: 4 };
const errBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 13, color: '#dc2626', textAlign: 'center' };
const primaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 20 };
const dErrBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginTop: 10, fontSize: 13, color: '#dc2626', textAlign: 'center' };
const dPrimaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 14.4, fontWeight: 700, cursor: 'pointer', marginTop: 16, boxShadow: '0 4px 6px -1px rgba(22,163,74,0.25)' };
const dRoleCard: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', borderRadius: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', cursor: 'pointer', gap: 8 };
const dRoleCardActive: React.CSSProperties = { background: '#f0fdf4', borderColor: '#16a34a' };