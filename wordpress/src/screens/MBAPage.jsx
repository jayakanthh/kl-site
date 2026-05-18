'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const MBAPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">School of Management</div>
          <h1>Master of Business Administration (MBA)</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'MBA' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Program Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Master of Business Administration</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>MBA blends core management education with analytics-driven decision making. The programme covers finance, marketing, operations, strategy and leadership while integrating data analytics, visualization and digital business.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Students work on live cases and projects to build managerial judgment and practical skills aligned to contemporary industry expectations.</p>
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

export default MBAPage;
