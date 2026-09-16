import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authAPI } from '../utils/api';
import { setAccessToken, setRefreshToken, saveUser } from '../utils/auth';
import { Mail, Lock, Eye, EyeOff } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const navigateByUser = (userData: any, token: string, refreshToken: string) => {
    setAccessToken(token);
    setRefreshToken(refreshToken);
    saveUser(userData);
    if (!userData.role) { nav('/select-role'); return; }
    if (!userData.profileCompleted) { nav('/complete-profile'); return; }
    nav('/dashboard');
  };

  const handleLogin = async () => {
    setError(''); setResetMsg('');
    if (!email.trim()) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');
    setLoading(true);
    try {
      const data = await authAPI.login(email.trim().toLowerCase(), password);
      navigateByUser(data.user, data.token, data.refreshToken);
    } catch (err: any) {
      if (err.code === 'GOOGLE_ACCOUNT') setError('Your email is verified with Google. Please continue with Google.');
      else setError(err.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleEmail = result.user.email ?? '';
      if (!googleEmail.endsWith('@vcet.edu.in')) {
        setError('Only VCET email accounts (@vcet.edu.in) are allowed.');
        await auth.signOut();
        return;
      }
      const idToken = await result.user.getIdToken();
      const data = await authAPI.googleSignIn(idToken);
      navigateByUser(data.user, data.token, data.refreshToken);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      if (err.code === 'EXISTING_PASSWORD_ACCOUNT') setError('This email has an existing account. Please log in with email and password.');
      else setError(err.message || 'Google sign-in failed.');
    } finally { setGoogleLoading(false); }
  };

  const handleForgot = async () => {
    setError(''); setResetMsg('');
    if (!email.trim()) return setError('Enter your email above, then tap Forgot Password.');
    setForgotLoading(true);
    try {
      await authAPI.forgotPassword(email.trim().toLowerCase());
      setResetMsg('OTP sent to your email!');
      setTimeout(() => nav(`/otp-verification?email=${encodeURIComponent(email.trim().toLowerCase())}&type=password-reset&fullName=User`), 1500);
    } catch (err: any) {
      if (err.code === 'GOOGLE_ACCOUNT') setError('Your email is verified with Google. Please continue with Google.');
      else setError(err.message || 'Could not send OTP.');
    } finally { setForgotLoading(false); }
  };

  const leftContent = (
    <>
      <style>{`
        .unf-login-left-eyebrow {
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: #86efac;
          margin-bottom: 0.75rem;
        }
        .unf-login-left-heading {
          font-size: 2.4rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #fff;
          margin-bottom: 1rem;
        }
        .unf-login-left-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #bbf7d0;
          margin-bottom: 2rem;
        }
        .unf-login-left-features {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .unf-login-left-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: #dcfce7;
        }
        .unf-login-left-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
        }
      `}</style>
      <div className="unf-login-left-eyebrow">Campus Support Platform</div>
      <h1 className="unf-login-left-heading">Campus Support,<br />Simplified.</h1>
      <p className="unf-login-left-body">
        UniFiX helps students and staff report campus issues, track complaints end-to-end, and manage Lost &amp; Found -all in one place.
      </p>
      <div className="unf-login-left-features">
        {[
          'Submit and track complaints in real time',
          'Auto-assigned to the right staff member',
          'Lost & Found with image uploads',
          'Role-based access for students, staff and admin',
        ].map(f => (
          <div key={f} className="unf-login-left-feature">
            <span className="unf-login-left-dot" />
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
          .unf-d-form-heading {
            font-size: 1.85rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.3rem;
          }
          .unf-d-form-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 1.75rem;
          }
          .unf-d-field-group {
            margin-bottom: 1.1rem;
          }
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
          .unf-d-icon-wrap {
            margin-right: 10px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .unf-d-inp {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #0f172a;
            padding: 13px 0;
            outline: none;
          }
          .unf-d-eye-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            color: #94a3b8;
          }
          .unf-d-actions-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.4rem;
          }
          .unf-d-forgot-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #16a34a;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 0;
          }
          .unf-d-forgot-btn:hover { text-decoration: underline; }
          .unf-d-err-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 10px 14px;
            margin-top: 10px;
            font-size: 13px;
            color: #dc2626;
            text-align: center;
          }
          .unf-d-success-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-top: 10px;
            font-size: 13px;
            color: #16a34a;
            text-align: center;
          }
          .unf-d-primary-btn {
            width: 100%;
            background: #16a34a;
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 14px 0;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 1.25rem;
            transition: background 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 6px -1px rgba(22,163,74,0.25);
          }
          .unf-d-primary-btn:hover:not(:disabled) {
            background: #15803d;
            box-shadow: 0 6px 10px -1px rgba(22,163,74,0.35);
          }
          .unf-d-primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }
          .unf-d-signup-row {
            text-align: center;
            margin-top: 1.1rem;
            font-size: 0.875rem;
            color: #64748b;
          }
          .unf-d-signup-row a { color: #16a34a; font-weight: 700; text-decoration: none; }
          .unf-d-signup-row a:hover { text-decoration: underline; }
          .unf-d-divider {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 1.1rem 0;
          }
          .unf-d-divider-line { flex: 1; height: 1px; background: #f1f5f9; }
          .unf-d-divider-label { font-size: 12px; color: #94a3b8; }
          .unf-d-google-btn {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: #fff;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 13px 0;
            font-size: 0.9rem;
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .unf-d-google-btn:hover:not(:disabled) {
            border-color: #cbd5e1;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          }
          .unf-d-google-btn:disabled { opacity: 0.65; cursor: not-allowed; }
          .unf-d-terms {
            text-align: center;
            margin-top: 1rem;
            font-size: 12px;
            color: #94a3b8;
          }
          .unf-d-terms a { color: #16a34a; font-weight: 700; text-decoration: none; }
        }
      `}</style>
      <h2 className="unf-d-form-heading">Welcome back</h2>
      <p className="unf-d-form-sub">Sign in to your UniFiX account.</p>

      <div className="unf-d-field-group">
        <label className="unf-d-field-label">Email Address</label>
        <div className="unf-d-input-wrap">
          <span className="unf-d-icon-wrap"><Mail size={15} color="#94a3b8" /></span>
          <input
            className="unf-d-inp"
            type="email"
            placeholder="email@vcet.edu.in"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
      </div>

      <div className="unf-d-actions-row">
        <label className="unf-d-field-label" style={{ margin: 0 }}>Password</label>
        <button onClick={handleForgot} disabled={forgotLoading} className="unf-d-forgot-btn">
          {forgotLoading ? '...' : 'Forgot password?'}
        </button>
      </div>
      <div className="unf-d-input-wrap">
        <span className="unf-d-icon-wrap"><Lock size={15} color="#94a3b8" /></span>
        <input
          className="unf-d-inp"
          type={showPw ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button onClick={() => setShowPw(!showPw)} className="unf-d-eye-btn">
          {showPw ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
        </button>
      </div>

      {error && <div className="unf-d-err-box">{error}</div>}
      {resetMsg && <div className="unf-d-success-box">{resetMsg}</div>}

      <button onClick={handleLogin} disabled={loading} className="unf-d-primary-btn">
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <div className="unf-d-signup-row">
        <span>{"Don't have an account? "}</span>
        <Link to="/signup">Sign Up</Link>
      </div>

      <div className="unf-d-divider">
        <div className="unf-d-divider-line" />
        <span className="unf-d-divider-label">or continue with</span>
        <div className="unf-d-divider-line" />
      </div>

      <button onClick={handleGoogle} disabled={googleLoading} className="unf-d-google-btn">
        {googleLoading ? 'Signing in...' : (
          <>
            <svg width={20} height={20} viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="unf-d-terms">
        By continuing, you agree to our{' '}
        <a href="https://unifix-app.onrender.com/terms" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
      </div>
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent}>
        {desktopForm}
      </AuthLayout>

      <div className="unf-login-mobile-wrapper" style={mobileWrap}>
        <div style={card}>
          <div style={hero}>
            <div style={logoWrap}>
              <img src="/icon.png" alt="UniFiX" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          </div>
          <h1 style={h1}>Welcome to UniFiX</h1>
          <p style={sub}>Sign in to your account</p>

          <label style={lbl}>Email Address</label>
          <div style={inputWrap}>
            <span style={iconWrap}><Mail size={16} color="#94a3b8" /></span>
            <input style={inp} type="email" placeholder="email@vcet.edu.in" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 8 }}>
            <label style={lbl}>Password</label>
            <button onClick={handleForgot} disabled={forgotLoading} style={forgotBtn}>{forgotLoading ? '...' : 'Forgot password?'}</button>
          </div>
          <div style={inputWrap}>
            <span style={iconWrap}><Lock size={16} color="#94a3b8" /></span>
            <input style={inp} type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button onClick={() => setShowPw(!showPw)} style={eyeBtn}>{showPw ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}</button>
          </div>

          {error && <div style={errBox}>{error}</div>}
          {resetMsg && <div style={successBox}>{resetMsg}</div>}

          <button onClick={handleLogin} disabled={loading} style={primaryBtn}>{loading ? 'Logging in...' : 'Log In'}</button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>{"Don't have an account? "}</span>
            <Link to="/signup" style={{ fontSize: 14, color: '#16a34a', fontWeight: 700 }}>Sign Up</Link>
          </div>

          <div style={divRow}>
            <div style={divLine} /><span style={divLabel}>or continue with</span><div style={divLine} />
          </div>

          <button onClick={handleGoogle} disabled={googleLoading} style={googleBtn}>
            {googleLoading ? 'Signing in...' : (
              <><svg width={20} height={20} viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              <span>Continue with Google</span></>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#94a3b8' }}>
            By continuing, you agree to our <a href="https://unifix-app.onrender.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontWeight: 700 }}>Terms &amp; Conditions</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-login-mobile-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const mobileWrap: React.CSSProperties = { minHeight: '100dvh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' };
const card: React.CSSProperties = { width: '100%', maxWidth: 480, padding: '0 24px 40px', background: '#fff', minHeight: '100dvh' };
const hero: React.CSSProperties = { display: 'flex', justifyContent: 'center', paddingTop: 60, paddingBottom: 24 };
const logoWrap: React.CSSProperties = { width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const h1: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4, letterSpacing: -0.3 };
const sub: React.CSSProperties = { fontSize: 14, color: '#64748b', marginBottom: 24 };
const lbl: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 };
const inputWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px' };
const iconWrap: React.CSSProperties = { marginRight: 10, display: 'flex', alignItems: 'center' };
const inp: React.CSSProperties = { flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0f172a', padding: '14px 0', outline: 'none' };
const eyeBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' };
const forgotBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: 13, fontWeight: 600 };
const errBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 13, color: '#dc2626', textAlign: 'center' };
const successBox: React.CSSProperties = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 13, color: '#16a34a', textAlign: 'center' };
const primaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 22 };
const divRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' };
const divLine: React.CSSProperties = { flex: 1, height: 1, background: '#f1f5f9' };
const divLabel: React.CSSProperties = { fontSize: 12, color: '#94a3b8' };
const googleBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 600, color: '#374151', cursor: 'pointer' };