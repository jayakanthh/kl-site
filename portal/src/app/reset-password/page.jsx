'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  const canSubmit = email.trim() && otp.trim().length === 6
    && password.length >= 8 && password === confirm && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Reset failed');
      setDone(true);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />

      <div className="login-card">
        <div className="login-logo-wrap">
          <img src="/logo-final.png" alt="KLH University" className="login-logo" />
        </div>
        <div className="login-divider" />

        <div className="login-heading">
          <h1>Set New Password</h1>
          <p>Enter the 6-digit code from your email</p>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
            <p style={{ color: 'var(--secondary-color)', fontWeight: 700, marginBottom: 6 }}>
              Password updated!
            </p>
            <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: 20 }}>
              You can now sign in with your new password.
            </p>
            <button
              className="portal-btn login-btn"
              onClick={() => router.push('/')}
            >
              Go to login →
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="login-form">
            <div className="float-field">
              <input
                id="rp-email"
                className="float-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder=" "
                autoComplete="email"
                required
              />
              <label htmlFor="rp-email" className="float-label">Admin email</label>
            </div>

            <div className="float-field">
              <input
                id="rp-otp"
                className="float-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder=" "
                autoComplete="one-time-code"
                required
              />
              <label htmlFor="rp-otp" className="float-label">6-digit reset code</label>
            </div>

            <div className="float-field">
              <input
                id="rp-password"
                className="float-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=" "
                autoComplete="new-password"
                required
                minLength={8}
              />
              <label htmlFor="rp-password" className="float-label">New password (min 8 chars)</label>
            </div>

            <div className="float-field">
              <input
                id="rp-confirm"
                className="float-input"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <label htmlFor="rp-confirm" className="float-label">Confirm new password</label>
            </div>

            {confirm && password !== confirm && (
              <div className="portal-error portal-toast" style={{ fontSize: '0.88rem' }}>
                Passwords do not match
              </div>
            )}

            {error && (
              <div className="portal-error portal-toast" style={{ fontSize: '0.88rem' }}>{error}</div>
            )}

            <button
              className="portal-btn login-btn"
              type="submit"
              disabled={!canSubmit}
            >
              {submitting ? <><span className="login-spinner" /> Resetting…</> : 'Reset password'}
            </button>

            <button
              type="button"
              className="portal-btn portal-btn-secondary"
              style={{ marginTop: 8 }}
              onClick={() => router.push('/forgot-password')}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
