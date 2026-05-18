'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [faculty, setFaculty] = useState([]);

  const [form, setForm] = useState({
    email: '',
    name: '',
    department: '',
    designation: '',
    password: '',
  });

  const canCreate = useMemo(() => {
    return !submitting && form.email.trim() && form.password.trim();
  }, [submitting, form.email, form.password]);

  const getAuthHeaders = () => {
    const token = window.localStorage.getItem('klh_admin_token') || window.sessionStorage.getItem('klh_admin_token') || '';
    return token ? { authorization: `Bearer ${token}` } : {};
  };

  const loadList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/faculty', { cache: 'no-store', credentials: 'include', headers: getAuthHeaders() });
      if (res.status === 401) {
        window.localStorage.removeItem('klh_admin_token');
        window.sessionStorage.removeItem('klh_admin_token');
        router.push('/admin');
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error('Failed to load faculty list');
      const data = await res.json();
      setFaculty(Array.isArray(data?.faculty) ? data.faculty : []);
    } catch (err) {
      setError(err?.message || 'Failed to load faculty list');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const onLogout = async () => {
    window.localStorage.removeItem('klh_admin_token');
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include', headers: getAuthHeaders() }).catch(() => null);
    router.push('/admin');
    router.refresh();
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    setSubmitting(true);
    setError('');
    setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(form),
      });
      if (res.status === 401) {
        router.push('/admin');
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Create failed');
      }
      setOk('Faculty created');
      setForm({ email: '', name: '', department: '', designation: '', password: '' });
      await loadList();
    } catch (err) {
      setError(err?.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onResetPassword = async (id) => {
    const password = window.prompt('Set a new password for this faculty:');
    if (!password) return;
    setSubmitting(true);
    setError('');
    setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id, password }),
      });
      if (res.status === 401) {
        router.push('/admin');
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Reset failed');
      }
      setOk('Password updated');
    } catch (err) {
      setError(err?.message || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteFaculty = async (id) => {
    const confirmed = window.confirm('Delete this faculty account?');
    if (!confirmed) return;
    setSubmitting(true);
    setError('');
    setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        window.localStorage.removeItem('klh_admin_token');
        window.sessionStorage.removeItem('klh_admin_token');
        router.push('/admin');
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Delete failed');
      }
      setOk('Faculty deleted');
      await loadList();
    } catch (err) {
      setError(err?.message || 'Delete failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onClearAll = async () => {
    const confirmed = window.confirm('Delete all faculty accounts?');
    if (!confirmed) return;
    setSubmitting(true);
    setError('');
    setOk('');
    try {
      const res = await fetch('/api/admin/faculty', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ all: true }),
      });
      if (res.status === 401) {
        window.localStorage.removeItem('klh_admin_token');
        window.sessionStorage.removeItem('klh_admin_token');
        router.push('/admin');
        router.refresh();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Clear failed');
      }
      setOk('All faculty cleared');
      await loadList();
    } catch (err) {
      setError(err?.message || 'Clear failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container portal-wrap">
      <div className="portal-card">
        <div className="portal-header-row">
          <div>
            <div className="portal-card-kicker">Manage Faculty</div>
            <div className="portal-muted">Create faculty accounts and reset passwords</div>
          </div>
          <button className="portal-btn portal-btn-secondary" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="portal-split">
          <div className="portal-card portal-card-inner">
            <div className="portal-card-kicker">Register Faculty</div>
            <form onSubmit={onCreate} className="portal-form">
              <label className="portal-label">
                Email
                <input className="portal-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
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
                Initial Password
                <input className="portal-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>

              {error ? <div className="portal-error">{error}</div> : null}
              {ok ? <div className="portal-ok">{ok}</div> : null}

              <button className="portal-btn" type="submit" disabled={!canCreate}>
                {submitting ? 'Creating…' : 'Create account'}
              </button>
            </form>
          </div>

          <div className="portal-card portal-card-inner">
            <div className="portal-header-row">
              <div className="portal-card-kicker">Faculty List</div>
              <button className="portal-btn portal-btn-secondary portal-btn-small" type="button" onClick={onClearAll} disabled={submitting || loading || !faculty.length}>
                Clear All
              </button>
            </div>
            {loading ? (
              <div className="portal-muted">Loading…</div>
            ) : faculty.length ? (
              <div className="portal-table-scroll">
                <div className="portal-table">
                  <div className="portal-row portal-row-head">
                    <div className="portal-th portal-cell">Email</div>
                    <div className="portal-th portal-cell">Name</div>
                    <div className="portal-th portal-cell">Department</div>
                    <div className="portal-th portal-actions-head">Actions</div>
                  </div>
                  {faculty.map((f) => (
                    <div className="portal-row" key={f.id}>
                      <div className="portal-strong portal-cell">{f.email}</div>
                      <div className="portal-cell">{f.name || '—'}</div>
                      <div className="portal-cell">{f.department || '—'}</div>
                      <div className="portal-actions">
                        <button className="portal-btn portal-btn-small" type="button" onClick={() => onResetPassword(f.id)}>
                          Reset
                        </button>
                        <button className="portal-btn portal-btn-secondary portal-btn-small" type="button" onClick={() => onDeleteFaculty(f.id)} disabled={submitting}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="portal-muted">No faculty yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
