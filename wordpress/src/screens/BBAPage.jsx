'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const BBAPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">School of Management</div>
          <h1>Bachelor of Business Administration (BBA)</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'BBA' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Program Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Bachelor of Business Administration</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>BBA introduces students to core business disciplines including accounting, economics, marketing, HR and operations while developing communication, analytics and entrepreneurial skills.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The programme builds a strong base for early career roles in business functions and for higher studies in management.</p>
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

export default BBAPage;
