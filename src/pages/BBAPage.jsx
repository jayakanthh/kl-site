import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const BBAPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">School of Management</div>
            <h1>Bachelor of Business Administration (BBA)</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'BBA' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            BBA introduces students to core business disciplines including accounting, economics, marketing, HR and operations while
            developing communication, analytics and entrepreneurial skills.
          </p>
          <p>
            The programme builds a strong base for early career roles in business functions and for higher studies in management.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BBAPage;
