'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const year = new Date().getFullYear();
  const [scrolled, setScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown]   = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navRef      = useRef(null);
  const leaveTimer  = useRef(null);
  const [hoverEnabled, setHoverEnabled]   = useState(false);

  // Scroll shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hover device detection
  useEffect(() => {
    const mql = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    const apply = () => setHoverEnabled(Boolean(mql?.matches));
    apply();
    mql?.addEventListener?.('change', apply);
    return () => mql?.removeEventListener?.('change', apply);
  }, []);

  // Click outside — close desktop dropdowns
  useEffect(() => {
    const onPointerDown = (e) => {
      if (!navRef.current?.contains(e.target)) {
        setOpenDropdown(null);
        setActiveSubmenu(null);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Body scroll lock when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close everything (used by mobile link clicks)
  const closeAll = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setActiveSubmenu(null);
  };

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
    clearTimeout(leaveTimer.current);
    setOpenDropdown(name);
    setActiveSubmenu(null);
  };

  const closeOnHoverLeave = () => {
    if (!hoverEnabled) return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setOpenDropdown(null);
      setActiveSubmenu(null);
    }, 120);
  };

  const openSubmenuOnHover = (key) => {
    if (!hoverEnabled) return;
    clearTimeout(leaveTimer.current);
    setActiveSubmenu(key);
  };

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <Link href="/" onClick={closeAll}>
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-final.png`} alt="KL University Logo" />
            </Link>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>

            {/* Academics */}
            <li
              className={`dropdown ${openDropdown === 'academics' ? 'open' : ''}`}
              onMouseEnter={() => openOnHover('academics')}
              onMouseLeave={closeOnHoverLeave}
            >
              <a href="#" className="dropbtn" onClick={toggleDropdown('academics')}>
                Academics <ChevronDown size={14} />
              </a>
              <div className="dropdown-content">
                <Link href="/faculty" className="dropdown-item" onClick={closeAll}>Faculty</Link>

                <div
                  className={`submenu ${activeSubmenu === 'engineering' ? 'open' : ''}`}
                  onMouseEnter={() => openSubmenuOnHover('engineering')}
                  onMouseLeave={() => {
                    if (!hoverEnabled) return;
                    clearTimeout(leaveTimer.current);
                    leaveTimer.current = setTimeout(() => setActiveSubmenu(null), 120);
                  }}
                >
                  <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('engineering')}>
                    School Of Engineering <ChevronRight size={14} />
                  </div>
                  <div className="submenu-content">
                    <Link href="/cse"   className="dropdown-item" onClick={closeAll}>CSE</Link>
                    <Link href="/csit"  className="dropdown-item" onClick={closeAll}>CS&amp;IT</Link>
                    <Link href="/ai-ds" className="dropdown-item" onClick={closeAll}>AI &amp; Data Science</Link>
                    <Link href="/ece"   className="dropdown-item" onClick={closeAll}>ECE</Link>
                    <Link href="/fe"    className="dropdown-item" onClick={closeAll}>Freshman Engineering</Link>
                  </div>
                </div>

                <div
                  className={`submenu ${activeSubmenu === 'computing' ? 'open' : ''}`}
                  onMouseEnter={() => openSubmenuOnHover('computing')}
                  onMouseLeave={() => {
                    if (!hoverEnabled) return;
                    clearTimeout(leaveTimer.current);
                    leaveTimer.current = setTimeout(() => setActiveSubmenu(null), 120);
                  }}
                >
                  <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('computing')}>
                    School of Computing <ChevronRight size={14} />
                  </div>
                  <div className="submenu-content">
                    <Link href="/mca" className="dropdown-item" onClick={closeAll}>MCA</Link>
                    <Link href="/bca" className="dropdown-item" onClick={closeAll}>BCA</Link>
                  </div>
                </div>

                <div
                  className={`submenu ${activeSubmenu === 'management' ? 'open' : ''}`}
                  onMouseEnter={() => openSubmenuOnHover('management')}
                  onMouseLeave={() => {
                    if (!hoverEnabled) return;
                    clearTimeout(leaveTimer.current);
                    leaveTimer.current = setTimeout(() => setActiveSubmenu(null), 120);
                  }}
                >
                  <div className="dropdown-item submenu-trigger" onClick={toggleSubmenu('management')}>
                    School of Management <ChevronRight size={14} />
                  </div>
                  <div className="submenu-content">
                    <Link href="/mba" className="dropdown-item" onClick={closeAll}>MBA</Link>
                    <Link href="/bba" className="dropdown-item" onClick={closeAll}>BBA</Link>
                  </div>
                </div>

                <a href="#" className="dropdown-item">Academic Regulations</a>
                <a href="https://klh.edu.in/wp-content/uploads/2022/04/Code-of-Conduct.pdf" target="_blank" className="dropdown-item">Code Of Conduct</a>
                <a href="https://klh.edu.in/wp-content/uploads/2025/11/Y25-B.Tech-PBL-Academic-Calendar-2025-26.pdf" target="_blank" className="dropdown-item">Academic Calendar</a>
              </div>
            </li>

            {/* Admissions */}
            <li
              className={`dropdown ${openDropdown === 'admissions' ? 'open' : ''}`}
              onMouseEnter={() => openOnHover('admissions')}
              onMouseLeave={closeOnHoverLeave}
            >
              <a href="#" className="dropbtn" onClick={toggleDropdown('admissions')}>
                Admissions <ChevronDown size={14} />
              </a>
              <div className="dropdown-content">
                <a href={`https://klh.edu.in/admissions-${year}/`} className="dropdown-item" onClick={closeAll}>Admissions {year}</a>
                <Link href="/fee-structure" className="dropdown-item" onClick={closeAll}>Fee Structure</Link>
                <a href="https://klh.edu.in/bhp-bus-fee-bowrampet/" className="dropdown-item" onClick={closeAll}>Bus Fee</a>
              </div>
            </li>

            {/* AICTE */}
            <li
              className={`dropdown ${openDropdown === 'aicte' ? 'open' : ''}`}
              onMouseEnter={() => openOnHover('aicte')}
              onMouseLeave={closeOnHoverLeave}
            >
              <a href="#" className="dropbtn" onClick={toggleDropdown('aicte')}>
                AICTE <ChevronDown size={14} />
              </a>
              <div className="dropdown-content">
                <a href="https://klh.edu.in/hyderabad-campus-bowrampet/aicte/" className="dropdown-item" onClick={closeAll}>Approvals</a>
              </div>
            </li>

            {/* Campus Life */}
            <li
              className={`dropdown ${openDropdown === 'campus' ? 'open' : ''}`}
              onMouseEnter={() => openOnHover('campus')}
              onMouseLeave={closeOnHoverLeave}
            >
              <a href="#" className="dropbtn" onClick={toggleDropdown('campus')}>
                Campus Life <ChevronDown size={14} />
              </a>
              <div className="dropdown-content">
                <Link href="/campus-life" className="dropdown-item" onClick={closeAll}>Events</Link>
                <a href="https://klh.edu.in/sac/" className="dropdown-item" onClick={closeAll}>Student Activity Center</a>
                <a href="https://klh.edu.in/bhp-infra-structure/" className="dropdown-item" onClick={closeAll}>Infrastructure</a>
                <a href="https://klh.edu.in/hyderabad-campus-bowrampet/all-cells/" className="dropdown-item" onClick={closeAll}>Student Clubs</a>
                <a href="https://klh.edu.in/hyderabad-campus-bowrampet/institute-innovation-council/" className="dropdown-item" onClick={closeAll}>Innovation Council</a>
              </div>
            </li>

            <li><a href="https://klh.edu.in/bhp-contact-us/" onClick={closeAll}>Contact Us</a></li>

            <li>
              <a
                href={`https://www.kluniversity.in/admissions-${year}/?utm_source=Website&utm_medium=Banner&utm_campaign=${year}-${String(year + 1).slice(2)}AY/`}
                className="btn-gradient"
                onClick={closeAll}
              >
                Admissions Apply <ChevronRight size={16} />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Backdrop for mobile — tap to close */}
      {mobileMenuOpen && (
        <div className="nav-backdrop" onClick={closeAll} aria-hidden="true" />
      )}
    </>
  );
};

export default Navbar;
