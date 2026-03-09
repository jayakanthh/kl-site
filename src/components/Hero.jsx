import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Hero.css';

const images = [
  'https://klh.edu.in/wp-content/uploads/2023/09/Untitled-2.jpg',
  'https://klh.edu.in/wp-content/uploads/2023/09/Untitled-3.jpg',
  'https://klh.edu.in/wp-content/uploads/2023/09/Untitled-4.jpg',
  'https://klh.edu.in/wp-content/uploads/2023/09/Untitled-6.jpg',
  'https://klh.edu.in/wp-content/uploads/2023/09/Untitled-8.jpg',
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <header className="hero">
      <div className="hero-slider">
        {images.map((img, index) => (
          <div 
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
      </div>
      
      <div className="hero-content">
        <h1>Welcome to KLH Hyderabad</h1>
        <p>Empowering Minds, Shaping Futures. Experience world-class education at our Bowrampet Campus.</p>
        <div className="cta-buttons">
          <a href="https://www.kluniversity.in/admissions-2025/?utm_source=Website&utm_medium=Banner&utm_campaign=2025-26AY/" className="btn btn-primary">Admissions 2025</a>
          <a href="#" className="btn btn-secondary">Virtual Tour</a>
        </div>
      </div>

      <div className="slider-controls">
        <button onClick={prevSlide} className="control-btn"><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className="control-btn"><ChevronRight size={24} /></button>
      </div>

      <div className="slider-indicators">
        {images.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </header>
  );
};

export default Hero;
