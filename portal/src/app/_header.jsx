'use client';

// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function PortalHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const isAdmin  = pathname?.startsWith('/admin');

  const logout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null);
    router.push('/');
    router.refresh();
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="portal-shell-top">
        <div className="container portal-shell-top-inner">
          <a href="/" className="portal-brand">
            <img src="/logo-final.png?v=20260324" alt="KL University Logo" />
          </a>

          <nav className="portal-header-nav">
            {/* Faculty */}
            <Link href="/admin/faculty/add"
              className={`portal-header-link${pathname === '/admin/faculty/add' ? ' active' : ''}`}>
              + Add Profile
            </Link>
            <Link href="/admin/faculty"
              className={`portal-header-link${pathname === '/admin/faculty' ? ' active' : ''}`}>
              Profiles
            </Link>

            <span className="portal-nav-sep" />

            {/* Events */}
            <Link href="/admin/events/add"
              className={`portal-header-link${pathname === '/admin/events/add' ? ' active' : ''}`}>
              + Add Event
            </Link>
            <Link href="/admin/events"
              className={`portal-header-link${pathname === '/admin/events' ? ' active' : ''}`}>
              Events
            </Link>
          </nav>

          <button className="portal-header-logout" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ height: 72, flexShrink: 0 }} />
    </>
  );
}
