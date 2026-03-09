import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube, Send, X } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="footer-layout">
          {/* Main Footer Content */}
          <div className="footer-content">
            
            {/* Logo Column */}
            <div className="footer-col logo-col">
              <div className="logo-container">
                <img 
                  src="https://klh.edu.in/wp-content/uploads/2024/11/LOG9.png" 
                  alt="KLH Deemed to be University" 
                  className="footer-logo" 
                />
              </div>
            </div>

            {/* About Us Column */}
            <div className="footer-col links-col">
              <h4>ABOUT US</h4>
              <ul className="footer-links">
                <li><a href="https://klh.edu.in/inception-brief-history/">About Us</a></li>
                <li><a href="#">Collaborations</a></li>
                <li><a href="#">LMS</a></li>
                <li><a href="#">ERP</a></li>
                <li><a href="#">Feedback</a></li>
              </ul>
            </div>

            {/* Important Column */}
            <div className="footer-col links-col">
              <h4>IMPORTANT</h4>
              <ul className="footer-links">
                <li><a href="#">ExamSection</a></li>
                <li><a href="#">Alumni</a></li>
                <li><a href="#">NSS</a></li>
                <li><a href="https://klh.edu.in/hyderabad-campus-bowrampet/all-cells/">Hobby Clubs</a></li>
                <li><a href="#">Ivarna</a></li>
                <li><a href="#">KLH mail</a></li>
                <li><a href="#">Staff Grievances</a></li>
                <li><a href="#">Newsletter</a></li>
              </ul>
            </div>

            {/* Social Media Column */}
            <div className="footer-col social-col">
              <h4>SOCIAL MEDIA</h4>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
                <a href="#" className="social-icon" aria-label="X"><X size={20} /></a>
                <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={20} /></a>
                <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="#" className="social-icon" aria-label="YouTube"><Youtube size={20} /></a>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <h4>NEWSLETTER</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Email address" />
                <button type="submit"><Send size={18} /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
