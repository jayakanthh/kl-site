'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';
import hodPhoto from '../assets/csit/01_Dr._Sk_KHAJA_SHAREEF_Associate_Professor.png';
import faculty2Photo from '../assets/csit/02_Dr._Y._Lakshmi_Prasanna_Assistant_Professor.png';
import faculty3Photo from '../assets/csit/03_Ms._Chekuri_Anitha_Assistant_Professor.png';
import faculty4Photo from '../assets/csit/04_Mr.P.Krishnanjaneyulu_Assistant_Professor.png';
import faculty5Photo from '../assets/csit/05_Ms.K.Chandusha_Assistant_Professor.png';
import staff1Photo from '../assets/csit/06_Vemulapalli_sai_prakash.png';
import eventCryptonize from '../assets/csit/07_Cryptonize.png';
import eventIeee from '../assets/csit/13_IEEE_Membership_Awareness_Program.png';
import eventNvidia from '../assets/csit/14_Programs_and_Resources_from_NVIDIA_for_researchers_and_Educators.png';

const programOutcomes = [
  { id: 'PO1', title: 'Engineering Knowledge', text: 'Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.' },
  { id: 'PO2', title: 'Problem Analysis', text: 'Identify, formulate, review research literature, and analyse complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences and engineering sciences.' },
  { id: 'PO3', title: 'Design/Development of Solutions', text: 'Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health and safety, and cultural, societal, and environmental considerations.' },
  { id: 'PO4', title: 'Conduct Investigations of Complex Problems', text: 'Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.' },
  { id: 'PO5', title: 'Modern Tool Usage', text: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modelling to complex engineering activities with an understanding of the limitations.' },
  { id: 'PO6', title: 'The Engineer and Society', text: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.' },
  { id: 'PO7', title: 'Environment and Sustainability', text: 'Understand the impact of professional engineering solutions in societal and environmental contexts, and demonstrate knowledge of, and need for sustainable development.' },
  { id: 'PO8', title: 'Ethics', text: 'Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.' },
  { id: 'PO9', title: 'Individual and Team Work', text: 'Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.' },
  { id: 'PO10', title: 'Communication', text: 'Communicate effectively on complex engineering activities with the engineering community and with society at large, including effective reports and design documentation, presentations, and clear instructions.' },
  { id: 'PO11', title: 'Project Management and Finance', text: "Demonstrate knowledge and understanding of engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and multidisciplinary environments." },
  { id: 'PO12', title: 'Life-long Learning', text: 'Recognize the need for, and have preparation and ability to engage in independent and lifelong learning in the broadest context of technological change.' },
];

const programSpecificOutcomes = [
  'PSO1: An ability to Identify, Design, and Analyse complex computer systems, Implement and Interpret the results from those systems.',
  'PSO2: An ability to select and apply current techniques, skills, and tools necessary for computing practice and integrate IT-based solutions into the user environment effectively.',
];

const programEducationalObjectives = [
  'PEO1: Practice engineering in a broad range of industrial, societal and real world applications.',
  'PEO2: Pursue advanced education, research and development, and other creative and innovative efforts in science, engineering, and technology, as well as other professional careers.',
  'PEO3: Conduct themselves in a responsible, professional, and ethical manner.',
  'PEO4: Participate as leaders in their fields of expertise and in activities that support service and economic development throughout the world.',
];

const committees = [
  { name: 'DDC (Department Development Committee)', items: ['Focuses on planning and initiating activities to improve the overall quality of the department.', 'Provides suggestions for infrastructural, academic, and developmental improvements.'] },
  { name: 'DAC (Department Academic Committee)', items: ['Regulates and monitors all academic activities within the department.', 'Incorporates suggestions from the Board of Studies (BOS) and DDC for effective curriculum implementation.'] },
  { name: 'BOS (Board of Studies)', items: ['Discusses curriculum design and development.', 'Reviews and updates syllabus components in line with academic and industry needs.'] },
  { name: 'Result Analysis Committee', items: ['Analyses student results after examinations.', 'Evaluates Course Outcomes (CO) attainment to ensure learning objectives are met.'] },
  { name: 'Lab Development Committee', items: ['Ensures smooth conduction of laboratory sessions as per the academic timetable.', 'Monitors the availability and functionality of lab equipment and materials.'] },
  { name: 'Administrative Committees', items: ['Promoting spoken English among students and staff.', 'Monitoring discipline and seating arrangements.', 'Organizing association and professional society activities.', "Coordinating extension activities and women's forum events.", 'Overseeing hobby clubs, placement training, and lab maintenance.'] },
  { name: 'LMS/ERP Committee', items: ['Manages all Learning Management System (LMS) and Enterprise Resource Planning (ERP) operations.', 'Handles student and course registrations and other academic data.'] },
  { name: 'Committee for Feedback (Stakeholders)', items: ['Collects feedback from students, alumni, industry, and other stakeholders.', 'Conducts feedback sessions twice each semester to improve teaching and learning practices.'] },
  { name: 'Vetting Committee', items: ['Reviews and approves question papers before exams.', 'Ensures the quality and standard of assessment tools align with academic objectives.'] },
  { name: 'Counselling Committee Meeting', items: ['Academic – Subject performance, learning gaps.', 'Career – Guidance on placements, higher studies, entrepreneurship.', 'Personal/Psychological – Emotional and mental well-being of students.'] },
  { name: 'Workshops / Guest Lectures / Seminars', items: ['Maintains records and documentation of departmental events such as workshops, seminars, and guest lectures.', 'Ensures academic enrichment through expert interactions.'] },
  { name: 'Quality Circle Committee', items: ['Identifies and implements quality improvement initiatives.', 'Engages faculty in continuous improvement processes for departmental development.'] },
];

const faculty = [
  { name: 'Dr. Sk Khaja Shareef', title: 'Associate Professor', photo: hodPhoto, tag: 'Head of the Department' },
  { name: 'Dr. Y. Lakshmi Prasanna', title: 'Assistant Professor', photo: faculty2Photo },
  { name: 'Ms. Chekuri Anitha', title: 'Assistant Professor', photo: faculty3Photo },
  { name: 'Mr. P. Krishnanjaneyulu', title: 'Assistant Professor', photo: faculty4Photo },
  { name: 'Ms. K. Chandusha', title: 'Assistant Professor', photo: faculty5Photo, tag: 'Website Faculty Coordinator' },
  { name: 'Vemulapalli Sai Prakash', title: 'Non-Teaching Staff', photo: staff1Photo },
];

const CSITPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">Department of</div>
          <h1>Computer Science & Information Technology</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'CS&IT' }]} />
      </div>
    </section>

    <DeptTabLayout>
      {(activeTab) => (
        <>
          {/* OVERVIEW */}
          {activeTab === 'Overview' && (
            <div>
              <div className="dept-overview-layout">
                <div className="dept-overview-main">
                  <div className="csit-card-kicker">Department Overview</div>
                  <h2 style={{ marginBottom: '1rem' }}>Computer Science &amp; Information Technology</h2>
                  <p>The B.Tech. Computer Science and Information Technology, an undergraduate programme, is crafted to nurture motivated, innovative, and passionate graduates to fill ICT positions across sectors who can conceptualize, design, analyse, and develop ICT applications to meet modern-day requirements.</p>
                  <p>The B.Tech. in Computer Science and Information Technology curriculum is outcome-based and it delivers the most advanced theoretical concepts and practical skills in the domain. By enrolling on this programme, students develop critical, innovative, and problem-solving abilities for a smooth transition from academia to the corporate world.</p>
                  <p>Computer Science and Information Technology (CS &amp; IT) encompasses a variety of areas related to computation and applications of computing like development and analysis of algorithms, programming languages, software design, computer hardware, e-commerce, business information technology, data analytics, machine learning, block chain technology, augmented virtual reality, mobile application development, IoT, wireless sensor networks and web technology.</p>
                  <div className="csit-pill-row" style={{ marginTop: '1.5rem' }}>
                    <div className="csit-pill">Academic Regulations: Y23</div>
                    <div className="csit-pill">Y24</div>
                    <div className="csit-pill">Y25</div>
                  </div>
                  <div className="dept-vm-row">
                    <div className="dept-vm-card">
                      <div className="csit-card-kicker">Vision</div>
                      <p>To Promote Teaching and Learning that includes the latest Tool-based skill driven learning in Information Technology which provides a strong practical base for the Graduate Professionals.</p>
                    </div>
                    <div className="dept-vm-card">
                      <div className="csit-card-kicker">Mission</div>
                      <p>To become Centre of Excellence in Information Technology with a strong Research environment that produces top class competent Professionals to the real IT world.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="dept-hod-card">
                    <div className="csit-card-kicker">Head of the Department</div>
                    <img className="csit-hod-photo" src={hodPhoto} alt="Dr. Sk Khaja Shareef" />
                    <div className="csit-hod-name">Dr. Sk. Khaja Shareef</div>
                    <div className="csit-muted">Associate Professor, Dept of CSIT</div>
                  </div>
                  <div className="csit-card" style={{ marginTop: '1rem' }}>
                    <div className="csit-card-kicker">Website Faculty Coordinator</div>
                    <div className="csit-strong">K. Chandusha</div>
                    <div className="csit-muted">Assistant Professor</div>
                  </div>
                </div>
              </div>

              <div className="csit-section">
                <div className="csit-section-title">People</div>
                <div className="csit-people-grid">
                  {faculty.map((p) => (
                    <div key={p.name} className="csit-person-card">
                      <img className="csit-person-photo" src={p.photo} alt={p.name} />
                      <div className="csit-person-body">
                        <div className="csit-person-name">{p.name}</div>
                        <div className="csit-person-title">{p.title}</div>
                        {p.tag && <div className="csit-person-tag">{p.tag}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROGRAM OUTCOMES */}
          {activeTab === 'Program Outcomes' && (
            <div>
              <div className="csit-section">
                <div className="csit-section-title">Program Outcomes (POs)</div>
                <div className="csit-po-grid">
                  {programOutcomes.map((po) => (
                    <div key={po.id} className="csit-po-card">
                      <div className="csit-po-top">
                        <div className="csit-po-id">{po.id}</div>
                        <div className="csit-po-title">{po.title}</div>
                      </div>
                      <div className="csit-po-text">{po.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="csit-section">
                <div className="csit-split">
                  <div className="csit-card">
                    <div className="csit-card-kicker">Program Specific Outcomes (PSOs)</div>
                    <ul className="csit-list">
                      {programSpecificOutcomes.map((pso) => <li key={pso}>{pso}</li>)}
                    </ul>
                  </div>
                  <div className="csit-card">
                    <div className="csit-card-kicker">Program Educational Objectives (PEOs)</div>
                    <ul className="csit-list">
                      {programEducationalObjectives.map((peo) => <li key={peo}>{peo}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMMITTEES */}
          {activeTab === 'Committees' && (
            <div className="csit-section">
              <div className="csit-section-title">Departmental Committees</div>
              <div className="csit-committee-grid">
                {committees.map((c) => (
                  <div key={c.name} className="csit-card">
                    <div className="csit-strong">{c.name}</div>
                    <ul className="csit-list">
                      {c.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESEARCH */}
          {activeTab === 'Research' && (
            <div className="csit-section">
              <div className="csit-section-title">Research</div>
              <div className="csit-split">
                <div className="csit-card">
                  <div className="csit-card-kicker">Research Cohorts</div>
                  <div className="csit-strong">4 (same as CSE)</div>
                </div>
                <div className="csit-card">
                  <div className="csit-card-kicker">Books / Book Chapters</div>
                  <div className="csit-strong">Futuristic Trends in Engineering and Management.</div>
                </div>
              </div>
              <div className="csit-split" style={{ marginTop: 14 }}>
                <div className="csit-card">
                  <div className="csit-card-kicker">Publications</div>
                  <ul className="csit-list">
                    <li>Enhancing security and efficiency in Mobile Ad Hoc Networks using a hybrid deep learning model for flooding attack detection (2025)</li>
                    <li>Real-Time Emotion Detection in Live Video Streams using Multimodal Deep Learning Architectures (2025)</li>
                    <li>Quantum Feature Pruning for Scalable and Efficient Quantum Kernel-Based High-Dimensional Classification (2025)</li>
                    <li>Nature-Inspired Adaptive Evolutionary Swarm Optimization for Energy-Efficient Computational Mathematics in High-Performance Computing Systems (2025)</li>
                    <li>Enhanced botnet detection in IoT networks using zebra optimization and dual-channel GAN classification (2024)</li>
                  </ul>
                </div>
                <div className="csit-card">
                  <div className="csit-card-kicker">Awards</div>
                  <ul className="csit-list">
                    <li>Best Researcher Excellence Award from Knowledge Research Academy to Dr. Sk Khaja Shareef</li>
                    <li>National Teaching Excellence Award from I2OR to Dr. Y. Lakshmi Prasanna</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === 'Events' && (
            <div className="csit-section">
              <div className="csit-section-title">Talks &amp; Events</div>
              <div className="csit-event-grid">
                <div className="csit-event-card">
                  <img src={eventCryptonize} alt="Cryptonize" />
                  <div className="csit-event-title">Cryptonize</div>
                  <div className="csit-muted">Talk</div>
                </div>
                <div className="csit-event-card">
                  <img src={eventIeee} alt="IEEE Membership Awareness Program" />
                  <div className="csit-event-title">IEEE Membership Awareness Program</div>
                  <div className="csit-muted">Event</div>
                </div>
                <div className="csit-event-card">
                  <img src={eventNvidia} alt="Programs & Resources from NVIDIA" />
                  <div className="csit-event-title">Programs &amp; Resources from NVIDIA</div>
                  <div className="csit-muted">Orientation / Talk</div>
                </div>
              </div>
              <div className="csit-card" style={{ marginTop: 20 }}>
                <div className="csit-card-kicker">ABC Club Inauguration</div>
                <div className="csit-strong">Inauguration of the Algorand Blockchain Club</div>
                <ul className="csit-list" style={{ marginTop: 10 }}>
                  <li>Date: 21st September 2024</li>
                  <li>Time: 1:30 PM to 4:00 PM</li>
                  <li>Venue: Auditorium, KL University, Bachupally Campus</li>
                  <li>Chief Guest: Mr. Akash Rao Mallareddy (Regional Ambassador, Cloud Engineer, Entrepreneur, Researcher)</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </DeptTabLayout>

    <Footer />
  </div>
);

export default CSITPage;
