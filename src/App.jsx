import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Programs from './components/Programs';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      
      {/* Programs / Departments Section */}
      <Programs />

      {/* About Section */}
      <section className="about section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-half">
              <img src="https://klh.edu.in/wp-content/uploads/2023/04/BRR.jpg" alt="Campus View" className="rounded-img shadow" />
            </div>
            <div className="col-half content-center">
              <h2>About Bowrampet Campus</h2>
              <p>KL Deemed to be University, Hyderabad Campus at Bowrampet is a premier institution dedicated to providing high-quality technical education. We focus on holistic development, research, and innovation.</p>
              <a href="#" className="btn btn-outline">Read More</a>
            </div>
          </div>
        </div>
      </section>

      <section className="partners section">
        <div className="container">
          <div className="partners-block">
            <div className="partners-eyebrow">CENTER OF EXCELLENCE</div>
            <div className="logo-strip">
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2022/05/amazon-web-services-academy-e1652949088488-300x96.jpg" alt="AWS Academy" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2022/05/cisco-300x84.jpg" alt="Cisco Networking Academy" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2022/05/bp-300x63.png" alt="Blue Prism University" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2022/05/redhat-e1652949139131-300x79.png" alt="Red Hat Academy" />
              </div>
            </div>
          </div>

          <div className="partners-block partners-block-secondary">
            <div className="partners-eyebrow">OUR PARTNERS</div>
            <div className="logo-strip logo-strip-compact">
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/wipro-1.png" alt="Wipro" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/csc-1.png" alt="CSC" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/hp-1.png" alt="HP" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/ibm-2.png" alt="IBM" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/info.png" alt="Infosys" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/valuelabs.png" alt="ValueLabs" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/intel.png" alt="Intel" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/cts.png" alt="Cognizant" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/cisco-1.png" alt="Cisco" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/TA.png" alt="Tata Consultancy Services" />
              </div>
              <div className="logo-item">
                <img src="https://klh.edu.in/wp-content/uploads/2020/04/amazon-2.png" alt="Amazon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
