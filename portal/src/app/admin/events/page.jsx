'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEPT_OPTIONS = ['Campus Wide', 'CSE', 'CS&IT', 'AI & Data Science', 'ECE', 'Freshman Engineering', 'MCA', 'BCA', 'MBA', 'BBA'];


function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toInputDate(d) {
  if (!d) return '';
  return String(d).slice(0, 10);
}

const EMPTY_EDIT = { title: '', description: '', departments: [], eventDate: '', imageUrl: '', link: '' };

export default function ManageEventsPage() {
  const router = useRouter();
  const [events, setEvents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState('');
  const [ok, setOk]                 = useState('');
  const [editingId, setEditingId]   = useState(null);
  const [editForm, setEditForm]     = useState(EMPTY_EDIT);
  const [editVisible, setEditVisible] = useState(false);
  const editRef = useRef(null);

  const handleUnauth = useCallback(() => {    router.push('/'); router.refresh();
  }, [router]);

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/events', { cache: 'no-store', credentials: 'include' });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Failed to load');
      const d = await res.json();
      setEvents(Array.isArray(d?.events) ? d.events : []);
    } catch (err) { setError(err?.message || 'Failed to load'); }
    finally { setLoading(false); }
  }, [handleUnauth]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Sort events by date desc (grouping removed — events can span multiple depts)
  const sorted = useMemo(() => [...events].sort((a, b) => {
    if (a.eventDate && b.eventDate) return new Date(b.eventDate) - new Date(a.eventDate);
    if (a.eventDate) return -1;
    if (b.eventDate) return 1;
    return 0;
  }), [events]);

  const startEdit = (ev) => {
    setEditVisible(false);
    setEditingId(ev.id);
    setEditForm({
      title: ev.title, description: ev.description,
      departments: Array.isArray(ev.departments) ? ev.departments : [],
      eventDate: toInputDate(ev.eventDate),
      imageUrl: ev.imageUrl, link: ev.link,
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
      const res = await fetch('/api/admin/events', {
        method: 'PUT', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id:          editingId,
          title:       editForm.title.trim(),
          description: editForm.description.trim(),
          departments: editForm.departments,
          eventDate:   editForm.eventDate || null,
          imageUrl:    editForm.imageUrl,
          link:        editForm.link.trim(),
        }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Update failed');
      setOk('Event updated ✓');
      cancelEdit();
      await loadAll();
    } catch (err) { setError(err?.message || 'Update failed'); }
    finally { setSubmitting(false); }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setEditForm(f => ({ ...f, imageUrl: data?.url || '' }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) { handleUnauth(); return; }
      if (!res.ok) throw new Error('Delete failed');
      setOk('Event deleted');
      if (editingId === id) cancelEdit();
      await loadAll();
    } catch (err) { setError(err?.message || 'Delete failed'); }
    finally { setSubmitting(false); }
  };

  const ef = editForm;
  const setEf = (key) => (e) => setEditForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="container portal-wrap" style={{ maxWidth: 900 }}>
      {error && <div className="portal-error portal-toast" style={{ marginBottom: '1rem' }}>{error}</div>}
      {ok    && <div className="portal-ok portal-toast"    style={{ marginBottom: '1rem' }}>{ok}</div>}

      {/* Edit panel */}
      {editingId && (
        <div ref={editRef} className="portal-card"
          style={{
            marginBottom: '20px', borderLeft: '4px solid var(--primary-color)',
            opacity: editVisible ? 1 : 0,
            transform: editVisible ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'opacity 0.28s ease, transform 0.28s ease',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="portal-card-kicker" style={{ margin: 0 }}>Editing Event</div>
            <button className="portal-btn portal-btn-secondary portal-btn-small" type="button" onClick={cancelEdit}>✕ Cancel</button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Event Title
              <input className="portal-input" value={ef.title} onChange={setEf('title')} />
            </label>
          </div>
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <div>
              <div className="portal-label" style={{ marginBottom: 6 }}>Departments <span className="portal-muted" style={{ fontWeight: 400 }}>(pick all that apply)</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {DEPT_OPTIONS.map(d => {
                  const active = ef.departments.includes(d);
                  return (
                    <button key={d} type="button"
                      className={`role-pill-btn${active ? ' role-pill-btn--active' : ''}`}
                      onClick={() => setEditForm(f => ({
                        ...f,
                        departments: active ? f.departments.filter(x => x !== d) : [...f.departments, d],
                      }))}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="portal-label">Event Date
              <input className="portal-input" type="date" value={ef.eventDate} onChange={setEf('eventDate')} />
            </label>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Description
              <textarea className="portal-input" rows={3} value={ef.description} onChange={setEf('description')} style={{ resize: 'vertical' }} />
            </label>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Image
              <input className="portal-input" type="file" accept="image/jpeg,image/png,image/webp"
                onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} disabled={uploading} />
              {uploading && <span className="portal-muted" style={{ fontSize: '0.8rem' }}>Uploading…</span>}
              {ef.imageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img src={ef.imageUrl} alt="preview" style={{ width: 100, height: 68, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }} />
                  <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                    onClick={() => setEditForm(f => ({ ...f, imageUrl: '' }))}>Remove</button>
                </div>
              )}
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="portal-label">External Link
              <input className="portal-input" value={ef.link} onChange={setEf('link')} placeholder="https://…" />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="portal-btn" type="button" onClick={saveEdit} disabled={submitting} style={{ minWidth: 130 }}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
            <button className="portal-btn portal-btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="portal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div className="portal-card-kicker" style={{ margin: 0 }}>Events</div>
            <div className="portal-muted" style={{ fontSize: '0.82rem', marginTop: 2 }}>
              {loading ? 'Loading…' : `${events.length} event${events.length !== 1 ? 's' : ''}`}
            </div>
          </div>
          <a href="/admin/events/add" className="portal-btn" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>+ Add Event</a>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1,2,3].map(i => <div key={i} className="faculty-row-skeleton" />)}
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <div className="portal-muted" style={{ marginBottom: '0.75rem' }}>No events yet.</div>
            <a href="/admin/events/add" className="portal-btn" style={{ display: 'inline-flex', textDecoration: 'none', fontSize: '0.88rem' }}>+ Add First Event</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sorted.map((ev, idx) => (
              <div key={ev.id} className={`faculty-list-row${editingId === ev.id ? ' faculty-list-row--editing' : ''}`}
                style={{ animationDelay: `${idx * 40}ms` }}>
                {/* Thumbnail */}
                <div style={{
                  width: 52, height: 52, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(165,42,42,0.12), rgba(46,58,89,0.12))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {ev.imageUrl
                    ? <img src={ev.imageUrl} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.4rem' }}>📅</span>
                  }
                </div>

                {/* Info */}
                <div className="faculty-row-info">
                  <div className="faculty-row-name">{ev.title || '—'}</div>
                  <div className="faculty-row-sub" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
                    {ev.eventDate ? formatDate(ev.eventDate) : <span className="portal-muted">No date set</span>}
                    {ev.departments?.length > 0 && ev.departments.map(d => (
                      <span key={d} style={{
                        fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px',
                        borderRadius: 20, background: 'rgba(46,58,89,0.1)', color: 'var(--secondary-color)',
                      }}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Link indicator */}
                {ev.link && (
                  <a href={ev.link} target="_blank" rel="noreferrer"
                    style={{ fontSize: '0.72rem', color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
                    ↗ Link
                  </a>
                )}

                {/* Actions */}
                <div className="faculty-row-actions">
                  <button className={`portal-btn portal-btn-small${editingId === ev.id ? ' portal-btn-active' : ''}`}
                    type="button" onClick={() => startEdit(ev)} disabled={submitting}>
                    {editingId === ev.id ? 'Editing…' : 'Edit'}
                  </button>
                  <button className="portal-btn portal-btn-secondary portal-btn-small delete-btn"
                    type="button" onClick={() => deleteEvent(ev.id)} disabled={submitting}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
