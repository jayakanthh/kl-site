'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const BCAPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">School of Computing</div>
          <h1>Bachelor of Computer Applications (BCA)</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'BCA' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Program Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Bachelor of Computer Applications</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>BCA provides a strong foundation in computer applications and software development, with emphasis on programming, databases, web technologies and modern application frameworks.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The programme prepares students for entry-level roles in software development and sets the base for higher studies in computing disciplines.</p>
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

export default BCAPage;
