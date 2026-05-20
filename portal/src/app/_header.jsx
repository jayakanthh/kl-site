/* eslint-disable no-unused-vars */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function PortalHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const isAdmin  = pathname?.startsWith('/admin');

  const logout = async () => {
    const t = window.localStorage.getItem('klh_admin_token') || '';
    window.localStorage.removeItem('klh_admin_token');
    window.sessionStorage.removeItem('klh_admin_token');
    await fetch('/api/admin/logout', {
      method: 'POST', credentials: 'include',
      headers: t ? { authorization: `Bearer ${t}` } : {},
    }).catch(() => null);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="portal-shell-top">
      <div className="container portal-shell-top-inner">
        {/* Logo */}
        <a href="/" className="portal-brand">
          <img src="/logo-final.png?v=20260324" alt="KL University Logo" />
        </a>

        {/* Admin nav — only on /admin/* */}
        {isAdmin && (
          <>
            <nav className="portal-header-nav">
              <Link
                href="/admin/faculty/add"
                className={`portal-header-link${pathname === '/admin/faculty/add' ? ' active' : ''}`}
              >
                + Add Faculty
              </Link>
              <Link
                href="/admin/faculty"
                className={`portal-header-link${pathname === '/admin/faculty' ? ' active' : ''}`}
              >
                Manage Faculty
              </Link>
            </nav>

            <button className="portal-header-logout" type="button" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
