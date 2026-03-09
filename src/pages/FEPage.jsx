import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const FEPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Foundation Year</div>
            <h1>Freshman Engineering</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Freshman Engineering' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            Freshman Engineering builds a strong foundation in mathematics, physics, programming and engineering graphics while
            introducing students to lab practices, design thinking and interdisciplinary exposure across departments.
          </p>
          <p>
            The year focuses on communication skills, teamwork and project‑based learning so students are industry‑ready and prepared
            for advanced courses in their chosen specialization.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FEPage;
