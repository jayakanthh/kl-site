'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptEvents from '../components/DeptEvents';

const CampusLifePage = () => (
  <div className="App">
    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">KLH Hyderabad</div>
          <h1>Campus Life &amp; Events</h1>
        </div>
      </div>
    </section>

    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Campus Life' }]} />
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="csit-section-title" style={{ marginBottom: '1.25rem' }}>
          Talks &amp; Events
        </div>
        <DeptEvents dept="Campus Wide" />
      </div>
    </section>

    <Footer />
  </div>
);

export default CampusLifePage;
