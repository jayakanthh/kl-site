import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const MCAPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">School of Computing</div>
            <h1>Master of Computer Applications (MCA)</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'MCA' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            MCA is a postgraduate programme focused on software engineering, systems design and application development. The curriculum
            blends advanced programming, databases, distributed systems, cloud computing and modern development practices.
          </p>
          <p>
            Students gain hands‑on experience building production‑grade applications with contemporary stacks and are prepared for
            roles in full‑stack development, solution engineering and technical leadership.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MCAPage;
