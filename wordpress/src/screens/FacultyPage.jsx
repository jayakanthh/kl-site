'use client';
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const DEPARTMENT_LABELS = {
  CSE: 'Computer Science & Engineering',
  'CS&IT': 'Computer Science & Information Technology',
  CSIT: 'Computer Science & Information Technology',
  ECE: 'Electronics & Communication Engineering',
  BBA: 'Business Administration',
  BCA: 'Computer Applications',
  MBA: 'Business Administration (MBA)',
  MCA: 'Computer Applications (MCA)',
  FE: 'Freshman Engineering',
};

function normalizeDeptKey(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toUpperCase();
}

function labelForDepartment(dept) {
  const key = normalizeDeptKey(dept);
  return DEPARTMENT_LABELS[key] || (dept ? String(dept).trim() : 'Other');
}

function isPrincipalRecord(f) {
  const designation = String(f?.designation || '').toLowerCase();
  const department = String(f?.department || '').toLowerCase();
  return designation.includes('principal') || department === 'principal';
}

function FacultyCard({ f }) {
  return (
    <div className="faculty-card">
      <div className="faculty-photo">
        {f.photoUrl
          ? <img src={f.photoUrl} alt={f.name || f.email} />
          : <div className="faculty-photo-fallback" />}
      </div>
      <div className="faculty-body">
        <div className="faculty-name">{f.name || '—'}</div>
        <div className="faculty-meta">
          {f.designation ? <span>{f.designation}</span> : null}
          {f.department ? <span>{f.department}</span> : null}
        </div>
        {f.bio ? <div className="faculty-bio">{f.bio}</div> : null}
        <div className="faculty-links">
          {f.linkedin ? <a href={f.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
          {f.googleScholar ? <a href={f.googleScholar} target="_blank" rel="noreferrer">Scholar</a> : null}
          {f.email ? <a href={`mailto:${f.email}`}>Email</a> : null}
        </div>
      </div>
    </div>
  );
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error' | 'unconfigured'

  useEffect(() => {
    const portalUrl = String(process.env.NEXT_PUBLIC_FACULTY_PORTAL_URL || '').replace(/\/+$/, '');
    if (!portalUrl) {
      setStatus('unconfigured');
      return;
    }
    fetch(`${portalUrl}/api/faculty`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data?.faculty) ? data.faculty : [];
        setFaculty(list);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, []);

  const principal = faculty.filter(isPrincipalRecord);
  const nonPrincipal = faculty.filter((f) => !isPrincipalRecord(f));

  const groupsMap = new Map();
  for (const f of nonPrincipal) {
    const deptKey = normalizeDeptKey(f?.department) || 'OTHER';
    if (!groupsMap.has(deptKey)) groupsMap.set(deptKey, []);
    groupsMap.get(deptKey).push(f);
  }
  const groups = Array.from(groupsMap.entries())
    .map(([deptKey, items]) => ({ key: deptKey, label: labelForDepartment(deptKey), items }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="App">
      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Academics</div>
            <h1>Faculty</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0.25rem' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Faculty' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container faculty-wrap">
          {status === 'loading' && (
            <div className="faculty-empty">
              <div className="faculty-empty-title">Loading faculty profiles…</div>
            </div>
          )}

          {status === 'unconfigured' && (
            <div className="faculty-empty">
              <div className="faculty-empty-title">Faculty portal not configured</div>
              <div className="faculty-empty-sub">Set <code>NEXT_PUBLIC_FACULTY_PORTAL_URL</code> to your deployed portal URL.</div>
            </div>
          )}

          {status === 'error' && (
            <div className="faculty-empty">
              <div className="faculty-empty-title">Could not load faculty profiles</div>
              <div className="faculty-empty-sub">The faculty portal may be unavailable. Please try again later.</div>
            </div>
          )}

          {status === 'ok' && faculty.length === 0 && (
            <div className="faculty-empty">
              <div className="faculty-empty-title">No faculty profiles yet</div>
              <div className="faculty-empty-sub">Once profiles are added in the faculty portal, they'll appear here.</div>
            </div>
          )}

          {status === 'ok' && faculty.length > 0 && (
            <div className="faculty-sections">
              {principal.length > 0 && (
                <div className="faculty-section">
                  <div className="faculty-section-title">Principal</div>
                  <div className="faculty-section-panel">
                    <div className="faculty-grid">
                      {principal.map((f) => <FacultyCard key={f.id} f={f} />)}
                    </div>
                  </div>
                </div>
              )}
              {groups.map((group) => (
                <div key={group.key} className="faculty-section">
                  <div className="faculty-section-title">Faculty — {group.label}</div>
                  <div className="faculty-section-panel">
                    <div className="faculty-grid">
                      {group.items.map((f) => <FacultyCard key={f.id} f={f} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
