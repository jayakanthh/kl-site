'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const FEPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">Foundation Year</div>
          <h1>Freshman Engineering</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Freshman Engineering' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Department Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Freshman Engineering</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Freshman Engineering builds a strong foundation in mathematics, physics, programming and engineering graphics while introducing students to lab practices, design thinking and interdisciplinary exposure across departments.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The year focuses on communication skills, teamwork and project-based learning so students are industry-ready and prepared for advanced courses in their chosen specialization.</p>
            </div>
          )}
          {activeTab === 'Program Outcomes' && <div className="dept-coming-soon">Content will be updated soon</div>}
          {activeTab === 'Committees' && <div className="dept-coming-soon">Content will be updated soon</div>}
          {activeTab === 'Research' && <div className="dept-coming-soon">Content will be updated soon</div>}
          {activeTab === 'Events' && <div className="dept-coming-soon">Content will be updated soon</div>}
        </>
      )}
    </DeptTabLayout>

    <Footer />
  </div>
);

export default FEPage;
