/* eslint-disable no-unused-vars */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
const TITLE_OPTIONS = ['', 'Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.', 'Er.'];
const DEPT_OPTIONS  = ['CSE', 'CS&IT', 'AI & Data Science', 'ECE', 'Freshman Engineering', 'MCA', 'BCA', 'MBA', 'BBA'];
const RANK_OPTIONS  = ['', 'Professor', 'Associate Professor', 'Assistant Professor'];

function fromLines(v) {
  return String(v || '').split('\n').map(s => s.trim()).filter(Boolean);
}

const EMPTY = {
  title: '', name: '', department: '', designation: '',
  email: '', linkedin: '', xHandle: '', googlePlus: '',
  subjectsText: '', photoUrl: '', rank: '',
  isPrincipal: false, isHOD: false,
};

function getAuth() {
  const t = window.localStorage.getItem('klh_admin_token') || window.sessionStorage.getItem('klh_admin_token') || '';
  return t ? { authorization: `Bearer ${t}` } : {};
}

export default function AddFacultyPage() {
  const router = useRouter();
  const [form, setForm]         = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]       = useState('');
  const [ok, setOk]             = useState('');
  const [warn, setWarn]         = useState('');

  // Existing role state fetched on mount
  const [existingPrincipal, setExistingPrincipal] = useState(false);
  const [hodDepts, setHodDepts] = useState(new Set());

  // Auto-clear warn toast
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(''), 4000);
    return () => clearTimeout(t);
  }, [warn]);

  // Fetch existing faculty to know which roles are taken
  useEffect(() => {
    fetch('/api/admin/faculty', { credentials: 'include', headers: getAuth() })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.faculty) return;
        setExistingPrincipal(d.faculty.some(f => f.isPrincipal));
        setHodDepts(new Set(d.faculty.filter(f => f.isHOD).map(f => f.department).filter(Boolean)));
      })
      .catch(() => null);
  }, []);

  const principalBlocked = existingPrincipal && !form.isPrincipal;
  const hodBlocked = !!(form.department && hodDepts.has(form.department) && !form.isHOD);

  const canSave = useMemo(() => !submitting && form.name.trim(), [submitting, form.name]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const onPrincipalChange = (e) => {
    if (e.target.checked && principalBlocked) {
      setWarn('There is already a Principal assigned. Please delete that profile if you wish to change.');
      return;
    }
    setForm(f => ({ ...f, isPrincipal: e.target.checked }));
  };

  const onHodChange = (e) => {
    if (e.target.checked && hodBlocked) {
      setWarn('There is already a HOD assigned for this department. Please remove that role if you wish to change.');
      return;
    }
    setForm(f => ({ ...f, isHOD: e.target.checked }));
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', headers: getAuth(), body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(f => ({ ...f, photoUrl: data?.url || '' }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'POST', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({
          title: form.title,
          name: form.name.trim(),
          department: form.department.trim(),
          designation: form.designation.trim(),
          email: form.email.trim() || null,
          linkedin: form.linkedin.trim(),
          xHandle: form.xHandle.trim(),
          googlePlus: form.googlePlus.trim(),
          subjects: fromLines(form.subjectsText),
          photoUrl: form.photoUrl,
          rank: form.rank,
          isPrincipal: form.isPrincipal,
          isHOD: form.isHOD,
        }),
      });
      if (res.status === 401) { router.push('/'); return; }
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.error || 'Create failed'); }
      setOk('Faculty profile added!');
      setForm(EMPTY);
      setTimeout(() => router.push('/admin/faculty'), 900);
    } catch (err) { setError(err?.message || 'Create failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="container portal-wrap" style={{ maxWidth: 780 }}>
      <div className="portal-card">
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="portal-card-kicker">Add Faculty Profile</div>
        </div>

        {error && <div className="portal-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {ok    && <div className="portal-ok"    style={{ marginBottom: '1rem' }}>{ok}</div>}
        {warn  && <div className="portal-warn portal-toast" style={{ marginBottom: '1rem' }}>⚠ {warn}</div>}

        <form onSubmit={onSubmit}>
          {/* Row 1: Title + Name */}
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Title
              <select className="portal-input" value={form.title} onChange={set('title')}>
                {TITLE_OPTIONS.map(o => <option key={o} value={o}>{o || '— None —'}</option>)}
              </select>
            </label>
            <label className="portal-label">Full Name *
              <input className="portal-input" value={form.name} onChange={set('name')} placeholder="e.g. John Smith" />
            </label>
          </div>

          {/* Row 2: Dept + Designation */}
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Department
              <input className="portal-input" list="dept-opts" value={form.department} onChange={set('department')} placeholder="e.g. CSE" />
              <datalist id="dept-opts">{DEPT_OPTIONS.map(d => <option key={d} value={d} />)}</datalist>
            </label>
            <label className="portal-label">Designation
              <input className="portal-input" value={form.designation} onChange={set('designation')} placeholder="e.g. Associate Professor" />
            </label>
          </div>

          {/* Row 3: Rank */}
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Academic Rank
              <select className="portal-input" value={form.rank} onChange={set('rank')}>
                {RANK_OPTIONS.map(o => <option key={o} value={o}>{o || '— None —'}</option>)}
              </select>
            </label>
            <div />
          </div>

          {/* Row 4: Email */}
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Email <span className="portal-muted" style={{ fontWeight: 600 }}>(optional — shown as contact link)</span>
              <input className="portal-input" type="email" value={form.email} onChange={set('email')} placeholder="name@klh.edu.in" />
            </label>
          </div>

          {/* Row 5: Social */}
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">LinkedIn URL
              <input className="portal-input" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/…" />
            </label>
            <label className="portal-label">X Handle
              <input className="portal-input" value={form.xHandle} onChange={set('xHandle')} placeholder="@handle" />
            </label>
          </div>
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Google+ URL
              <input className="portal-input" value={form.googlePlus} onChange={set('googlePlus')} placeholder="https://plus.google.com/…" />
            </label>
            <div /> {/* spacer */}
          </div>

          {/* Photo */}
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Photo
              <input className="portal-input" type="file" accept="image/jpeg,image/png,image/webp"
                onChange={e => e.target.files[0] && uploadPhoto(e.target.files[0])}
                disabled={uploading}
              />
              {uploading && <span className="portal-muted" style={{ fontSize: '0.8rem' }}>Uploading…</span>}
              {form.photoUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                  <img src={form.photoUrl} alt="preview" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: '1px solid #ddd' }} />
                  <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                    onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}>Remove</button>
                </div>
              )}
            </label>
          </div>

          {/* Subjects */}
          <div style={{ marginBottom: '16px' }}>
            <label className="portal-label">Subjects Taught
              <span className="portal-muted" style={{ fontWeight: 600, fontSize: '0.82rem' }}>One per line</span>
              <textarea className="portal-input" rows={4} value={form.subjectsText} onChange={set('subjectsText')}
                placeholder={"Data Structures\nAlgorithms\nOperating Systems"} style={{ resize: 'vertical' }} />
            </label>
          </div>

          {/* Roles — greyed out when already taken */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '20px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: principalBlocked ? 'not-allowed' : 'pointer',
              fontWeight: 700, color: 'var(--secondary-color)',
              opacity: principalBlocked ? 0.4 : 1,
              userSelect: 'none',
            }}>
              <input type="checkbox" checked={form.isPrincipal} onChange={onPrincipalChange} />
              Principal
              {principalBlocked && (
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#92400e', background: 'rgba(251,191,36,0.15)', padding: '1px 7px', borderRadius: 99 }}>
                  taken
                </span>
              )}
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: hodBlocked ? 'not-allowed' : 'pointer',
              fontWeight: 700, color: 'var(--secondary-color)',
              opacity: hodBlocked ? 0.4 : 1,
              userSelect: 'none',
            }}>
              <input type="checkbox" checked={form.isHOD} onChange={onHodChange} />
              HOD
              {hodBlocked && (
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#92400e', background: 'rgba(251,191,36,0.15)', padding: '1px 7px', borderRadius: 99 }}>
                  taken
                </span>
              )}
            </label>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="portal-btn" type="submit" disabled={!canSave} style={{ minWidth: 140 }}>
              {submitting ? 'Adding…' : 'Add Profile'}
            </button>
            <button className="portal-btn portal-btn-secondary" type="button"
              onClick={() => router.push('/admin/faculty')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
