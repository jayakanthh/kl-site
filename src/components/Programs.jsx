import React, { useState } from 'react';
import { Monitor, Cpu, Zap, Radio, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Programs.css';

const Programs = () => {
  const [activeTab, setActiveTab] = useState('engineering');

  const tabs = [
    { id: 'engineering', label: 'School Of Engineering' },
    { id: 'computing', label: 'School Of Computing' },
    { id: 'business', label: 'School Of Management' },
  ];

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  const MotionDiv = motion.div;

  return (
    <section className="programs section">
      <div className="container">
        
        <div className="section-header text-center">
          <h2>Our Programs</h2>
          <p>Explore our wide range of undergraduate and postgraduate courses.</p>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs-header">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <MotionDiv 
                    layoutId="activeTab" 
                    className="tab-indicator" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          <AnimatePresence mode='wait'>
            {activeTab === 'engineering' && (
              <MotionDiv
                key="engineering"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="program-grid"
              >
                <div className="program-card">
                  <div className="icon-wrapper">
                    <Monitor size={32} />
                  </div>
                  <div className="program-content">
                    <h3>B.Tech in Computer Science & Engineering</h3>
                    <p>Encompasses a variety of topics that relates to computation, like analysis of algorithms, program design, software & hardware.</p>
                      <a href="/cse" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Cpu size={32} />
                  </div>
                  <div className="program-content">
                    <h3>B.Tech in Computer Science & Information Technology</h3>
                    <p>It aims to provide students with intricate knowledge of computer technologies and functional operations along with programming, coding</p>
                      <a href="/csit" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Zap size={32} />
                  </div>
                  <div className="program-content">
                    <h3>B.Tech in Artificial Intelligence & Data Science</h3>
                    <p>Focuses on AI, machine learning and data-driven systems, blending theory and applications.</p>
                      <a href="/ai-ds" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Radio size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Electronics & Communication Engineering</h3>
                    <p>ECE covers Analog/Digital electronics, VLSI, 4G/5G and Embedded Systems</p>
                      <a href="/ece" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Monitor size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Freshman Engineering</h3>
                    <p>Foundation year emphasizing fundamentals, lab skills and interdisciplinary exposure.</p>
                      <a href="/fe" className="read-more">Read More</a>
                  </div>
                </div>
              </MotionDiv>
            )}

            {activeTab === 'computing' && (
              <MotionDiv
                key="computing"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="program-grid"
              >
                <div className="program-card">
                  <div className="icon-wrapper">
                    <Monitor size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Master of Computer Applications (MCA)</h3>
                    <p>Advanced postgraduate degree focusing on software development, application programming, and computer architecture.</p>
                      <a href="/mca" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Cpu size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Bachelor of Computer Applications (BCA)</h3>
                    <p>Undergraduate program designed to provide a strong foundation in computer applications and software development.</p>
                      <a href="/bca" className="read-more">Read More</a>
                  </div>
                </div>
              </MotionDiv>
            )}

            {activeTab === 'business' && (
              <MotionDiv
                key="business"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                className="program-grid"
              >
                <div className="program-card">
                  <div className="icon-wrapper">
                    <Briefcase size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Master of Business Administration (MBA)</h3>
                    <p>MBA focusing on data analytics, building practical and technical skills.</p>
                      <a href="/mba" className="read-more">Read More</a>
                  </div>
                </div>

                <div className="program-card">
                  <div className="icon-wrapper">
                    <Briefcase size={32} />
                  </div>
                  <div className="program-content">
                    <h3>Bachelor of Business Administration (BBA)</h3>
                    <p>Undergraduate program covering core business principles, management strategies, and entrepreneurship.</p>
                      <a href="/bba" className="read-more">Read More</a>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Programs;
