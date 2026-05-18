import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  const isInternalHref = (href) => typeof href === 'string' && href.startsWith('/');

  return (
    <nav className="breadcrumbs">
      <Link className="crumb-home" href="/">
        <Home size={16} />
        <span>Home</span>
      </Link>
      {items?.map((item, idx) => (
        <div key={idx} className="crumb">
          <ChevronRight size={14} />
          {item.href ? (
            isInternalHref(item.href) ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <a href={item.href}>{item.label}</a>
            )
          ) : (
            <span className="current">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
