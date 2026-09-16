import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { Lock, Eye, EyeOff, ArrowLeft } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

export default function ResetPassword() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const otp = params.get('otp') || '';
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const rules = [
    { label: 'At least 6 characters', ok: newPw.length >= 6 },
    { label: 'Passwords match', ok: newPw === confirm && confirm.length > 0 },
  ];

  const handleReset = async () => {
    setError(''); setSuccess('');
    if (!newPw.trim()) return setError('Please enter new password.');
    if (newPw.length < 6) return setError('Password must be at least 6 characters.');
    if (newPw !== confirm) return setError('Passwords do not match.');
    if (!email || !otp) return setError('Invalid reset session. Please start over.');
    setLoading(true);
    try {
      await authAPI.verifyResetOtp(email, otp, newPw);
      setSuccess('Password reset successfully!');
      setTimeout(() => nav('/login'), 1500);
    } catch (err: any) { setError(err.message || 'Reset failed.'); }
    finally { setLoading(false); }
  };

  const leftContent = (
    <>
      <style>{`
        .unf-rp-left-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .unf-rp-left-heading {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }
        .unf-rp-left-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #bbf7d0;
          margin-bottom: 1.5rem;
        }
        .unf-rp-left-tips {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .unf-rp-left-tip {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: #dcfce7;
        }
        .unf-rp-left-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
        }
      `}</style>
      <div className="unf-rp-left-icon-wrap">
        <Lock size={32} color="#fff" />
      </div>
      <h1 className="unf-rp-left-heading">Create a new<br />password.</h1>
      <p className="unf-rp-left-body">
        Choose a strong password to keep your UniFiX account secure.
      </p>
      <div className="unf-rp-left-tips">
        {[
          'At least 6 characters long',
          'Mix letters and numbers',
          'Avoid using obvious passwords',
        ].map(t => (
          <div key={t} className="unf-rp-left-tip">
            <span className="unf-rp-left-dot" />
            {t}
          </div>
        ))}
      </div>
    </>
  );

  const desktopForm = (
    <>
      <style>{`
        @media (min-width: 768px) {
          .unf-rp-back-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1.75rem;
          }
          .unf-rp-back-btn {
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
          .unf-rp-form-heading {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.35rem;
          }
          .unf-rp-form-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 1.75rem;
          }
          .unf-rp-field-group {
            margin-bottom: 1.1rem;
          }
          .unf-rp-field-label {
            display: block;
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #475569;
            margin-bottom: 0.4rem;
          }
          .unf-rp-input-wrap {
            display: flex;
            align-items: center;
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 10px;
            padding: 0 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .unf-rp-input-wrap:focus-within {
            border-color: #16a34a;
            box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
            background: #fff;
          }
          .unf-rp-icon-wrap {
            margin-right: 10px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .unf-rp-inp {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 0.9rem;
            color: #0f172a;
            padding: 13px 0;
            outline: none;
          }
          .unf-rp-eye-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
          }
          .unf-rp-rules-box {
            background: #f8fafc;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .unf-rp-err-box {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #dc2626;
          }
          .unf-rp-success-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 12px;
            font-size: 13px;
            color: #16a34a;
          }
          .unf-rp-primary-btn {
            width: 100%;
            background: #16a34a;
            color: #fff;
            border: none;
            border-radius: 10px;
            padding: 14px 0;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(22,163,74,0.25);
            transition: background 0.2s;
            margin-bottom: 1rem;
          }
          .unf-rp-primary-btn:hover:not(:disabled) { background: #15803d; }
          .unf-rp-primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        }
      `}</style>
      <div className="unf-rp-back-row">
        <button onClick={() => nav('/login')} className="unf-rp-back-btn"><ArrowLeft size={17} /></button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Back to login</span>
      </div>
      <h2 className="unf-rp-form-heading">Create New Password</h2>
      <p className="unf-rp-form-sub">Enter a new password for {email}</p>

      <div className="unf-rp-field-group">
        <label className="unf-rp-field-label">New Password</label>
        <div className="unf-rp-input-wrap">
          <span className="unf-rp-icon-wrap"><Lock size={15} color="#94a3b8" /></span>
          <input className="unf-rp-inp" type={showNew ? 'text' : 'password'} placeholder="Enter new password" value={newPw} onChange={e => setNewPw(e.target.value)} />
          <button onClick={() => setShowNew(!showNew)} className="unf-rp-eye-btn">{showNew ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}</button>
        </div>
      </div>

      <div className="unf-rp-field-group">
        <label className="unf-rp-field-label">Confirm Password</label>
        <div className="unf-rp-input-wrap">
          <span className="unf-rp-icon-wrap"><Lock size={15} color="#94a3b8" /></span>
          <input className="unf-rp-inp" type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button onClick={() => setShowConfirm(!showConfirm)} className="unf-rp-eye-btn">{showConfirm ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}</button>
        </div>
      </div>

      <div className="unf-rp-rules-box">
        {rules.map(r => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: r.ok ? '#16a34a' : '#94a3b8', fontSize: 14 }}>{r.ok ? '✓' : '○'}</span>
            <span style={{ fontSize: 13, color: r.ok ? '#16a34a' : '#94a3b8' }}>{r.label}</span>
          </div>
        ))}
      </div>

      {error && <div className="unf-rp-err-box">{error}</div>}
      {success && <div className="unf-rp-success-box">{success}</div>}

      <button onClick={handleReset} disabled={loading} className="unf-rp-primary-btn">
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>Back to login</button>
      </div>
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent}>
        {desktopForm}
      </AuthLayout>

      <div className="unf-rp-mobile" style={page}>
        <div style={card}>
          <div style={header}>
            <button onClick={() => nav('/login')} style={backBtn}><ArrowLeft size={18} /></button>
            <span style={hTitle}>UniFiX</span>
            <div style={{ width: 36 }} />
          </div>
          <div style={hero}>
            <div style={iconCircle}><Lock size={32} color="#16a34a" /></div>
            <h1 style={h1}>Create New Password</h1>
            <p style={sub}>Enter a new password for {email}</p>
          </div>
          <label style={lbl}>New Password</label>
          <div style={iWrap}>
            <input style={inp} type={showNew ? 'text' : 'password'} placeholder="Enter new password" value={newPw} onChange={e => setNewPw(e.target.value)} />
            <button onClick={() => setShowNew(!showNew)} style={eyeBtn}>{showNew ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}</button>
          </div>
          <label style={lbl}>Confirm Password</label>
          <div style={iWrap}>
            <input style={inp} type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            <button onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>{showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}</button>
          </div>
          <div style={rulesBox}>
            {rules.map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: r.ok ? '#16a34a' : '#94a3b8', fontSize: 14 }}>{r.ok ? '✓' : '○'}</span>
                <span style={{ fontSize: 13, color: r.ok ? '#16a34a' : '#94a3b8' }}>{r.label}</span>
              </div>
            ))}
          </div>
          {error && <div style={errBox}>{error}</div>}
          {success && <div style={successBox}>{success}</div>}
          <button onClick={handleReset} disabled={loading} style={primaryBtn}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>Back to login</button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-rp-mobile {
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
const hTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#0f172a' };
const hero: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, paddingBottom: 32 };
const iconCircle: React.CSSProperties = { width: 72, height: 72, borderRadius: 36, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 };
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 };
const sub: React.CSSProperties = { fontSize: 14, color: '#64748b', textAlign: 'center' };
const lbl: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8, marginTop: 16 };
const iWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px' };
const inp: React.CSSProperties = { flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0f172a', padding: '14px 0', outline: 'none' };
const eyeBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' };
const rulesBox: React.CSSProperties = { background: '#f8fafc', borderRadius: 10, padding: 14, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 };
const errBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 13, color: '#dc2626' };
const successBox: React.CSSProperties = { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginTop: 14, fontSize: 13, color: '#16a34a' };
const primaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 24 };