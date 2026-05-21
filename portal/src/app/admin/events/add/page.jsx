'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { EVENT_DEPT_OPTIONS as DEPT_OPTIONS } from '../../../../lib/constants';



const EMPTY = {
  title: '', description: '', departments: [], eventDate: '', imageUrl: '', link: '',
};

export default function AddEventPage() {
  const router = useRouter();
  const [form, setForm]             = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState('');
  const [ok, setOk]                 = useState('');

  const canSave = useMemo(() => !submitting && form.title.trim(), [submitting, form.title]);
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload/photo', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(f => ({ ...f, imageUrl: data?.url || '' }));
    } catch (err) { setError(err?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSubmitting(true); setError(''); setOk('');
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST', credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title:       form.title.trim(),
          description: form.description.trim(),
          departments: form.departments,
          eventDate:   form.eventDate || null,
          imageUrl:    form.imageUrl,
          link:        form.link.trim(),
        }),
      });
      if (res.status === 401) { router.push('/'); return; }
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.error || 'Create failed'); }
      setOk('Event added!');
      setForm(EMPTY);
      setTimeout(() => router.push('/admin/events'), 900);
    } catch (err) { setError(err?.message || 'Create failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="container portal-wrap" style={{ maxWidth: 780 }}>
      <div className="portal-card">
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="portal-card-kicker">Add Event</div>
        </div>

        {error && <div className="portal-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {ok    && <div className="portal-ok"    style={{ marginBottom: '1rem' }}>{ok}</div>}

        <form onSubmit={onSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Event Title *
              <input className="portal-input" value={form.title} onChange={set('title')} placeholder="e.g. Annual Tech Fest 2026" />
            </label>
          </div>

          {/* Dept + Date */}
          <div className="portal-grid" style={{ marginBottom: '12px' }}>
            <div>
              <div className="portal-label" style={{ marginBottom: 6 }}>Departments <span className="portal-muted" style={{ fontWeight: 400 }}>(pick all that apply)</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {DEPT_OPTIONS.map(d => {
                  const active = form.departments.includes(d);
                  return (
                    <button key={d} type="button"
                      className={`role-pill-btn${active ? ' role-pill-btn--active' : ''}`}
                      onClick={() => setForm(f => ({
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
              <input className="portal-input" type="date" value={form.eventDate} onChange={set('eventDate')} />
            </label>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Description
              <textarea className="portal-input" rows={4} value={form.description} onChange={set('description')}
                placeholder="Brief description of the event…" style={{ resize: 'vertical' }} />
            </label>
          </div>

          {/* Image */}
          <div style={{ marginBottom: '12px' }}>
            <label className="portal-label">Event Image
              <input className="portal-input" type="file" accept="image/jpeg,image/png,image/webp"
                onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} disabled={uploading} />
              {uploading && <span className="portal-muted" style={{ fontSize: '0.8rem' }}>Uploading…</span>}
              {form.imageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img src={form.imageUrl} alt="preview" style={{ width: 100, height: 68, borderRadius: 8, objectFit: 'cover', border: '1px solid #ddd' }} />
                  <button type="button" className="portal-btn portal-btn-secondary portal-btn-small"
                    onClick={() => setForm(f => ({ ...f, imageUrl: '' }))}>Remove</button>
                </div>
              )}
            </label>
          </div>

          {/* External Link */}
          <div style={{ marginBottom: '20px' }}>
            <label className="portal-label">External Link <span className="portal-muted" style={{ fontWeight: 600 }}>(optional)</span>
              <input className="portal-input" value={form.link} onChange={set('link')} placeholder="https://…" />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="portal-btn" type="submit" disabled={!canSave} style={{ minWidth: 140 }}>
              {submitting ? 'Adding…' : 'Add Event'}
            </button>
            <button className="portal-btn portal-btn-secondary" type="button"
              onClick={() => router.push('/admin/events')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
