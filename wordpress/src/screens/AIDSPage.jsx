'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

const AIDSPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">Department of</div>
          <h1>Artificial Intelligence & Data Science</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'AI & DS' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {activeTab === 'Overview' && (
            <div>
              <div className="csit-card-kicker">Department Overview</div>
              <h2 style={{ marginBottom: '1rem' }}>Artificial Intelligence &amp; Data Science</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The B.Tech in Artificial Intelligence &amp; Data Science focuses on core AI, Machine Learning, and Data Engineering concepts, blending theory with hands-on implementation. Students learn to build intelligent systems, design scalable data pipelines, and apply analytics for real-world decision making.</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>The programme emphasizes mathematics for AI, modern ML frameworks, deep learning, MLOps, cloud-native AI services, and responsible AI practices. Graduates are prepared for roles in data science, ML engineering, AI product development, and analytics-driven business solutions.</p>
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

export default AIDSPage;
