import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { loadUser, saveUser, getValidAccessToken } from '../utils/auth';
import { uploadToCloudinary } from '../utils/cloudinary';
import { GraduationCap, User, Wrench, Upload, ArrowLeft } from '../components/Icons';
import AuthLayout from '../components/AuthLayout';

const YEARS = ['1', '2', '3', '4'];
const BRANCHES = ['Computer Engineering', 'IT', 'EXTC', 'Mechanical', 'Civil'];
const DEPARTMENTS = ['Computer', 'IT', 'EXTC', 'Mechanical', 'Civil'];
const GENDERS = ['Male', 'Female', 'Other'];

function RoleIcon({ role }: { role: string }) {
  if (role === 'student') return <GraduationCap size={24} color="#16a34a" />;
  if (role === 'teacher') return <User size={24} color="#2563eb" />;
  return <Wrench size={24} color="#7c3aed" />;
}

export default function CompleteProfile() {
  const nav = useNavigate();
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getValidAccessToken();
      if (!token) { nav('/login'); return; }
      try {
        const res = await authAPI.myProfile();
        const p = res.profile;
        setRole(p.role || '');
        setFullName(p.fullName || '');
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setError('');
    if (!gender) return setError('Please select your gender.');
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) return setError('Enter a valid 10-digit Indian mobile number.');
    if (role === 'student') {
      if (!year) return setError('Please select your year.');
      if (!branch) return setError('Please select your branch.');
    }
    if (role === 'teacher' && !department) return setError('Please select your department.');
    setSaving(true);
    try {
      const updateData: Record<string, any> = { phone: phone.trim(), gender, profileCompleted: true };
      if (role === 'student') {
        updateData.year = year;
        updateData.branch = branch;
        if (rollNumber.trim()) updateData.rollNumber = rollNumber.trim();
        if (idCardFile) {
          setUploadStatus('Uploading Student ID...');
          const url = await uploadToCloudinary(idCardFile, 'student_documents');
          updateData.studentIdCardUrl = url;
          updateData.studentIdCardName = idCardFile.name;
        }
      }
      if (role === 'teacher') {
        updateData.department = department;
        if (idCardFile) {
          setUploadStatus('Uploading Teacher ID...');
          const url = await uploadToCloudinary(idCardFile, 'teacher_documents');
          updateData.teacherIdCardUrl = url;
          updateData.teacherIdCardName = idCardFile.name;
        }
      }
      await authAPI.completeProfile(updateData);
      const user = loadUser();
      saveUser({ ...user, profileCompleted: true, role, gender, phone: phone.trim() });
      nav('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally { setSaving(false); setUploadStatus(''); }
  };

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '4px solid #f1f5f9', borderTop: '4px solid #16a34a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const roleLabel = role === 'student' ? 'Student Information' : role === 'teacher' ? 'Teacher Information' : 'Staff Information';

  const formFields = (
    <>
      <div style={fieldGroup}>
        <label style={lbl}>Gender</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {GENDERS.map(g => (
            <button key={g} onClick={() => setGender(g)} style={{ ...gBtn, ...(gender === g ? gBtnActive : {}) }}>{g}</button>
          ))}
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={lbl}>Phone Number</label>
        <div style={iWrap}><input style={inp} type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10} /></div>
      </div>

      {role === 'student' && (<>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <div style={fieldGroup}>
            <label style={lbl}>Branch</label>
            <select style={sel} value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">Select Branch</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={fieldGroup}>
            <label style={lbl}>Year</label>
            <select style={sel} value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Select Year</option>
              {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Roll Number</label>
          <div style={iWrap}><input style={inp} placeholder="Enter Roll Number" value={rollNumber} onChange={e => setRollNumber(e.target.value)} /></div>
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Student ID Card (optional)</label>
          <label style={uploadBtn}>
            <Upload size={16} color="#16a34a" />
            <span>{idCardFile ? idCardFile.name : 'Choose file...'}</span>
            <input type="file" accept="image/*,.pdf" onChange={e => setIdCardFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
          </label>
        </div>
      </>)}

      {role === 'teacher' && (<>
        <div style={fieldGroup}>
          <label style={lbl}>Department</label>
          <select style={sel} value={department} onChange={e => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={fieldGroup}>
          <label style={lbl}>Teacher ID Card (optional)</label>
          <label style={uploadBtn}>
            <Upload size={16} color="#16a34a" />
            <span>{idCardFile ? idCardFile.name : 'Choose file...'}</span>
            <input type="file" accept="image/*,.pdf" onChange={e => setIdCardFile(e.target.files?.[0] ?? null)} style={{ display: 'none' }} />
          </label>
        </div>
      </>)}

      {error && <div style={errBox}>{error}</div>}
      <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.55 : 1 }}>
        {saving ? (uploadStatus || 'Saving...') : 'Save Profile'}
      </button>
    </>
  );

  const leftContent = (
    <>
      <style>{`
        .unf-cp-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #86efac;
          margin-bottom: 1rem;
        }
        .unf-cp-left-heading {
          font-size: 2.1rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.025em;
          margin-bottom: 1rem;
        }
        .unf-cp-left-body {
          font-size: 0.875rem;
          line-height: 1.75;
          color: #bbf7d0;
          margin-bottom: 1.75rem;
        }
        .unf-cp-steps {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .unf-cp-step-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #dcfce7;
        }
        .unf-cp-step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
      `}</style>
      <div className="unf-cp-step-badge">Step 2 of 2</div>
      <h1 className="unf-cp-left-heading">Almost<br />there.</h1>
      <p className="unf-cp-left-body">
        Complete your profile so we can personalise your UniFiX experience and connect you with the right campus support.
      </p>
      <div className="unf-cp-steps">
        {[
          'Tell us your gender and contact number',
          role === 'student' ? 'Select your branch and year' : role === 'teacher' ? 'Select your department' : 'Complete your details',
          'Optionally upload your ID card',
        ].map((s, i) => (
          <div key={i} className="unf-cp-step-item">
            <span className="unf-cp-step-num">{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
    </>
  );

  const desktopForm = (
    <>
      <style>{`
        @media (min-width: 768px) {
          .unf-cp-back-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 1.25rem;
          }
          .unf-cp-back-btn {
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
          .unf-cp-role-banner {
            display: flex;
            align-items: center;
            gap: 14px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 14px 16px;
            margin-bottom: 1.5rem;
          }
          .unf-cp-role-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: #dcfce7;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .unf-cp-form-heading {
            font-size: 1.6rem;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.025em;
            margin-bottom: 0.25rem;
          }
          .unf-cp-form-sub {
            font-size: 0.875rem;
            color: #64748b;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
      <div className="unf-cp-back-row">
        <button onClick={() => nav('/login')} className="unf-cp-back-btn"><ArrowLeft size={17} /></button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Back to login</span>
      </div>
      <h2 className="unf-cp-form-heading">Complete Your Profile</h2>
      <p className="unf-cp-form-sub">Fill in your details to get started.</p>
      <div className="unf-cp-role-banner">
        <div className="unf-cp-role-icon"><RoleIcon role={role} /></div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{roleLabel}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Please fill in your details to continue</div>
        </div>
      </div>
      {formFields}
      <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', letterSpacing: 1.5, marginTop: 24 }}>UNIFIX PLATFORM</div>
    </>
  );

  return (
    <>
      <AuthLayout leftContent={leftContent} rightFlex="0 0 62%" minHeight="100vh">
        {desktopForm}
      </AuthLayout>

      <div className="unf-cp-mobile" style={mobilePage}>
        <div style={mobileOuter}>
          <div style={mobileFormWrap}>
            <div style={mobileHeader}>
              <button onClick={() => nav('/login')} style={mobileBackBtn}><ArrowLeft size={18} /></button>
              <span style={mobileHTitle}>Complete Your Profile</span>
              <div style={{ width: 36 }} />
            </div>
            <div style={roleHeader}>
              <div style={roleIconWrap}><RoleIcon role={role} /></div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{roleLabel}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Please fill in your details to continue</div>
              </div>
            </div>
            {formFields}
            <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', letterSpacing: 1.5, marginTop: 28 }}>UNIFIX PLATFORM</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .unf-cp-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const mobilePage: React.CSSProperties = { minHeight: '100dvh', background: '#f8fafc', display: 'flex', justifyContent: 'center' };
const mobileOuter: React.CSSProperties = { width: '100%', maxWidth: 720, padding: '0 20px 60px' };
const mobileFormWrap: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '0 24px 32px', marginTop: 0 };
const mobileHeader: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' };
const mobileBackBtn: React.CSSProperties = { width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const mobileHTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: '#0f172a' };
const roleHeader: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0', background: '#f0fdf4', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0' };
const roleIconWrap: React.CSSProperties = { width: 48, height: 48, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const fieldGroup: React.CSSProperties = { marginBottom: 4 };
const lbl: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8, marginTop: 16 };
const iWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px' };
const inp: React.CSSProperties = { flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#0f172a', padding: '14px 0', outline: 'none' };
const sel: React.CSSProperties = { width: '100%', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '14px', fontSize: 15, color: '#0f172a', background: '#fff', outline: 'none' };
const gBtn: React.CSSProperties = { flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748b' };
const gBtnActive: React.CSSProperties = { borderColor: '#16a34a', background: '#f0fdf4', color: '#16a34a' };
const uploadBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: 12, padding: '12px 16px', cursor: 'pointer', fontSize: 14, color: '#64748b' };
const errBox: React.CSSProperties = { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 12, marginTop: 16, fontSize: 13, color: '#dc2626', textAlign: 'center' };
const primaryBtn: React.CSSProperties = { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 28 };