'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

function toLines(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join('\n');
  return String(value);
}

function fromLines(value) {
  return String(value || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const [form, setForm] = useState({
    email: '',
    name: '',
    department: '',
    designation: '',
    photoUrl: '',
    bio: '',
    researchInterests: '',
    phone: '',
    office: '',
    linkedin: '',
    googleScholar: '',
    publicationsText: '',
    password: '',
  });

  const canSave = useMemo(() => !saving && !loading, [saving, loading]);

  const getAuthHeaders = () => {
    const token = window.localStorage.getItem('klh_faculty_token') || window.sessionStorage.getItem('klh_faculty_token') || '';
    return token ? { authorization: `Bearer ${token}` } : {};
  };

  const loadMe = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/me', { cache: 'no-store', credentials: 'include', headers: getAuthHeaders() });
      if (res.status === 401) {
        setError('Unauthorized. Please login again.');
        return;
      }
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      const f = data?.faculty;
      setForm((prev) => ({
        ...prev,
        email: f?.email || '',
        name: f?.name || '',
        department: f?.department || '',
        designation: f?.designation || '',
        photoUrl: f?.photoUrl || '',
        bio: f?.bio || '',
        researchInterests: f?.researchInterests || '',
        phone: f?.phone || '',
        office: f?.office || '',
        linkedin: f?.linkedin || '',
        googleScholar: f?.googleScholar || '',
        publicationsText: toLines(f?.publications),
        password: '',
      }));
    } catch (err) {
      setError(err?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const onLogout = async () => {
    window.localStorage.removeItem('klh_faculty_token');
    window.sessionStorage.removeItem('klh_faculty_token');
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include', headers: getAuthHeaders() }).catch(() => null);
    router.push('/');
    router.refresh();
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError('');
    setOk('');
    try {
      const payload = {
        name: form.name,
        department: form.department,
        designation: form.designation,
        photoUrl: form.photoUrl,
        bio: form.bio,
        researchInterests: form.researchInterests,
        phone: form.phone,
        office: form.office,
        linkedin: form.linkedin,
        googleScholar: form.googleScholar,
        publications: fromLines(form.publicationsText),
      };
      if (form.password.trim()) payload.password = form.password;

      const res = await fetch('/api/me', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.push('/');
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Save failed');
      }
      setOk('Saved');
      setForm((prev) => ({ ...prev, password: '' }));
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onUploadPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    setOk('');
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', body: formData, credentials: 'include', headers: getAuthHeaders() });
      if (res.status === 401) {
        router.push('/');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed');
      }
      setForm((prev) => ({ ...prev, photoUrl: data?.photoUrl || prev.photoUrl }));
      setOk('Photo uploaded');
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container portal-wrap">
      <div className="portal-card">
        <div className="portal-header-row">
          <div>
            <div className="portal-card-kicker">My Profile</div>
            <div className="portal-strong">{form.email || '—'}</div>
          </div>
          <button className="portal-btn portal-btn-secondary" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>

        <form onSubmit={onSave} className="portal-form">
          <div className="portal-grid">
            <label className="portal-label">
              Name
              <input className="portal-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="portal-label">
              Department
              <input className="portal-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </label>
            <label className="portal-label">
              Designation
              <input className="portal-input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </label>
            <label className="portal-label">
              Photo
              <input
                className="portal-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => onUploadPhoto(e.target.files?.[0])}
                disabled={uploading}
              />
            </label>
            <label className="portal-label">
              Photo URL (optional)
              <input className="portal-input" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://… or /api/uploads/…" />
            </label>
            <label className="portal-label">
              Phone
              <input className="portal-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="portal-label">
              Office
              <input className="portal-input" value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })} />
            </label>
            <label className="portal-label">
              LinkedIn
              <input className="portal-input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://…" />
            </label>
            <label className="portal-label">
              Google Scholar
              <input className="portal-input" value={form.googleScholar} onChange={(e) => setForm({ ...form, googleScholar: e.target.value })} placeholder="https://…" />
            </label>
          </div>

          <label className="portal-label">
            Bio
            <textarea className="portal-textarea" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </label>

          {form.photoUrl ? (
            <div className="portal-card portal-card-inner">
              <div className="portal-card-kicker">Preview</div>
              <div style={{ width: '100%', maxWidth: 360 }}>
                <img
                  src={form.photoUrl}
                  alt="Profile photo preview"
                  style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)' }}
                />
              </div>
            </div>
          ) : null}

          <label className="portal-label">
            Research Interests
            <textarea className="portal-textarea" rows={3} value={form.researchInterests} onChange={(e) => setForm({ ...form, researchInterests: e.target.value })} />
          </label>

          <label className="portal-label">
            Publications (one per line)
            <textarea className="portal-textarea" rows={5} value={form.publicationsText} onChange={(e) => setForm({ ...form, publicationsText: e.target.value })} />
          </label>

          <label className="portal-label">
            New Password (optional)
            <input
              className="portal-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current"
              autoComplete="new-password"
            />
          </label>

          {error ? <div className="portal-error">{error}</div> : null}
          {ok ? <div className="portal-ok">{ok}</div> : null}

          <button className="portal-btn" type="submit" disabled={!canSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
