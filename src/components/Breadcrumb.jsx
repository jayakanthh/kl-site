import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumbs">
      <a className="crumb-home" href="/">
        <Home size={16} />
        <span>Home</span>
      </a>
      {items?.map((item, idx) => (
        <div key={idx} className="crumb">
          <ChevronRight size={14} />
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
