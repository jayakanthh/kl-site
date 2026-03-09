import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const BCAPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">School of Computing</div>
            <h1>Bachelor of Computer Applications (BCA)</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'BCA' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            BCA provides a strong foundation in computer applications and software development, with emphasis on programming,
            databases, web technologies and modern application frameworks.
          </p>
          <p>
            The programme prepares students for entry‑level roles in software development and sets the base for higher studies in
            computing disciplines.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BCAPage;
