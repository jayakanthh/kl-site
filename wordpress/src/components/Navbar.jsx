'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navRef = useRef(null);
  const leaveTimer = useRef(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);

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

  useEffect(() => {
    const mql = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    const apply = () => setHoverEnabled(Boolean(mql?.matches));
    apply();
    if (mql?.addEventListener) {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
    if (mql?.addListener) {
      mql.addListener(apply);
      return () => mql.removeListener(apply);
    }
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      const root = navRef.current;
      if (!root) return;
      if (root.contains(e.target)) return;
      setOpenDropdown(null);
      setActiveSubmenu(null);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const toggleDropdown = (name) => (e) => {
    e.preventDefault();
    setOpenDropdown((prev) => (prev === name ? null : name));
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (key) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu((prev) => (prev === key ? null : key));
  };

  const openOnHover = (name) => {
    if (!hoverEnabled) return;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setOpenDropdown(name);
    setActiveSubmenu(null);
  };

  const closeOnHoverLeave = () => {
    if (!hoverEnabled) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      setActiveSubmenu(null);
      leaveTimer.current = null;
    }, 120);
  };

  const openSubmenuOnHover = (key) => {
    if (!hoverEnabled) return;
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setActiveSubmenu(key);
  };

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link href="/">
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo-final.png`} alt="KL University Logo" />
          </Link>
        </div>

        <div className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li
            className={`dropdown ${openDropdown === 'academics' ? 'open' : ''}`}
            onMouseEnter={() => openOnHover('academics')}
            onMouseLeave={closeOnHoverLeave}
          >
            <a href="#" className="dropbtn" onClick={toggleDropdown('academics')}>
              Academics <ChevronDown size={14} />
            </a>
            <div className="dropdown-content">
              <Link href="/faculty" className="dropdown-item">Faculty</Link>
              <div
                className={`submenu ${activeSubmenu === 'engineering' ? 'open' : ''}`}
                onMouseEnter={() => openSubmenuOnHover('engineering')}
                onMouseLeave={() => {
                  if (!hoverEnabled) return;
                  if (leaveTimer.current) clearTimeout(leaveTimer.current);
                  leaveTimer.current = setTimeout(() => {
                    setActiveSubmenu(null);
                    leaveTimer.current = null;
                  }, 120);
                }}
              >
                <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('engineering')}>
                  School Of Engineering <ChevronRight size={14} />
                </div>
                <div className="submenu-content">
                  <Link href="/cse" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>CSE</Link>
                  <Link href="/csit" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>CS&IT</Link>
                  <Link href="/ai-ds" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>AI & Data Science</Link>
                  <Link href="/ece" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>ECE</Link>
                  <Link href="/fe" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>Freshman Engineering</Link>
                </div>
              </div>
              <div
                className={`submenu ${activeSubmenu === 'computing' ? 'open' : ''}`}
                onMouseEnter={() => openSubmenuOnHover('computing')}
                onMouseLeave={() => {
                  if (!hoverEnabled) return;
                  if (leaveTimer.current) clearTimeout(leaveTimer.current);
                  leaveTimer.current = setTimeout(() => {
                    setActiveSubmenu(null);
                    leaveTimer.current = null;
                  }, 120);
                }}
              >
                <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('computing')}>
                  School of Computing <ChevronRight size={14} />
                </div>
                <div className="submenu-content">
                  <Link href="/mca" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>MCA</Link>
                  <Link href="/bca" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>BCA</Link>
                </div>
              </div>
              <div
                className={`submenu ${activeSubmenu === 'management' ? 'open' : ''}`}
                onMouseEnter={() => openSubmenuOnHover('management')}
                onMouseLeave={() => {
                  if (!hoverEnabled) return;
                  if (leaveTimer.current) clearTimeout(leaveTimer.current);
                  leaveTimer.current = setTimeout(() => {
                    setActiveSubmenu(null);
                    leaveTimer.current = null;
                  }, 120);
                }}
              >
                <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('management')}>
                  School of Management <ChevronRight size={14} />
                </div>
                <div className="submenu-content">
                  <Link href="/mba" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>MBA</Link>
                  <Link href="/bba" className="dropdown-item" onClick={() => { setOpenDropdown(null); setActiveSubmenu(null); }}>BBA</Link>
                </div>
              </div>
              <a href="#" className="dropdown-item">Academic Regulations</a>
              <a href="https://klh.edu.in/wp-content/uploads/2022/04/Code-of-Conduct.pdf" target="_blank" className="dropdown-item">Code Of Conduct</a>
              <a href="https://klh.edu.in/wp-content/uploads/2025/11/Y25-B.Tech-PBL-Academic-Calendar-2025-26.pdf" target="_blank" className="dropdown-item">Academic Calendar</a>
            </div>
          </li>

          <li
            className={`dropdown ${openDropdown === 'admissions' ? 'open' : ''}`}
            onMouseEnter={() => openOnHover('admissions')}
            onMouseLeave={closeOnHoverLeave}
          >
            <a href="#" className="dropbtn" onClick={toggleDropdown('admissions')}>
              Admissions <ChevronDown size={14} />
            </a>
            <div className="dropdown-content">
              <a href="https://klh.edu.in/admissions-2025/" className="dropdown-item">Admissions 2025</a>
              <Link href="/fee-structure" className="dropdown-item">Fee Structure</Link>
              <a href="https://klh.edu.in/bhp-bus-fee-bowrampet/" className="dropdown-item">Bus Fee</a>
            </div>
          </li>

          <li
            className={`dropdown ${openDropdown === 'aicte' ? 'open' : ''}`}
            onMouseEnter={() => openOnHover('aicte')}
            onMouseLeave={closeOnHoverLeave}
          >
            <a href="#" className="dropbtn" onClick={toggleDropdown('aicte')}>
              AICTE <ChevronDown size={14} />
            </a>
            <div className="dropdown-content">
              <a href="https://klh.edu.in/hyderabad-campus-bowrampet/aicte/" className="dropdown-item">Approvals</a>
            </div>
          </li>

          <li
            className={`dropdown ${openDropdown === 'campus' ? 'open' : ''}`}
            onMouseEnter={() => openOnHover('campus')}
            onMouseLeave={closeOnHoverLeave}
          >
            <a href="#" className="dropbtn" onClick={toggleDropdown('campus')}>
              Campus Life <ChevronDown size={14} />
            </a>
            <div className="dropdown-content">
              <Link href="/campus-life" className="dropdown-item">Events</Link>
              <a href="https://klh.edu.in/sac/" className="dropdown-item">Student Activity Center</a>
              <a href="https://klh.edu.in/bhp-infra-structure/" className="dropdown-item">Infrastructure</a>
              <a href="https://klh.edu.in/hyderabad-campus-bowrampet/all-cells/" className="dropdown-item">Student Clubs</a>
              <a href="https://klh.edu.in/hyderabad-campus-bowrampet/institute-innovation-council/" className="dropdown-item">Innovation Council</a>
            </div>
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
