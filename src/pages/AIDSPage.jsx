import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const AIDSPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Department of</div>
            <h1>Artificial Intelligence & Data Science</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'AI & DS' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            The B.Tech in Artificial Intelligence & Data Science focuses on core AI, Machine Learning, and Data Engineering concepts,
            blending theory with hands-on implementation. Students learn to build intelligent systems, design scalable data pipelines,
            and apply analytics for real-world decision making.
          </p>
          <p>
            The programme emphasizes mathematics for AI, modern ML frameworks, deep learning, MLOps, cloud-native AI services,
            and responsible AI practices. Graduates are prepared for roles in data science, ML engineering, AI product development,
            and analytics-driven business solutions.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIDSPage;
