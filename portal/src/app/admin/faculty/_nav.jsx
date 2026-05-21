'use client';

// eslint-disable-next-line no-unused-vars
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="admin-nav-bar">
      <div className="admin-nav-links">
        <Link
          href="/admin/faculty/add"
          className={`admin-nav-link${pathname === '/admin/faculty/add' ? ' active' : ''}`}
        >
          + Add Faculty
        </Link>
        <Link
          href="/admin/faculty"
          className={`admin-nav-link${pathname === '/admin/faculty' ? ' active' : ''}`}
        >
          Manage Faculty
        </Link>
      </div>
      <button className="portal-btn portal-btn-secondary portal-btn-small" type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
