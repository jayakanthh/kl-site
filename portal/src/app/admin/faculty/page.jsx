/* eslint-disable no-unused-vars */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from './_nav';

const TITLE_OPTIONS = ['', 'Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.', 'Er.'];
const DEPT_OPTIONS  = ['CSE', 'CS&IT', 'AI & Data Science', 'ECE', 'Freshman Engineering', 'MCA', 'BCA', 'MBA', 'BBA'];

function toLines(v) { return Array.isArray(v) ? v.join('\n') : String(v || ''); }
function fromLines(v) { return String(v || '').split('\n').map(s => s.trim()).filter(Boolean); }

function getAuth() {
  const t = window.localStorage.getItem('klh_admin_token') || window.sessionStorage.getItem('klh_admin_token') || '';
  return t ? { authorization: `Bearer ${t}` } : {};
}

const EMPTY_EDIT = {
  title: '', name: '', department: '', designation: '', email: '',
  linkedin: '', xHandle: '', googlePlus: '', subjectsText: '', photoUrl: '',
  isPrincipal: false, isHOD: false,
};

export default function ManageFacultyPage() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]         = useState('');
  const [ok, setOk]               = useState('');
  const [faculty, setFaculty]     = useState([]);
  const [deptOrder, setDeptOrder] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState(EMPTY_EDIT);
  const editRef = useRef(null);

  const hasPrincipal = useMemo(() => faculty.some(f => f.isPrincipal), [faculty]);

  const handleUnauth = useCallback(() => {
    window.localStorage.removeItem('klh_admin_token');
    window.sessionStorage.removeItem('klh_admin_token');
    router.push('/');
    router.refresh();
  }, [router]);

  // ── Load ────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [fRes, oRes] = await Promise.all([
        fetch('/api/admin/faculty', { cache: 'no-store', credentials: 'include', headers: getAuth() }),
        fetch('/api/admin/deptorder', { cache: 'no-store', credentials: 'include', headers: getAuth() }),
      ]);
      if (fRes.status === 401) { handleUnauth(); return; }
      if (!fRes.ok) throw new Error('Failed to load');
      const fd = await fRes.json();
      setFaculty(Array.isArray(fd?.faculty) ? fd.faculty : []);
      if (oRes.ok) { const od = await oRes.json(); setDeptOrder(Array.isArray(od?.deptOrder) ? od.deptOrder : []); }
    } catch (err) { setError(err?.message || 'Failed to load'); }
    finally { setLoading(false); }
  }, [handleUnauth]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const knownDepts = useMemo(() => {
    const fromFaculty = [...new Set(faculty.map(f => f.department).filter(Boolean))];
    return [...deptOrder, ...fromFaculty.filter(d => !deptOrder.includes(d))];
  }, [faculty, deptOrder]);

  // ── Edit ────────────────────────────────────────────────────
  const startEdit = (f) => {
    setEditingId(f.id);
    setEditForm({
      title: f.title || '',
      name: f.name || '',
      department: f.department || '',
      designation: f.designation || '',
      email: f.email?.endsWith('@noemail.klh') ? '' : (f.email || ''),
      linkedin: f.linkedin || '',
      xHandle: f.xHandle || '',
      googlePlus: f.googlePlus || '',
      subjectsText: toLines(f.subjects),
      photoUrl: f.photoUrl || '',
      isPrincipal: f.isPrincipal,
      isHOD: f.isHOD,
    });
    setTimeout(() => editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const saveEdit = async () => {
    if (!editingId || submitting) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({
          id: editingId,
          title: editForm.title, name: editForm.name.trim(),
          department: editForm.department.trim(), designation: editForm.designation.trim(),
          email: editForm.email.trim() || null,
          linkedin: editForm.linkedin.trim(), xHandle: editForm.xHandle.trim(),
          googlePlus: editForm.googlePlus.trim(),
          subjects: fromLines(editForm.subjectsText),
          photoUrl: editForm.photoUrl,
          isPrincipal: editForm.isPrincipal, isHOD: editForm.isHOD,
        }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Update failed');
      setOk('Profile updated');
      setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', headers: getAuth(), body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setEditForm(f => ({ ...f, photoUrl: data?.url || '' }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  // ── Toggle flag ─────────────────────────────────────────────
  const toggleFlag = async (id, flag, current) => {
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ id, [flag]: !current }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Update failed');
      setOk(`${flag === 'isPrincipal' ? 'Principal' : 'HOD'} updated`);
      await loadAll();
    } catch (err) { setError(err?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  // ── Delete ──────────────────────────────────────────────────
  const deleteFaculty = async (id) => {
    if (!window.confirm('Delete this faculty profile?')) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Delete failed');
      setOk('Profile deleted');
      if (editingId === id) setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Delete failed'); }
    finally { setSubmitting(false); }
  };

  const clearAll = async () => {
    if (!window.confirm('Delete ALL faculty profiles?')) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error('Clear failed');
      setOk('All profiles cleared');
      setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Clear failed'); }
    finally { setSubmitting(false); }
  };

  // ── Dept order ──────────────────────────────────────────────
  const moveDept = async (i, dir) => {
    const newOrder = [...knownDepts];
    const j = i + dir;
    if (j < 0 || j >= newOrder.length) return;
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    setDeptOrder(newOrder);
    try {
      await fetch('/api/admin/deptorder', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ deptOrder: newOrder }),
      });
      setOk('Order saved');
    } catch { setError('Failed to save order'); }
  };

  // ── Grouped ─────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const principal = faculty.filter(f => f.isPrincipal);
    const map = new Map();
    for (const f of faculty.filter(f => !f.isPrincipal)) {
      const d = f.department || '(No Department)';
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(f);
    }
    const sorted = [...map.entries()].sort(([a], [b]) => {
      const ia = knownDepts.indexOf(a), ib = knownDepts.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1; if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return { principal, depts: sorted };
  }, [faculty, knownDepts]);

  const ef = editForm;
  const setEf = (key) => (e) => setEditForm(f => ({ ...f, [key]: e.target.value }));
  const setEfCheck = (key) => (e) => setEditForm(f => ({ ...f, [key]: e.target.checked }));

  return (
    <div className="container portal-wrap" style={{ maxWidth: 1100 }}>
      <AdminNav />

      {error && <div className="portal-error" style={{ marginBottom: '1rem' }}>{error}</div>}
      {ok    && <div className="portal-ok"    style={{ marginBottom: '1rem' }}>{ok}</div>}

      {/* ── Inline edit panel ─────────────────────────────── */}
      {editingId && (
        <div ref={editRef} className="portal-card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div className="portal-card-kicker" style={{ margin: 0 }}>Editing Profile</div>
              <div style={{ fontWeight: 800, color: 'var(--secondary-color)', fontSize: '1rem', marginTop: 2 }}>
                {[ef.title, ef.name].filter(Boolean).join(' ') || '(unnamed)'}
              </div>
            </div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
              onClick={() => setEditingId(null)}>✕ Cancel</button>
          </div>

          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Title
              <select className="portal-input" value={ef.title} onChange={setEf('title')}>
                {TITLE_OPTIONS.map(o => <option key={o} value={o}>{o || '— None —'}</option>)}
              </select>
            </label>
            <label className="portal-label">Full Name
              <input className="portal-input" value={ef.name} onChange={setEf('name')} />
            </label>
          </div>
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Department
              <input className="portal-input" list="edit-dept-opts" value={ef.department} onChange={setEf('department')} />
              <datalist id="edit-dept-opts">{DEPT_OPTIONS.map(d => <option key={d} value={d} />)}</datalist>
            </label>
            <label className="portal-label">Designation
              <input className="portal-input" value={ef.designation} onChange={setEf('designation')} />
            </label>
          </div>
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">Email (optional)
              <input className="portal-input" type="email" value={ef.email} onChange={setEf('email')} placeholder="name@klh.edu.in" />
            </label>
            <label className="portal-label">LinkedIn URL
              <input className="portal-input" value={ef.linkedin} onChange={setEf('linkedin')} placeholder="https://linkedin.com/in/…" />
            </label>
          </div>
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <label className="portal-label">X Handle
              <input className="portal-input" value={ef.xHandle} onChange={setEf('xHandle')} placeholder="@handle" />
            </label>
            <label className="portal-label">Google+ URL
              <input className="portal-input" value={ef.googlePlus} onChange={setEf('googlePlus')} placeholder="https://plus.google.com/…" />
            </label>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Photo
              <input className="portal-input" type="file" accept="image/jpeg,image/png,image/webp"
                onChange={e => e.target.files[0] && uploadPhoto(e.target.files[0])} disabled={uploading} />
              {uploading && <span className="portal-muted" style={{ fontSize: '0.8rem' }}>Uploading…</span>}
              {ef.photoUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                  <img src={ef.photoUrl} alt="preview" style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', border: '1px solid #ddd' }} />
                  <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                    onClick={() => setEditForm(f => ({ ...f, photoUrl: '' }))}>Remove</button>
                </div>
              )}
            </label>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label className="portal-label">Subjects Taught
              <span className="portal-muted" style={{ fontWeight: 600, fontSize: '0.82rem' }}>One per line</span>
              <textarea className="portal-input" rows={3} value={ef.subjectsText} onChange={setEf('subjectsText')} style={{ resize: 'vertical' }} />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>
              <input type="checkbox" checked={ef.isPrincipal} onChange={setEfCheck('isPrincipal')} /> Principal
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>
              <input type="checkbox" checked={ef.isHOD} onChange={setEfCheck('isHOD')} /> HOD
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="portal-btn" type="button" onClick={saveEdit} disabled={submitting} style={{ minWidth: 130 }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="portal-btn portal-btn-secondary" type="button" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Two-column: faculty list + dept order ─────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', alignItems: 'start' }}>

        {/* Faculty list */}
        <div className="portal-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div className="portal-card-kicker" style={{ margin: 0 }}>Faculty Profiles</div>
              <div className="portal-muted" style={{ fontSize: '0.82rem', marginTop: 2 }}>
                {faculty.length} profile{faculty.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
              onClick={clearAll} disabled={submitting || loading || !faculty.length}>
              Clear All
            </button>
          </div>

          {loading
            ? <div className="portal-muted">Loading…</div>
            : faculty.length === 0
              ? <div className="portal-muted" style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                  No profiles yet. <a href="/admin/faculty/add" style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Add one →</a>
                </div>
              : (
                <>
                  {grouped.principal.length > 0 && (
                    <FacultyGroup label="Principal" rows={grouped.principal}
                      submitting={submitting} hasPrincipal={hasPrincipal}
                      editingId={editingId} onEdit={startEdit} onToggle={toggleFlag} onDelete={deleteFaculty} />
                  )}
                  {grouped.depts.map(([dept, rows]) => (
                    <FacultyGroup key={dept} label={dept} rows={rows}
                      submitting={submitting} hasPrincipal={hasPrincipal}
                      editingId={editingId} onEdit={startEdit} onToggle={toggleFlag} onDelete={deleteFaculty} />
                  ))}
                </>
              )
          }
        </div>

        {/* Dept order */}
        <div className="portal-card">
          <div className="portal-card-kicker">Department Order</div>
          <p className="portal-muted" style={{ fontSize: '0.82rem', marginBottom: '12px' }}>
            Controls the display order on the faculty page. HOD always appears first within a department.
          </p>
          {knownDepts.length === 0
            ? <div className="portal-muted">No departments yet.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {knownDepts.map((dept, i) => (
                  <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: '#f7f8fa', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ flex: 1, fontWeight: 700, fontSize: '0.88rem' }}>{dept}</span>
                    <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                      style={{ padding: '4px 8px' }} onClick={() => moveDept(i, -1)} disabled={i === 0}>↑</button>
                    <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                      style={{ padding: '4px 8px' }} onClick={() => moveDept(i, 1)} disabled={i === knownDepts.length - 1}>↓</button>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function FacultyGroup({ label, rows, submitting, hasPrincipal, editingId, onEdit, onToggle, onDelete }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary-color)', marginBottom: '8px', paddingLeft: '2px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map(f => (
          <div key={f.id} className={`portal-row${editingId === f.id ? ' portal-row-editing' : ''}`}
            style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1.1fr) minmax(0,1fr) auto' }}>

            {/* Name + email */}
            <div className="portal-cell">
              <div className="portal-strong" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {[f.title, f.name].filter(Boolean).join(' ') || '—'}
              </div>
              {f.email && !f.email.endsWith('@noemail.klh') && (
                <div className="portal-muted" style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.email}</div>
              )}
            </div>

            {/* Dept / designation */}
            <div className="portal-cell">
              <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.department || '—'}</div>
              {f.designation && <div className="portal-muted" style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.designation}</div>}
            </div>

            {/* Roles */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
              {f.isPrincipal && <span style={{ background: '#A52A2A', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>★ Principal</span>}
              {f.isHOD      && <span style={{ background: '#A52A2A', color: '#fff', borderRadius: '999px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>★ HOD</span>}
              {(f.isPrincipal || !hasPrincipal) && (
                <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  onClick={() => onToggle(f.id, 'isPrincipal', f.isPrincipal)} disabled={submitting}>
                  {f.isPrincipal ? '− Principal' : '+ Principal'}
                </button>
              )}
              <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                onClick={() => onToggle(f.id, 'isHOD', f.isHOD)} disabled={submitting}>
                {f.isHOD ? '− HOD' : '+ HOD'}
              </button>
            </div>

            {/* Actions */}
            <div className="portal-actions">
              <button className="portal-btn portal-btn-small" type="button"
                onClick={() => onEdit(f)} disabled={submitting}>
                {editingId === f.id ? 'Editing' : 'Edit'}
              </button>
              <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
                onClick={() => onDelete(f.id)} disabled={submitting}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
