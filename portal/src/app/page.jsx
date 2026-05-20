'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

function parseJsonLoose(text) {
  try { return JSON.parse(text); } catch { return null; }
}

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => email.trim() && password.trim() && !submitting, [email, password, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text().catch(() => '');
      const data = parseJsonLoose(text);
      if (!res.ok) throw new Error(data?.error || text || `Login failed (${res.status})`);
      if (data?.token) {
        window.localStorage.setItem('klh_admin_token', data.token);
        window.sessionStorage.setItem('klh_admin_token', data.token);
      }
      router.push('/admin/faculty');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container portal-wrap">
      <div className="portal-card">
        <div className="portal-card-kicker">Coordinator Login</div>
        <p className="portal-muted" style={{ marginBottom: '1.25rem' }}>Sign in to manage faculty profiles for the KLH Hyderabad website.</p>
        <form onSubmit={onSubmit} className="portal-form">
          <label className="portal-label">
            Email
            <input
              className="portal-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="coordinator@klh.edu.in"
              autoComplete="username"
            />
          </label>
          <label className="portal-label">
            Password
            <input
              className="portal-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error ? <div className="portal-error">{error}</div> : null}
          <button className="portal-btn" type="submit" disabled={!canSubmit}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
