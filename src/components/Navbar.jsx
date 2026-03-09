import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dropdown states
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);
  const [aicteOpen, setAicteOpen] = useState(false);
  const [campusLifeOpen, setCampusLifeOpen] = useState(false);
  
  const [activeSubmenu, setActiveSubmenu] = useState(null); // 'engineering', 'computing', 'management'

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: 15, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  const submenuVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  const MotionDiv = motion.div;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <a href="/">
             <img src="https://klh.edu.in/wp-content/uploads/2024/11/LOG9.png" alt="KLH Logo" />
          </a>
        </div>

        <div className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          
          {/* Academics Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setAcademicsOpen(true)}
            onMouseLeave={() => {
              setAcademicsOpen(false);
              setActiveSubmenu(null);
            }}
          >
            <a href="#" className="dropbtn">
              Academics <ChevronDown size={14} className={academicsOpen ? 'rotate-180' : ''} />
            </a>
            
            <AnimatePresence>
              {academicsOpen && (
                <MotionDiv 
                  className="dropdown-content"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <a href="https://klh.edu.in/bhp-faculty/" className="dropdown-item">Faculty</a>
                  
                  {/* Engineering Submenu */}
                  <div 
                    className="submenu"
                    onMouseEnter={() => setActiveSubmenu('engineering')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="dropdown-item submenu-trigger">
                      School Of Engineering <ChevronRight size={14} />
                    </div>
                    <AnimatePresence>
                      {activeSubmenu === 'engineering' && (
                        <MotionDiv 
                          className="submenu-content"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={submenuVariants}
                          style={{ top: 0, left: '100%', marginLeft: '10px' }}
                        >
                          <a href="/cse" className="dropdown-item">CSE</a>
                          <a href="/csit" className="dropdown-item">CS&IT</a>
                          <a href="/ai-ds" className="dropdown-item">AI & Data Science</a>
                          <a href="/ece" className="dropdown-item">ECE</a>
                          <a href="/fe" className="dropdown-item">Freshman Engineering</a>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Computing Submenu */}
                  <div 
                    className="submenu"
                    onMouseEnter={() => setActiveSubmenu('computing')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="dropdown-item submenu-trigger">
                      School of Computing <ChevronRight size={14} />
                    </div>
                    <AnimatePresence>
                      {activeSubmenu === 'computing' && (
                        <MotionDiv 
                          className="submenu-content"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={submenuVariants}
                          style={{ top: '-10px', left: '100%', marginLeft: '10px' }}
                        >
                          <a href="/mca" className="dropdown-item">MCA</a>
                          <a href="/bca" className="dropdown-item">BCA</a>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Management Submenu */}
                  <div 
                    className="submenu"
                    onMouseEnter={() => setActiveSubmenu('management')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    <div className="dropdown-item submenu-trigger">
                      School of Management <ChevronRight size={14} />
                    </div>
                    <AnimatePresence>
                      {activeSubmenu === 'management' && (
                        <MotionDiv 
                          className="submenu-content"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={submenuVariants}
                          style={{ top: '-10px', left: '100%', marginLeft: '10px' }}
                        >
                          <a href="/mba" className="dropdown-item">MBA</a>
                          <a href="/bba" className="dropdown-item">BBA</a>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>

                  <a href="#" className="dropdown-item">Academic Regulations</a>
                  <a href="https://klh.edu.in/wp-content/uploads/2022/04/Code-of-Conduct.pdf" target="_blank" className="dropdown-item">Code Of Conduct</a>
                  <a href="https://klh.edu.in/wp-content/uploads/2025/11/Y25-B.Tech-PBL-Academic-Calendar-2025-26.pdf" target="_blank" className="dropdown-item">Academic Calendar</a>
                </MotionDiv>
              )}
            </AnimatePresence>
          </li>

          {/* Admissions Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setAdmissionsOpen(true)}
            onMouseLeave={() => setAdmissionsOpen(false)}
          >
            <a href="#" className="dropbtn">
              Admissions <ChevronDown size={14} className={admissionsOpen ? 'rotate-180' : ''} />
            </a>
            <AnimatePresence>
              {admissionsOpen && (
                <MotionDiv 
                  className="dropdown-content"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <a href="https://klh.edu.in/admissions-2025/" className="dropdown-item">Admissions 2025</a>
                  <a href="/fee-structure" className="dropdown-item">Fee Structure</a>
                  <a href="https://klh.edu.in/bhp-bus-fee-bowrampet/" className="dropdown-item">Bus Fee</a>
                </MotionDiv>
              )}
            </AnimatePresence>
          </li>

          {/* AICTE Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setAicteOpen(true)}
            onMouseLeave={() => setAicteOpen(false)}
          >
            <a href="#" className="dropbtn">
              AICTE <ChevronDown size={14} className={aicteOpen ? 'rotate-180' : ''} />
            </a>
            <AnimatePresence>
              {aicteOpen && (
                <MotionDiv 
                  className="dropdown-content"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <a href="https://klh.edu.in/hyderabad-campus-bowrampet/aicte/" className="dropdown-item">Approvals</a>
                </MotionDiv>
              )}
            </AnimatePresence>
          </li>

          {/* Campus Life Dropdown */}
          <li 
            className="dropdown"
            onMouseEnter={() => setCampusLifeOpen(true)}
            onMouseLeave={() => setCampusLifeOpen(false)}
          >
            <a href="#" className="dropbtn">
              Campus Life <ChevronDown size={14} className={campusLifeOpen ? 'rotate-180' : ''} />
            </a>
            <AnimatePresence>
              {campusLifeOpen && (
                <MotionDiv 
                  className="dropdown-content"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={dropdownVariants}
                >
                  <a href="https://klh.edu.in/sac/" className="dropdown-item">Student Activity Center</a>
                  <a href="https://klh.edu.in/bhp-infra-structure/" className="dropdown-item">Infrastructure</a>
                  <a href="https://klh.edu.in/hyderabad-campus-bowrampet/all-cells/" className="dropdown-item">Student Clubs</a>
                  <a href="https://klh.edu.in/hyderabad-campus-bowrampet/institute-innovation-council/" className="dropdown-item">Innovation Council</a>
                </MotionDiv>
              )}
            </AnimatePresence>
          </li>

          <li><a href="https://klh.edu.in/bhp-contact-us/">Contact Us</a></li>
          
          <li>
            <a href="https://www.kluniversity.in/admissions-2025/?utm_source=Website&utm_medium=Banner&utm_campaign=2025-26AY/" className="btn-gradient">
                Admissions Apply <ChevronRight size={16} />
            </a>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
