/* eslint-disable no-unused-vars */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
const TITLE_OPTIONS = ['', 'Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.', 'Er.'];
const DEPT_OPTIONS  = ['CSE', 'CS&IT', 'AI & Data Science', 'ECE', 'Freshman Engineering', 'MCA', 'BCA', 'MBA', 'BBA'];
const DESIG_OPTIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Senior Lecturer'];

function toLines(v) { return Array.isArray(v) ? v.join('\n') : String(v || ''); }
function fromLines(v) { return String(v || '').split('\n').map(s => s.trim()).filter(Boolean); }


function initials(name) {
  return String(name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const EMPTY_EDIT = {
  title: '', name: '', department: '', designation: '', email: '',
  linkedin: '', xHandle: '', googlePlus: '', subjectsText: '', photoUrl: '',
  isPrincipal: false, isHOD: false,
};

export default function ManageFacultyPage() {
  const router = useRouter();
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState('');
  const [ok, setOk]                 = useState('');
  const [warn, setWarn]             = useState('');
  const [faculty, setFaculty]       = useState([]);
  const [deptOrder, setDeptOrder]   = useState([]);
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState(EMPTY_EDIT);
  const [editVisible, setEditVisible] = useState(false);
  const editRef = useRef(null);

  // Auto-clear warn toast after 4 s
  useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(''), 4000);
    return () => clearTimeout(t);
  }, [warn]);

  const hasPrincipal = useMemo(() => faculty.some(f => f.isPrincipal), [faculty]);

  // True when another person (not being edited) is already principal
  const hasOtherPrincipal = useMemo(
    () => faculty.some(f => f.isPrincipal && f.id !== editingId),
    [faculty, editingId]
  );

  // True when another person in the same dept is already HOD
  const hasHodInSameDept = useMemo(
    () => faculty.some(f => f.isHOD && f.id !== editingId && f.department === editForm.department),
    [faculty, editingId, editForm.department]
  );

  const handleUnauth = useCallback(() => {    router.push('/');
    router.refresh();
  }, [router]);

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [fRes, oRes] = await Promise.all([
        fetch('/api/admin/faculty', { cache: 'no-store', credentials: 'include' }),
        fetch('/api/admin/deptorder', { cache: 'no-store', credentials: 'include' }),
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
    setEditVisible(false);
    setEditingId(f.id);
    setEditForm({
      title: f.title || '', name: f.name || '',
      department: f.department || '', designation: f.designation || '',
      email: f.email?.endsWith('@noemail.klh') ? '' : (f.email || ''),
      linkedin: f.linkedin || '', xHandle: f.xHandle || '', googlePlus: f.googlePlus || '',
      subjectsText: toLines(f.subjects), photoUrl: f.photoUrl || '',
      isPrincipal: f.isPrincipal, isHOD: f.isHOD,
    });
    setTimeout(() => {
      editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => setEditVisible(true), 80);
    }, 30);
  };

  const cancelEdit = () => {
    setEditVisible(false);
    setTimeout(() => setEditingId(null), 280);
  };

  const saveEdit = async () => {
    if (!editingId || submitting) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json' },
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
      setOk('Profile updated ✓');
      cancelEdit();
      await loadAll();
    } catch (err) { setError(err?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setEditForm(f => ({ ...f, photoUrl: data?.url || '' }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm('Delete this faculty profile?')) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Delete failed');
      setOk('Profile deleted');
      if (editingId === id) cancelEdit();
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
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error('Clear failed');
      setOk('All profiles cleared');
      cancelEdit();
      await loadAll();
    } catch (err) { setError(err?.message || 'Clear failed'); }
    finally { setSubmitting(false); }
  };

  const moveDept = async (i, dir) => {
    const newOrder = [...knownDepts];
    const j = i + dir;
    if (j < 0 || j >= newOrder.length) return;
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    setDeptOrder(newOrder);
    try {
      await fetch('/api/admin/deptorder', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ deptOrder: newOrder }),
      });
    } catch { setError('Failed to save order'); }
  };

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

  const onPrincipalChange = () => {
    if (!editForm.isPrincipal && hasOtherPrincipal) {
      setWarn('There is already a Principal assigned. Please delete that profile if you wish to change.');
      return;
    }
    setEditForm(f => ({ ...f, isPrincipal: !f.isPrincipal }));
  };

  const onHodChange = () => {
    if (!editForm.isHOD && hasHodInSameDept) {
      setWarn('There is already a HOD assigned for this department. Please remove that role if you wish to change.');
      return;
    }
    setEditForm(f => ({ ...f, isHOD: !f.isHOD }));
  };

  return (
    <div className="container portal-wrap" style={{ maxWidth: 1100 }}>
      {/* Toast messages */}
      {error && <div className="portal-error portal-toast" style={{ marginBottom: '1rem' }}>{error}</div>}
      {ok    && <div className="portal-ok portal-toast"    style={{ marginBottom: '1rem' }}>{ok}</div>}
      {warn  && <div className="portal-warn portal-toast"  style={{ marginBottom: '1rem' }}>⚠ {warn}</div>}

      {/* ── Edit panel ──────────────────────────────────────── */}
      {editingId && (
        <div
          ref={editRef}
          className="portal-card portal-edit-panel"
          style={{
            marginBottom: '20px',
            borderLeft: '4px solid var(--primary-color)',
            opacity: editVisible ? 1 : 0,
            transform: editVisible ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
          }}
        >
          {/* Edit header with photo preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="faculty-avatar-lg">
                {ef.photoUrl
                  ? <img src={ef.photoUrl} alt={ef.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  : <span>{initials(ef.name)}</span>
                }
              </div>
              <div>
                <div className="portal-card-kicker" style={{ margin: 0 }}>Editing Profile</div>
                <div style={{ fontWeight: 800, color: 'var(--secondary-color)', fontSize: '1rem', marginTop: 2 }}>
                  {[ef.title, ef.name].filter(Boolean).join(' ') || '(unnamed)'}
                </div>
              </div>
            </div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button" onClick={cancelEdit}>✕ Cancel</button>
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
              <input className="portal-input" list="edit-desig-opts" value={ef.designation} onChange={setEf('designation')} placeholder="e.g. Associate Professor" />
              <datalist id="edit-desig-opts">{DESIG_OPTIONS.map(d => <option key={d} value={d} />)}</datalist>
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
                  <img src={ef.photoUrl} alt="preview" style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', border: '1px solid #eee' }} />
                  <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                    onClick={() => setEditForm(f => ({ ...f, photoUrl: '' }))}>Remove photo</button>
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

          {/* Role pill selectors */}
          <div style={{ marginBottom: '6px' }}>
            <div className="portal-card-kicker" style={{ margin: '0 0 10px' }}>Roles</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`role-pill-btn${ef.isPrincipal ? ' role-pill-btn--active' : ''}${hasOtherPrincipal && !ef.isPrincipal ? ' role-pill-btn--blocked' : ''}`}
                onClick={onPrincipalChange}
              >
                ★ Principal
                {hasOtherPrincipal && !ef.isPrincipal && <span style={{ marginLeft: 6, fontSize: '0.72rem', opacity: 0.8 }}>taken</span>}
              </button>
              <button
                type="button"
                className={`role-pill-btn${ef.isHOD ? ' role-pill-btn--active' : ''}${hasHodInSameDept && !ef.isHOD ? ' role-pill-btn--blocked' : ''}`}
                onClick={onHodChange}
              >
                ★ HOD
                {hasHodInSameDept && !ef.isHOD && <span style={{ marginLeft: 6, fontSize: '0.72rem', opacity: 0.8 }}>taken</span>}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="portal-btn" type="button" onClick={saveEdit} disabled={submitting} style={{ minWidth: 130 }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="portal-btn portal-btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Main two-column layout ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>

        {/* Faculty list */}
        <div className="portal-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div className="portal-card-kicker" style={{ margin: 0 }}>Faculty Profiles</div>
              <div className="portal-muted" style={{ fontSize: '0.82rem', marginTop: 2 }}>
                {loading ? 'Loading…' : `${faculty.length} profile${faculty.length !== 1 ? 's' : ''}`}
              </div>
            </div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
              onClick={clearAll} disabled={submitting || loading || !faculty.length}>Clear All</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[1,2,3].map(i => <div key={i} className="faculty-row-skeleton" />)}
            </div>
          ) : faculty.length === 0 ? (
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
              <div className="portal-muted" style={{ marginBottom: '0.75rem' }}>No faculty profiles yet.</div>
              <a href="/admin/faculty/add" className="portal-btn" style={{ display: 'inline-flex', textDecoration: 'none', fontSize: '0.88rem' }}>+ Add First Profile</a>
            </div>
          ) : (
            <>
              {grouped.principal.length > 0 && (
                <FacultyGroup label="Principal" rows={grouped.principal}
                  submitting={submitting} editingId={editingId}
                  onEdit={startEdit} onDelete={deleteFaculty} />
              )}
              {grouped.depts.map(([dept, rows]) => (
                <FacultyGroup key={dept} label={dept} rows={rows}
                  submitting={submitting} editingId={editingId}
                  onEdit={startEdit} onDelete={deleteFaculty} />
              ))}
            </>
          )}
        </div>

        {/* Dept order */}
        <div className="portal-card" style={{ position: 'sticky', top: '90px' }}>
          <div className="portal-card-kicker">Display Order</div>
          <p className="portal-muted" style={{ fontSize: '0.82rem', marginBottom: '14px', lineHeight: 1.5 }}>
            Controls order on the faculty page. HOD always appears first within a department.
          </p>
          {knownDepts.length === 0
            ? <div className="portal-muted" style={{ fontSize: '0.85rem' }}>Departments will appear here once profiles are added.</div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {knownDepts.map((dept, i) => (
                  <div key={dept} className="dept-order-row">
                    <span style={{ flex: 1, fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dept}</span>
                    <button className="portal-btn portal-btn-small portal-btn-secondary dept-arrow-btn"
                      type="button" onClick={() => moveDept(i, -1)} disabled={i === 0}>↑</button>
                    <button className="portal-btn portal-btn-small portal-btn-secondary dept-arrow-btn"
                      type="button" onClick={() => moveDept(i, 1)} disabled={i === knownDepts.length - 1}>↓</button>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

function FacultyGroup({ label, rows, submitting, editingId, onEdit, onDelete }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div className="faculty-group-label">{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((f, idx) => (
          <FacultyRow key={f.id} f={f} idx={idx}
            submitting={submitting}
            isEditing={editingId === f.id}
            onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

function FacultyRow({ f, idx, submitting, isEditing, onEdit, onDelete }) {
  const displayName = [f.title, f.name].filter(Boolean).join(' ') || '—';
  const ini = initials(f.name);

  return (
    <div
      className={`faculty-list-row${isEditing ? ' faculty-list-row--editing' : ''}`}
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      {/* Avatar */}
      <div className="faculty-row-avatar">
        {f.photoUrl
          ? <img src={f.photoUrl} alt={f.name} className="faculty-row-avatar-img" />
          : <span className="faculty-row-avatar-initials">{ini}</span>
        }
      </div>

      {/* Name + dept */}
      <div className="faculty-row-info">
        <div className="faculty-row-name">{displayName}</div>
        <div className="faculty-row-sub">
          {[f.department, f.designation].filter(Boolean).join(' · ') || <span className="portal-muted">No dept</span>}
        </div>
      </div>

      {/* Role badges only */}
      <div className="faculty-row-roles">
        {f.isPrincipal && <span className="role-badge">★ Principal</span>}
        {f.isHOD       && <span className="role-badge">★ HOD</span>}
      </div>

      {/* Actions */}
      <div className="faculty-row-actions">
        <button className={`portal-btn portal-btn-small${isEditing ? ' portal-btn-active' : ''}`}
          type="button" onClick={() => onEdit(f)} disabled={submitting}>
          {isEditing ? 'Editing…' : 'Edit'}
        </button>
        <button className="portal-btn portal-btn-secondary portal-btn-small delete-btn"
          type="button" onClick={() => onDelete(f.id)} disabled={submitting}>Delete</button>
      </div>
    </div>
  );
}
