import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const CSITPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Department of</div>
            <h1>Computer Science & Information Technology</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'CS&IT' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            The B.Tech. Computer Science and Information Technology, an undergraduate programme, is crafted to nurture motivated,
            innovative, and passionate graduates to fill ICT positions across sectors who can conceptualize, design, analyse, and develop
            ICT applications to meet modern-day requirements.
          </p>
          <p>
            The B.Tech in Computer Science and Information Technology curriculum is outcome-based and it delivers advanced theoretical
            concepts and practical skills in the domain. By enrolling in this programme, students develop critical, innovative, and
            problem-solving abilities for a smooth transition from academia to the corporate world. In addition, students are trained in
            interdisciplinary topics and attitudinal skills to enhance their scope of work.
          </p>
          <p>
            Computer Science and Information Technology (CS & IT) encompasses a variety of areas related to computation and applications
            of computing like the development of algorithms, analysis of algorithms, programming languages, software design, computer
            hardware, e-commerce, business information technology, Data Analytics, Machine Learning, Block Chain Technology, Augmented
            Virtual Reality, Mobile Application Development, IoT, Wireless Sensor network, and Web Technology.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CSITPage;
