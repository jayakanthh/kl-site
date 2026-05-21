'use client';
import { useEffect, useState } from 'react';
import './DeptEvents.css';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DeptEvents({ dept }) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error | empty

  useEffect(() => {
    const portalUrl = String(process.env.NEXT_PUBLIC_FACULTY_PORTAL_URL || '').replace(/\/+$/, '');
    if (!portalUrl) {
      setStatus('empty'); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    const url = dept
      ? `${portalUrl}/api/events?dept=${encodeURIComponent(dept)}`
      : `${portalUrl}/api/events`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d?.events) ? d.events : [];
        setEvents(list);
        setStatus(list.length === 0 ? 'empty' : 'ok');
      })
      .catch(() => setStatus('error'));
  }, [dept]);

  if (status === 'loading') {
    return (
      <div className="dept-events-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="dept-event-card dept-event-skeleton" />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return <div className="dept-events-empty">Could not load events. Please try again later.</div>;
  }

  if (status === 'empty') {
    return <div className="dept-events-empty">No events yet — check back soon!</div>;
  }

  return (
    <div className="dept-events-grid">
      {events.map(ev => (
        <div key={ev.id} className="dept-event-card">
          {ev.imageUrl
            ? <img src={ev.imageUrl} alt={ev.title} />
            : <div className="dept-event-img-placeholder">📅</div>
          }
          <div className="dept-event-body">
            <div className="dept-event-title">{ev.title}</div>
            {ev.eventDate && (
              <div className="dept-event-date">{formatDate(ev.eventDate)}</div>
            )}
            {ev.description && (
              <div className="dept-event-desc">{ev.description}</div>
            )}
            {ev.link && (
              <a
                href={ev.link}
                target="_blank"
                rel="noreferrer"
                className="dept-event-link"
              >
                Learn more ↗
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
