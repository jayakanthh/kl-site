'use client';
import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import './FacultyPage.css';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const DEPARTMENT_LABELS = {
  CSE:    'Faculty of Computer Science & Engineering',
  'CS&IT':'Faculty of Computer Science & Information Technology',
  CSIT:   'Faculty of Computer Science & Information Technology',
  ECE:    'Faculty of Electronics & Communication Engineering',
  BBA:    'Faculty of Business Administration',
  BCA:    'Faculty of Computer Applications',
  MBA:    'Faculty of Business Administration (MBA)',
  MCA:    'Faculty of Computer Applications (MCA)',
  FE:     'Faculty of Freshman Engineering',
  'AI-DS':'Faculty of Artificial Intelligence & Data Science',
};

const DEPARTMENT_ROUTES = {
  CSE:    '/cse',
  'CS&IT':'/csit',
  CSIT:   '/csit',
  ECE:    '/ece',
  BBA:    '/bba',
  BCA:    '/bca',
  MBA:    '/mba',
  MCA:    '/mca',
  FE:     '/fe',
  'AI-DS':'/ai-ds',
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

function labelForDepartment(dept) {
  const key = String(dept || '').trim().toUpperCase().replace(/\s+/g, ' ');
  return DEPARTMENT_LABELS[key] || (dept ? `Faculty of ${String(dept).trim()}` : 'Other');
}

function routeForDepartment(dept) {
  const key = String(dept || '').trim().toUpperCase().replace(/\s+/g, ' ');
  return DEPARTMENT_ROUTES[key] ? `${BASE}${DEPARTMENT_ROUTES[key]}` : null;
}

function isRealEmail(email) {
  return email && !email.endsWith('@noemail.klh');
}

/* ── Principal hero card ─────────────────────────────────── */
function PrincipalCard({ f }) {
  return (
    <div className="principal-hero">
      <div className="principal-photo-wrap">
        {f.photoUrl
          ? <img src={f.photoUrl} alt={f.name} className="principal-photo" />
          : <div className="principal-photo-fallback">👤</div>}
        <div className="principal-name-badge">
          <div className="principal-name">{f.name || '—'}</div>
          <div className="principal-badge">Principal</div>
        </div>
      </div>

      <div className="principal-info">
        {f.designation && <div className="principal-designation">{f.designation}</div>}
        {f.department && <div className="principal-dept">{labelForDepartment(f.department)}</div>}
        {f.bio && <p className="principal-bio">{f.bio}</p>}
        {f.researchInterests && (
          <div className="principal-row"><strong>Research:</strong> {f.researchInterests}</div>
        )}
        {f.office && (
          <div className="principal-row"><strong>Office:</strong> {f.office}</div>
        )}
        {f.phone && (
          <div className="principal-row"><strong>Phone:</strong> {f.phone}</div>
        )}
        {(f.linkedin || f.googleScholar || isRealEmail(f.email)) && (
          <div className="principal-links">
            {f.linkedin && <a href={f.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {f.googleScholar && <a href={f.googleScholar} target="_blank" rel="noreferrer">Scholar</a>}
            {isRealEmail(f.email) && <a href={`mailto:${f.email}`}>Email</a>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Single faculty card ─────────────────────────────────── */
function FacultyCard({ f }) {
  const showEmail   = isRealEmail(f.email);
  const hasLinks    = !!(f.linkedin || f.xHandle || f.googlePlus || showEmail);
  const hasSubjects = Array.isArray(f.subjects) && f.subjects.length > 0;
  const hasOverlay  = hasLinks || hasSubjects;

  return (
    <div className="faculty-card-wrap">
      {f.isHOD && <div className="faculty-hod-badge">HOD</div>}

      <div className="faculty-card">
        {/* Photo + glass overlay */}
        <div className="faculty-photo">
          {f.photoUrl
            ? <img src={f.photoUrl} alt={f.name} />
            : <div className="faculty-photo-fallback">👤</div>}

          {hasOverlay && (
            <div className="faculty-glass-overlay">
              {/* Subjects */}
              {hasSubjects && (
                <div className="faculty-glass-subjects">
                  {f.subjects.map((s, i) => (
                    <span key={i} className="faculty-glass-tag">{s}</span>
                  ))}
                </div>
              )}

              {/* Social links */}
              {hasLinks && (
                <div className="faculty-glass-links">
                  {f.linkedin && (
                    <a className="faculty-social-btn faculty-social-linkedin"
                      href={f.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                      <Linkedin size={15} />
                    </a>
                  )}
                  {f.xHandle && (
                    <a className="faculty-social-btn faculty-social-x"
                      href={f.xHandle.startsWith('http') ? f.xHandle : `https://x.com/${f.xHandle.replace(/^@/, '')}`}
                      target="_blank" rel="noreferrer" title="X / Twitter">
                      <Twitter size={15} />
                    </a>
                  )}
                  {f.googlePlus && (
                    <a className="faculty-social-btn faculty-social-gplus"
                      href={f.googlePlus} target="_blank" rel="noreferrer" title="Google+">
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '-0.5px' }}>G+</span>
                    </a>
                  )}
                  {showEmail && (
                    <a className="faculty-social-btn faculty-social-email"
                      href={`mailto:${f.email}`} title="Email">
                      <Mail size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Name + designation */}
        <div className="faculty-card-info">
          <div className="faculty-name">{[f.title, f.name].filter(Boolean).join(' ') || '—'}</div>
          {f.designation && <div className="faculty-desig">{f.designation}</div>}
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [deptOrder, setDeptOrder] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const portalUrl = String(process.env.NEXT_PUBLIC_FACULTY_PORTAL_URL || '').replace(/\/+$/, '');
    if (!portalUrl) { setStatus('unconfigured'); return; } // eslint-disable-line react-hooks/set-state-in-effect
    fetch(`${portalUrl}/api/faculty`)
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setFaculty(Array.isArray(data?.faculty) ? data.faculty : []); // eslint-disable-line react-hooks/set-state-in-effect
        setDeptOrder(Array.isArray(data?.deptOrder) ? data.deptOrder : []); // eslint-disable-line react-hooks/set-state-in-effect
        setStatus('ok'); // eslint-disable-line react-hooks/set-state-in-effect
      })
      .catch(() => setStatus('error')); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const principal = faculty.filter((f) => f.isPrincipal);
  const nonPrincipal = faculty.filter((f) => !f.isPrincipal);

  const groupsMap = new Map();
  for (const f of nonPrincipal) {
    const dept = String(f?.department || '').trim() || 'Other';
    if (!groupsMap.has(dept)) groupsMap.set(dept, []);
    groupsMap.get(dept).push(f);
  }
  const groups = [...groupsMap.entries()]
    .sort(([a], [b]) => {
      const ia = deptOrder.indexOf(a), ib = deptOrder.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    })
    .map(([dept, items]) => ({ key: dept, label: labelForDepartment(dept), route: routeForDepartment(dept), items }));

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
            <div className="faculty-empty"><div className="faculty-empty-title">Loading faculty profiles…</div></div>
          )}
          {status === 'unconfigured' && (
            <div className="faculty-empty">
              <div className="faculty-empty-title">Faculty portal not configured</div>
              <div className="faculty-empty-sub">Set <code>NEXT_PUBLIC_FACULTY_PORTAL_URL</code> to your portal URL.</div>
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
                  <div className="faculty-grid faculty-grid-centered">
                    {principal.map((f) => <FacultyCard key={f.id} f={f} />)}
                  </div>
                </div>
              )}
              {groups.map((group) => (
                <div key={group.key} className="faculty-section">
                  <div className="faculty-section-title">
                    {group.route
                      ? <a href={group.route} className="faculty-section-link">{group.label}</a>
                      : group.label}
                  </div>
                  <div className="faculty-grid">
                    {group.items.map((f) => <FacultyCard key={f.id} f={f} />)}
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
