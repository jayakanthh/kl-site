import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const MBAPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">School of Management</div>
            <h1>Master of Business Administration (MBA)</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'MBA' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            MBA blends core management education with analytics‑driven decision making. The programme covers finance, marketing,
            operations, strategy and leadership while integrating data analytics, visualization and digital business.
          </p>
          <p>
            Students work on live cases and projects to build managerial judgment and practical skills aligned to contemporary
            industry expectations.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MBAPage;
