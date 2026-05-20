'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const TITLE_OPTIONS = ['', 'Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.', 'Er.'];
const DEPT_OPTIONS = ['CSE', 'CS&IT', 'AI & Data Science', 'ECE', 'Freshman Engineering', 'MCA', 'BCA', 'MBA', 'BBA'];

function toLines(v) { return Array.isArray(v) ? v.join('\n') : String(v || ''); }
function fromLines(v) { return String(v || '').split('\n').map(s => s.trim()).filter(Boolean); }

const EMPTY_FORM = {
  email: '', title: '', name: '', department: '', designation: '',
  linkedin: '', xHandle: '', googlePlus: '', subjectsText: '',
  photoUrl: '', isPrincipal: false, isHOD: false,
};

function getAuth() {
  const t = window.localStorage.getItem('klh_admin_token') || window.sessionStorage.getItem('klh_admin_token') || '';
  return t ? { authorization: `Bearer ${t}` } : {};
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [deptOrder, setDeptOrder] = useState([]);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [uploadingFor, setUploadingFor] = useState(null); // 'create' | faculty id
  const editRef = useRef(null);

  const hasPrincipal = useMemo(() => faculty.some(f => f.isPrincipal), [faculty]);

  const canCreate = useMemo(
    () => !submitting && createForm.name.trim(),
    [submitting, createForm.name]
  );

  // ── Auth helper ────────────────────────────────────────────
  const handleUnauth = useCallback(() => {
    window.localStorage.removeItem('klh_admin_token');
    window.sessionStorage.removeItem('klh_admin_token');
    router.push('/');
    router.refresh();
  }, [router]);

  // ── Load ───────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [fRes, oRes] = await Promise.all([
        fetch('/api/admin/faculty', { cache: 'no-store', credentials: 'include', headers: getAuth() }),
        fetch('/api/admin/deptorder', { cache: 'no-store', credentials: 'include', headers: getAuth() }),
      ]);
      if (fRes.status === 401) { handleUnauth(); return; }
      if (!fRes.ok) throw new Error('Failed to load faculty list');
      const fd = await fRes.json();
      setFaculty(Array.isArray(fd?.faculty) ? fd.faculty : []);
      if (oRes.ok) {
        const od = await oRes.json();
        setDeptOrder(Array.isArray(od?.deptOrder) ? od.deptOrder : []);
      }
    } catch (err) { setError(err?.message || 'Failed to load'); }
    finally { setLoading(false); }
  }, [handleUnauth]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Dept order list ────────────────────────────────────────
  const knownDepts = useMemo(() => {
    const fromFaculty = [...new Set(faculty.map(f => f.department).filter(Boolean))];
    const missing = fromFaculty.filter(d => !deptOrder.includes(d));
    return [...deptOrder, ...missing];
  }, [faculty, deptOrder]);

  // ── Photo upload ───────────────────────────────────────────
  const uploadPhoto = async (file, forId) => {
    setUploadingFor(forId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', headers: getAuth(), body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data?.url || '';
      if (forId === 'create') setCreateForm(f => ({ ...f, photoUrl: url }));
      else setEditForm(f => ({ ...f, photoUrl: url }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploadingFor(null); }
  };

  // ── Create ────────────────────────────────────────────────
  const onCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const body = {
        email: createForm.email.trim() || null,
        title: createForm.title,
        name: createForm.name.trim(),
        department: createForm.department.trim(),
        designation: createForm.designation.trim(),
        linkedin: createForm.linkedin.trim(),
        xHandle: createForm.xHandle.trim(),
        googlePlus: createForm.googlePlus.trim(),
        subjects: fromLines(createForm.subjectsText),
        photoUrl: createForm.photoUrl,
        isPrincipal: createForm.isPrincipal,
        isHOD: createForm.isHOD,
      };
      const res = await fetch('/api/admin/faculty', {
        method: 'POST', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify(body),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.error || 'Create failed'); }
      setOk('Faculty profile created');
      setCreateForm(EMPTY_FORM);
      await loadAll();
    } catch (err) { setError(err?.message || 'Create failed'); }
    finally { setSubmitting(false); }
  };

  // ── Edit ──────────────────────────────────────────────────
  const onEditStart = (f) => {
    setEditingId(f.id);
    setEditForm({
      email: f.email?.endsWith('@noemail.klh') ? '' : (f.email || ''),
      title: f.title || '',
      name: f.name || '',
      department: f.department || '',
      designation: f.designation || '',
      linkedin: f.linkedin || '',
      xHandle: f.xHandle || '',
      googlePlus: f.googlePlus || '',
      subjectsText: toLines(f.subjects),
      photoUrl: f.photoUrl || '',
      isPrincipal: f.isPrincipal,
      isHOD: f.isHOD,
    });
    setTimeout(() => editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const onEditSave = async () => {
    if (!editingId || submitting) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const body = {
        id: editingId,
        email: editForm.email.trim() || null,
        title: editForm.title,
        name: editForm.name.trim(),
        department: editForm.department.trim(),
        designation: editForm.designation.trim(),
        linkedin: editForm.linkedin.trim(),
        xHandle: editForm.xHandle.trim(),
        googlePlus: editForm.googlePlus.trim(),
        subjects: fromLines(editForm.subjectsText),
        photoUrl: editForm.photoUrl,
        isPrincipal: editForm.isPrincipal,
        isHOD: editForm.isHOD,
      };
      const res = await fetch('/api/admin/faculty', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify(body),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Update failed');
      setOk('Faculty profile updated');
      setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  // ── Toggle flag (quick) ───────────────────────────────────
  const onToggleFlag = async (id, flag, current) => {
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

  // ── Delete ────────────────────────────────────────────────
  const onDelete = async (id) => {
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
      setOk('Faculty deleted');
      if (editingId === id) setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Delete failed'); }
    finally { setSubmitting(false); }
  };

  const onClearAll = async () => {
    if (!window.confirm('Delete ALL faculty profiles?')) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error('Clear failed');
      setOk('All faculty cleared');
      setEditingId(null);
      await loadAll();
    } catch (err) { setError(err?.message || 'Clear failed'); }
    finally { setSubmitting(false); }
  };

  const onLogout = async () => {
    window.localStorage.removeItem('klh_admin_token');
    window.sessionStorage.removeItem('klh_admin_token');
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include', headers: getAuth() }).catch(() => null);
    router.push('/');
    router.refresh();
  };

  // ── Dept order ────────────────────────────────────────────
  const moveDept = async (index, dir) => {
    const newOrder = [...knownDepts];
    const swapIdx = index + dir;
    if (swapIdx < 0 || swapIdx >= newOrder.length) return;
    [newOrder[index], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[index]];
    setDeptOrder(newOrder);
    try {
      await fetch('/api/admin/deptorder', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuth() },
        body: JSON.stringify({ deptOrder: newOrder }),
      });
      setOk('Department order saved');
    } catch { setError('Failed to save department order'); }
  };

  // ── Grouped faculty ───────────────────────────────────────
  const grouped = useMemo(() => {
    const principal = faculty.filter(f => f.isPrincipal);
    const nonPrincipal = faculty.filter(f => !f.isPrincipal);
    const map = new Map();
    for (const f of nonPrincipal) {
      const dept = f.department || '(No Department)';
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept).push(f);
    }
    const sorted = [...map.entries()].sort(([a], [b]) => {
      const ia = knownDepts.indexOf(a), ib = knownDepts.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
    return { principal, depts: sorted };
  }, [faculty, knownDepts]);

  // ── Shared form field renderer ────────────────────────────
  const renderFormFields = (form, setForm, forId) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      {/* Row 1: Title + Name */}
      <label className="portal-label">Title
        <select className="portal-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}>
          {TITLE_OPTIONS.map(o => <option key={o} value={o}>{o || '— None —'}</option>)}
        </select>
      </label>
      <label className="portal-label">Full Name *
        <input className="portal-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Smith" />
      </label>
      {/* Row 2: Dept + Designation */}
      <label className="portal-label">Department
        <input className="portal-input" list={`dept-list-${forId}`} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. CSE" />
        <datalist id={`dept-list-${forId}`}>{DEPT_OPTIONS.map(d => <option key={d} value={d} />)}</datalist>
      </label>
      <label className="portal-label">Designation
        <input className="portal-input" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} placeholder="e.g. Associate Professor" />
      </label>
      {/* Row 3: Email */}
      <label className="portal-label">Email (optional)
        <input className="portal-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@klh.edu.in" />
      </label>
      {/* Row 4: LinkedIn + X */}
      <label className="portal-label">LinkedIn URL
        <input className="portal-input" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/…" />
      </label>
      <label className="portal-label">X Handle
        <input className="portal-input" value={form.xHandle} onChange={e => setForm(f => ({ ...f, xHandle: e.target.value }))} placeholder="@handle" />
      </label>
      <label className="portal-label">Google+ URL
        <input className="portal-input" value={form.googlePlus} onChange={e => setForm(f => ({ ...f, googlePlus: e.target.value }))} placeholder="https://plus.google.com/…" />
      </label>
      {/* Photo */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label className="portal-label">Photo
          <input className="portal-input" type="file" accept="image/*"
            onChange={e => { if (e.target.files[0]) uploadPhoto(e.target.files[0], forId); }}
            disabled={uploadingFor === forId}
          />
          {uploadingFor === forId && <span className="portal-muted" style={{ fontSize: '0.8rem' }}>Uploading…</span>}
          {form.photoUrl && (
            <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={form.photoUrl} alt="preview" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', border: '1px solid #ddd' }} />
              <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                onClick={() => setForm(f => ({ ...f, photoUrl: '' }))}>Remove</button>
            </div>
          )}
        </label>
      </div>
      {/* Subjects */}
      <div style={{ gridColumn: '1 / -1' }}>
        <label className="portal-label">Subjects Taught (one per line)
          <textarea className="portal-input" rows={3} value={form.subjectsText}
            onChange={e => setForm(f => ({ ...f, subjectsText: e.target.value }))}
            placeholder={"Data Structures\nAlgorithms\nOperating Systems"} style={{ resize: 'vertical' }} />
        </label>
      </div>
      {/* Roles */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isPrincipal}
            onChange={e => setForm(f => ({ ...f, isPrincipal: e.target.checked }))} />
          Principal
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.isHOD}
            onChange={e => setForm(f => ({ ...f, isHOD: e.target.checked }))} />
          HOD
        </label>
      </div>
    </div>
  );

  return (
    <div className="container portal-wrap">
      <div className="portal-card">
        {/* Header */}
        <div className="portal-header-row">
          <div>
            <div className="portal-card-kicker">Manage Faculty</div>
            <div className="portal-muted">Create and edit faculty profiles for the KLH Hyderabad website</div>
          </div>
          <button className="portal-btn portal-btn-secondary" type="button" onClick={onLogout}>Logout</button>
        </div>

        {error ? <div className="portal-error" style={{ marginBottom: '1rem' }}>{error}</div> : null}
        {ok ? <div className="portal-ok" style={{ marginBottom: '1rem' }}>{ok}</div> : null}

        {/* ── Two-column top area ── */}
        <div className="portal-split">
          {/* Create form */}
          <div className="portal-card portal-card-inner">
            <div className="portal-card-kicker">Add Faculty Profile</div>
            <form onSubmit={onCreate} className="portal-form">
              {renderFormFields(createForm, setCreateForm, 'create')}
              <button className="portal-btn" type="submit" disabled={!canCreate} style={{ marginTop: '0.5rem' }}>
                {submitting ? 'Creating…' : 'Add Profile'}
              </button>
            </form>
          </div>

          {/* Dept order */}
          <div className="portal-card portal-card-inner">
            <div className="portal-card-kicker">Department Display Order</div>
            <div className="portal-muted" style={{ marginBottom: '0.75rem' }}>Use arrows to reorder. HOD appears first within each department.</div>
            {knownDepts.length === 0
              ? <div className="portal-muted">No departments yet.</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {knownDepts.map((dept, i) => (
                    <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.6rem', background: 'var(--portal-bg,#f8f8f8)', borderRadius: '6px' }}>
                      <span style={{ flex: 1, fontWeight: 500 }}>{dept}</span>
                      <button className="portal-btn portal-btn-small portal-btn-secondary" type="button" onClick={() => moveDept(i, -1)} disabled={i === 0}>↑</button>
                      <button className="portal-btn portal-btn-small portal-btn-secondary" type="button" onClick={() => moveDept(i, 1)} disabled={i === knownDepts.length - 1}>↓</button>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* ── Edit form (shown when editing) ── */}
        {editingId && (
          <div ref={editRef} className="portal-card portal-card-inner" style={{ marginTop: '1.5rem', borderLeft: '4px solid #A52A2A' }}>
            <div className="portal-header-row" style={{ marginBottom: '1rem' }}>
              <div className="portal-card-kicker" style={{ margin: 0 }}>
                Editing: {editForm.name || '(unnamed)'}
              </div>
              <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
                onClick={() => setEditingId(null)}>✕ Cancel</button>
            </div>
            {renderFormFields(editForm, setEditForm, editingId)}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="portal-btn" type="button" onClick={onEditSave} disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button className="portal-btn portal-btn-secondary" type="button"
                onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Faculty list ── */}
        <div className="portal-card portal-card-inner" style={{ marginTop: '1.5rem' }}>
          <div className="portal-header-row">
            <div className="portal-card-kicker">Faculty Profiles</div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button"
              onClick={onClearAll} disabled={submitting || loading || !faculty.length}>Clear All</button>
          </div>

          {loading ? <div className="portal-muted">Loading…</div>
            : faculty.length === 0 ? <div className="portal-muted">No faculty profiles yet. Add one above.</div>
            : (
              <>
                {grouped.principal.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#A52A2A' }}>Principal</div>
                    <FacultyTable rows={grouped.principal} submitting={submitting}
                      hasPrincipal={hasPrincipal} editingId={editingId}
                      onEdit={onEditStart} onToggleFlag={onToggleFlag} onDelete={onDelete} />
                  </div>
                )}
                {grouped.depts.map(([dept, rows]) => (
                  <div key={dept} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#A52A2A' }}>{dept}</div>
                    <FacultyTable rows={rows} submitting={submitting}
                      hasPrincipal={hasPrincipal} editingId={editingId}
                      onEdit={onEditStart} onToggleFlag={onToggleFlag} onDelete={onDelete} />
                  </div>
                ))}
              </>
            )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function FacultyTable({ rows, submitting, hasPrincipal, editingId, onEdit, onToggleFlag, onDelete }) {
  return (
    <div className="portal-table-scroll">
      <div className="portal-table">
        <div className="portal-row portal-row-head">
          <div className="portal-th portal-cell">Name</div>
          <div className="portal-th portal-cell">Dept / Designation</div>
          <div className="portal-th portal-cell">Roles</div>
          <div className="portal-th portal-actions-head">Actions</div>
        </div>
        {rows.map((f) => (
          <div className={`portal-row${editingId === f.id ? ' portal-row-editing' : ''}`} key={f.id}>
            <div className="portal-cell">
              <div className="portal-strong">{[f.title, f.name].filter(Boolean).join(' ') || '—'}</div>
              {f.email && !f.email.endsWith('@noemail.klh') && (
                <div className="portal-muted" style={{ fontSize: '0.78rem' }}>{f.email}</div>
              )}
            </div>
            <div className="portal-cell">
              <div>{f.department || '—'}</div>
              <div className="portal-muted" style={{ fontSize: '0.8rem' }}>{f.designation || ''}</div>
            </div>
            <div className="portal-cell" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {f.isPrincipal && <span style={{ background: '#A52A2A', color: '#fff', borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>★ Principal</span>}
              {f.isHOD && <span style={{ background: '#A52A2A', color: '#fff', borderRadius: '999px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>★ HOD</span>}
              {!f.isPrincipal && !f.isHOD && <span style={{ color: '#999', fontSize: '0.8rem' }}>—</span>}
              {(f.isPrincipal || !hasPrincipal) && (
                <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                  onClick={() => onToggleFlag(f.id, 'isPrincipal', f.isPrincipal)} disabled={submitting}>
                  {f.isPrincipal ? '− Principal' : '+ Principal'}
                </button>
              )}
              <button className="portal-btn portal-btn-small portal-btn-secondary" type="button"
                onClick={() => onToggleFlag(f.id, 'isHOD', f.isHOD)} disabled={submitting}>
                {f.isHOD ? '− HOD' : '+ HOD'}
              </button>
            </div>
            <div className="portal-actions">
              <button className="portal-btn portal-btn-small" type="button"
                onClick={() => onEdit(f)} disabled={submitting}>
                {editingId === f.id ? 'Editing…' : 'Edit'}
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
