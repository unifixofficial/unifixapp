import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setAccessToken, setRefreshToken } from '../utils/auth';
import { Mail, ArrowLeft } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

export default function OtpVerification() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const fullName = params.get('fullName') || '';
  const password = params.get('password') || '';
  const role = params.get('role') || '';
  const type = params.get('type') || 'email-verification';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const hiddenInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleOtpChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setOtp(cleaned);
  };
  const handleVerify = async () => {
    setError('');
    const code = otp;
    if (code.length !== 6) return setError('Please enter the complete 6-digit OTP.');
    setLoading(true);
    try {
      if (type === 'email-verification') {
        const data = await authAPI.verifyOtp(email, code, fullName, password, role);
        setAccessToken(data.token);
        setRefreshToken(data.refreshToken);
        nav('/complete-profile');
      } else {
        await authAPI.validateResetOtp(email, code);
        nav(`/reset-password?email=${encodeURIComponent(email)}&otp=${code}`);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResending(true); setError('');
    try {
      await authAPI.resendOtp(email, fullName || 'User', type === 'email-verification' ? 'email-verification' : 'password-reset');
      setTimer(60); setCanResend(false); setOtp('');
      hiddenInput.current?.focus();
    } catch (err: any) { setError(err.message || 'Failed to resend.'); }
    finally { setResending(false); }
  };
  const otpGrid = (_isDesktop: boolean) => (
    <>
      <style>{`
        .unf-otp-wrapper {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }
        .unf-otp-hidden-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: text;
          z-index: 2;
          font-size: 16px;
        }
        .unf-otp-display {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 56px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          pointer-events: none;
          font-size: 22px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.35em;
          font-family: monospace;
        }
        .unf-otp-wrapper:focus-within .unf-otp-display {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
        }
      `}</style>
      <div className="unf-otp-wrapper" onClick={() => hiddenInput.current?.focus()}>
        <input
          ref={hiddenInput}
          className="unf-otp-hidden-input"
          value={otp}
          inputMode="numeric"
          autoComplete="one-time-code"
          onChange={e => handleOtpChange(e.target.value)}
        />
        <div className="unf-otp-display">
          {otp.padEnd(6, ' ').slice(0, 6)}
        </div>
      </div>
    </>
  );
  const leftContent = (
    <>
      <style>{`
        .unf-otp-left-icon-wrap {
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
        .unf-otp-left-heading {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }
        .unf-otp-left-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #bbf7d0;
          margin-bottom: 1.5rem;
        }
        .unf-otp-email-badge {
          display: inline-block;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          word-break: break-all;
        }
      `}</style>
      <div className="unf-otp-left-icon-wrap">
        <Mail size={32} color="#fff" />
      </div>
      <h1 className="unf-otp-left-heading">Check your<br />inbox.</h1>
      <p className="unf-otp-left-body">
        We've sent a 6-digit verification code to your email address. Enter it on the right to continue.
      </p>
      {email && <span className="unf-otp-email-badge">{email}</span>}
    </>
  );

  const desktopForm = (
    <>
      <style>{`
        @media (min-width: 768px) {
          .unf-otp-back-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 2rem;
          }
          .unf-otp-back-btn {
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
          .unf-otp-form-heading {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.35rem;
          }
          .unf-otp-form-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 2rem;
          }
          .unf-otp-verify-btn {
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
          }
          .unf-otp-verify-btn:hover:not(:disabled) { background: #15803d; }
          .unf-otp-verify-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        }
      `}</style>
      <div className="unf-otp-back-row">
        <button onClick={() => nav('/login')} className="unf-otp-back-btn"><ArrowLeft size={17} /></button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Back to login</span>
      </div>
      <h2 className="unf-otp-form-heading">Verify Email</h2>
      <p className="unf-otp-form-sub">Enter the 6-digit code sent to your email.</p>
      {otpGrid(true)}
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}
      <button onClick={handleVerify} disabled={loading} className="unf-otp-verify-btn">
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
        {"Didn't receive the code? "}
        {!canResend
          ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Resend in {timer}s</span>
          : <button onClick={handleResend} disabled={resending} style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{resending ? 'Resending...' : 'Resend OTP'}</button>}
      </div>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>Back to login</button>
      </div>
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent}>
        {desktopForm}
      </AuthLayout>

      <div className="unf-otp-mobile" style={page}>
        <div style={card}>
          <div style={header}>
            <button onClick={() => nav('/login')} style={backBtn}><ArrowLeft size={18} /></button>
            <span style={title}>UniFiX</span>
            <div style={{ width: 36 }} />
          </div>
          <div style={hero}>
            <div style={iconCircle}><Mail size={32} color="#16a34a" /></div>
            <h1 style={h1}>Verify Email</h1>
            <p style={subp}>We've sent a 6-digit code to</p>
            <p style={emailText}>{email}</p>
          </div>
          {otpGrid(false)}
          {error && <div style={errBox}>{error}</div>}
          <button onClick={handleVerify} disabled={loading} style={primaryBtn}>{loading ? 'Verifying...' : 'Verify Code'}</button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            {"Didn't receive the code? "}
            {!canResend
              ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Resend in {timer}s</span>
              : <button onClick={handleResend} disabled={resending} style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{resending ? 'Resending...' : 'Resend OTP'}</button>}
          </div>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button onClick={() => nav('/login')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>Back to login</button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-otp-mobile {
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
const title: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#0f172a' };
const hero: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 28, paddingBottom: 32 };
const iconCircle: React.CSSProperties = { width: 72, height: 72, borderRadius: 36, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 };
const h1: React.CSSProperties = { fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 };
const subp: React.CSSProperties = { fontSize: 14, color: '#64748b', marginBottom: 4 };
const emailText: React.CSSProperties = { fontSize: 14, fontWeight: 700, color: '#0f172a' };
const errBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: '#dc2626' };
const primaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer' };