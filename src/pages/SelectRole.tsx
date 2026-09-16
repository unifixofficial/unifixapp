import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { setAccessToken, setRefreshToken, loadUser, saveUser } from '../utils/auth';
import { GraduationCap } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

export default function SelectRole() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await authAPI.selectRole('student');
      setAccessToken(data.token);
      setRefreshToken(data.refreshToken);
      const user = loadUser();
      saveUser({ ...user, role: 'student' });
      nav('/complete-profile');
    } catch (err: any) {
      setError(err.message || 'Failed to select role.');
    } finally { setLoading(false); }
  };

  const leftContent = (
    <>
      <style>{`
        .unf-sr-left-heading {
          font-size: 2.25rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }
        .unf-sr-left-body {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #bbf7d0;
        }
      `}</style>
      <h1 className="unf-sr-left-heading">One more<br />step.</h1>
      <p className="unf-sr-left-body">
        We're setting up your UniFiX student account. This only takes a moment before you're ready to go.
      </p>
    </>
  );

  const desktopForm = (
    <>
      <style>{`
        @media (min-width: 768px) {
          .unf-sr-icon-circle {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            background: #f0fdf4;
            border: 2px solid #bbf7d0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
          .unf-sr-form-heading {
            font-size: 1.75rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
            text-align: center;
          }
          .unf-sr-form-sub {
            font-size: 0.9rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 2rem;
            text-align: center;
          }
          .unf-sr-err {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 16px;
            font-size: 13px;
            color: #dc2626;
            text-align: center;
          }
          .unf-sr-primary-btn {
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
          .unf-sr-primary-btn:hover:not(:disabled) { background: #15803d; }
          .unf-sr-primary-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        }
      `}</style>
      <div className="unf-sr-icon-circle">
        <GraduationCap size={44} color="#16a34a" />
      </div>
      <h2 className="unf-sr-form-heading">Welcome to UniFiX</h2>
      <p className="unf-sr-form-sub">You're being set up as a student. Tap below to continue to your profile setup.</p>
      {error && <div className="unf-sr-err">{error}</div>}
      <button onClick={handleSelect} disabled={loading} className="unf-sr-primary-btn">
        {loading ? 'Setting up...' : 'Continue as Student'}
      </button>
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent}>
        {desktopForm}
      </AuthLayout>

      <div className="unf-sr-mobile" style={mobilePage}>
        <div style={mobileCard}>
          <div style={mobileHero}>
            <div style={mobileIconCircle}><GraduationCap size={44} color="#16a34a" /></div>
            <h1 style={mobileH1}>Welcome to UniFiX</h1>
            <p style={mobileSub}>You're being set up as a student. Tap below to continue.</p>
          </div>
          {error && <div style={mobileErrBox}>{error}</div>}
          <button onClick={handleSelect} disabled={loading} style={mobilePrimaryBtn}>{loading ? 'Setting up...' : 'Continue as Student'}</button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-sr-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const mobilePage: React.CSSProperties = { minHeight: '100dvh', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 };
const mobileCard: React.CSSProperties = { width: '100%', maxWidth: 480, background: '#fff', borderRadius: 20, padding: 32 };
const mobileHero: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 };
const mobileIconCircle: React.CSSProperties = { width: 90, height: 90, borderRadius: 45, background: '#f0fdf4', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 };
const mobileH1: React.CSSProperties = { fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8, textAlign: 'center' };
const mobileSub: React.CSSProperties = { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 1.6 };
const mobileErrBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: '#dc2626', textAlign: 'center' };
const mobilePrimaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer' };