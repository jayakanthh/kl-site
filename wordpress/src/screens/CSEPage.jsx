'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const CSEPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">Department of</div>
          <h1>Computer Science & Engineering</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'CSE' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Department Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Computer Science &amp; Engineering</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The Department of Computer Science and Engineering has eminent faculty with a blend of Academics and industry with varied specializations to impart their skill on the latest technologies for B.Tech students. The department offers a Doctoral program (PhD) in Computer Science and Engineering and works on emerging areas. Center of Excellence Labs has been functioning on cutting edge technologies such as Artificial Intelligence &amp; Machine Learning, IoT, Cyber Security, Cloud &amp; Fog Computing and Software Engineering. Department faculty have been executing several funded research projects. Had MoUs with reputed MNCs such as IBM, Microsoft, CISCO etc to be in tune with industry developments and requirements.</p>
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

export default CSEPage;
