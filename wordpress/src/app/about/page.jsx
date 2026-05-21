import Breadcrumb from '../../components/Breadcrumb';
import Footer from '../../components/Footer';
import './about.css';

export const metadata = {
  title: 'About Us | KLH Hyderabad',
  description: 'Learn about KL Deemed to be University Hyderabad — our history, vision, leadership and achievements.',
};

const MILESTONES = [
  { year: '1980', label: 'Founded', desc: 'Established as Koneru Lakshmaiah Charities trust by Sri Koneru Lakshmaiah and Sri Koneru Satyanarayana — one of the first private engineering colleges in Andhra Pradesh.' },
  { year: '2006', label: 'Autonomous Status', desc: 'Granted autonomous status by the University Grants Commission (UGC), enabling independent curriculum design and academic excellence.' },
  { year: '2009', label: 'Deemed University', desc: 'Recognised as a Deemed to be University, marking a landmark achievement in academic governance and research capability.' },
  { year: '2019', label: 'Category-I', desc: 'Awarded the prestigious UGC Category-I Institution status for excellence in technical education — placing KLH among India\'s top universities.' },
];

const STATS = [
  { value: '40+', label: 'Years of Excellence' },
  { value: '2', label: 'Campuses' },
  { value: '1:15', label: 'Student-Faculty Ratio' },
  { value: 'Cat. I', label: 'UGC Status' },
];

const LEADERSHIP = [
  { role: 'President', name: 'Sri Koneru Satyanarayana' },
  { role: 'Vice Chancellor', name: 'Dr. G.P. Saradhi Varma' },
  { role: 'Pro Chancellor', name: 'Dr. K.S. Jagannatha Rao' },
  { role: 'Registrar', name: 'Dr. K. Subbarao' },
];

export default function AboutPage() {
  return (
    <div className="App">
      {/* Hero */}
      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Our Story</div>
            <h1>About KLH</h1>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0.25rem' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'About Us' }]} />
        </div>
      </section>

      {/* Intro */}
      <section className="section about-intro-section">
        <div className="container about-intro">
          <div className="about-intro-text">
            <h2>A Legacy of Learning</h2>
            <p>
              KL (Hyderabad) Deemed to be University traces its roots to 1980, when visionaries
              Sri Koneru Lakshmaiah and Sri Koneru Satyanarayana established Koneru Lakshmaiah
              Charities — one of the first private engineering colleges in Andhra Pradesh.
            </p>
            <p>
              Over four decades, the institution has grown from a single engineering college into
              a full-fledged deemed university with campuses in Vijayawada and Hyderabad, offering
              undergraduate, postgraduate, and doctoral programmes across engineering and management.
            </p>
            <p>
              Committed to promoting international standards in education, research, innovation
              and entrepreneurship, KLH maintains world-class campus facilities and a perfect
              balance between academics and extra-curricular activities.
            </p>
          </div>
          <div className="about-stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat-card">
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section about-vm-section">
        <div className="container about-vm-grid">
          <div className="about-vm-card">
            <div className="about-vm-icon">🎯</div>
            <h3>Vision</h3>
            <p>
              To be an abode for engineering and management education — establishing KLH among
              the nation's elite institutions through academic rigour, innovation, and a commitment
              to global standards.
            </p>
          </div>
          <div className="about-vm-card">
            <div className="about-vm-icon">🚀</div>
            <h3>Mission</h3>
            <p>
              To promote international standards in education, research, innovation and
              entrepreneurship. To nurture talent through experiential learning, interdisciplinary
              approaches, and state-of-the-art facilities that prepare graduates for a dynamic world.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <h2 className="about-section-heading">Key Milestones</h2>
          <div className="about-timeline">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className={`about-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="about-timeline-year">{m.year}</div>
                <div className="about-timeline-content">
                  <div className="about-timeline-label">{m.label}</div>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section about-leadership-section">
        <div className="container">
          <h2 className="about-section-heading">Leadership</h2>
          <div className="about-leadership-grid">
            {LEADERSHIP.map((l) => (
              <div key={l.role} className="about-leadership-card">
                <div className="about-leadership-avatar">
                  {l.name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()}
                </div>
                <div className="about-leadership-name">{l.name}</div>
                <div className="about-leadership-role">{l.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
