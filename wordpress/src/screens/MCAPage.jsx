'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const MCAPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">School of Computing</div>
          <h1>Master of Computer Applications (MCA)</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'MCA' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Program Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Master of Computer Applications</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>MCA is a postgraduate programme focused on software engineering, systems design and application development. The curriculum blends advanced programming, databases, distributed systems, cloud computing and modern development practices.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>Students gain hands-on experience building production-grade applications with contemporary stacks and are prepared for roles in full-stack development, solution engineering and technical leadership.</p>
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

export default MCAPage;
