import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';
import Breadcrumb from '../components/Breadcrumb';

const CSEPage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Department of</div>
            <h1>Computer Science & Engineering</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop: '0.75rem', paddingBottom: '0.25rem'}}>
        <div className="container">
          <Breadcrumb items={[{ label: 'CSE' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>About</h2>
          </div>
          <p>
            The Department of Computer Science and Engineering has eminent faculty with a blend of Academics and industry with varied
            specializations to impart their skill on the latest technologies for B.Tech students. The department offers a Doctoral program
            (PhD) in Computer Science and Engineering and works on emerging areas. Center of Excellence Labs has been functioning on cutting
            edge technologies such as Artificial Intelligence & Machine Learning, IoT, Cyber Security, Cloud & Fog Computing and Software
            Engineering. Department faculty have been executing several funded research projects. Had MoUs with reputed MNCs such as IBM,
            Microsoft, CISCO etc to be in tune with industry developments and requirements.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CSEPage;
