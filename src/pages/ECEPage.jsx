import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import '../App.css';

const ECEPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Department of</div>
            <h1>Electronics & Communication Engineering</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'ECE' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            Electronics & Communication Engineering covers the design, development and application of electronic systems and communication
            technologies. The programme spans Analog & Digital circuits, VLSI, Embedded Systems, Wireless communications (4G/5G),
            Signal Processing and IoT hardware platforms.
          </p>
          <p>
            Students gain strong foundations in circuit theory and communications along with hands‑on exposure through labs and industry
            projects, preparing them for careers in semiconductor, telecom, embedded, and systems engineering.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ECEPage;
