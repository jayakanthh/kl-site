'use client';
import React from 'react';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import DeptTabLayout from '../components/DeptTabLayout';

import hodPhoto from '../assets/ece/07_Dr._S._Srinivas_Rao_Associate_ProfessorPhD_in_Nano_Materials_from_Pusan_National.jpeg';
import drLkPhoto from '../assets/ece/02_PhD_from_JNTU_College_of_Engineering_Kakinada.jpeg';
import drApPhoto from '../assets/ece/03_PhD_in_Medical_Imaging_from_Visvesvaraya_National_Institute_of_Technology_Nagpur.jpeg';
import drKalyanPhoto from '../assets/ece/04_Dr._Kalyan_S_Kasturi_ProfessorPhD_in_Digital_Signal_Processing_from_University_o.jpeg';
import drBspPhoto from '../assets/ece/05_PhD_in_Statistical_Signal_Processing_from_Arizona_State_University_USA.jpeg';
import drVrPhoto from '../assets/ece/06_Dr._V._Ravi_Kumar_Associate_ProfessorPhD_in_Speech_Processing_from_IIT_Hyderabad.jpeg';
import drPdrPhoto from '../assets/ece/08_Dr._P._Dhilleswara_Rao_Assistant_ProfessorPhD_in_VLSI_from_IIT_Bhubaneswar.jpeg';
import drVvbPhoto from '../assets/ece/09_Dr._V._Venu_Balaji_Assistant_ProfessorPhD_in_Cloud_Radio_Access_Networks_from_II.jpeg';
import mrNlpPhoto from '../assets/ece/10_Mr._N._Lava_Prasad_Assistant_ProfessorPursuing_PhD_in_Wireless_Communication_fro.jpeg';

import labIoT from '../assets/ece/11_Fundamentals_of_IoT_Lab.png';
import labDdc from '../assets/ece/12_Digital_Design_and_Computer_Architecture_Lab.png';
import labAnalogSignal from '../assets/ece/13_Analog_Electronic_Circuits_Design_Lab__Signal_and_Communication_Lab.png';
import labProcessors from '../assets/ece/14_Processors_and_Controllers_Lab_Electronic_System_Design_Lab.png';
import labVlsi1 from '../assets/ece/15_VLSI_Design_Lab.png';
import labVlsi2 from '../assets/ece/16_VLSI_Design_Lab.png';
import labVlsi3 from '../assets/ece/17_VLSI_Design_Lab.png';

const committees = [
  { name: 'DDC / DAC / BOS / Result Analysis Committee', items: ['Result Analysis of previous semester and CO attainment for Courses', 'Proposing Action Plan for Attainment improvements', 'Planning and initiating activities to improve department quality', 'Suggestions for academic improvements and implementation'] },
  { name: 'Research & Development Committee', items: ['Planning and initiating activities related to research within the department', 'Suggestions and proposals for improving research culture'] },
  { name: 'Lab Development Committee', items: ['Ensures smooth conduction of laboratory sessions', 'Monitors lab equipment availability and maintenance'] },
  { name: 'Events Committee', items: ['Plans and coordinates events, workshops, seminars, conferences and guest lectures', 'Maintains documentation and reports for events'] },
  { name: 'Mentoring Committee', items: ['Faculty mentoring and student support initiatives', 'Academic and career guidance activities'] },
  { name: 'Placements Committee', items: ['Placement coordination, training and readiness activities', 'Maintains placements-related documentation and drives'] },
  { name: 'Counselling Committee', items: ['Academic, career and personal counselling', 'Student welfare and follow-ups'] },
  { name: 'LMS/ERP Committee', items: ['Manages LMS/ERP operations, registrations and academic data', 'Supports course administration workflows'] },
  { name: 'Stakeholder Feedback Committee', items: ['Collects feedback from students, alumni, industry and stakeholders', 'Conducts feedback sessions twice per semester for improvements'] },
  { name: 'Vetting / Examination Committee', items: ['Reviews question papers before exams', 'Ensures quality and assessment standards'] },
  { name: 'Quality Circle Committee', items: ['Identifies and implements quality improvement initiatives', 'Drives continuous improvement processes'] },
  { name: 'Administrative Committees', items: ['Association activities, professional bodies, extension activities', 'Discipline, clubs and other departmental operations'] },
];

const featuredFaculty = [
  { name: 'Dr. Sunkara Srinivas Rao', title: 'Associate Professor', photo: hodPhoto, tag: 'Head of the Department' },
  { name: 'Dr. L. Koteswara Rao', title: 'Professor', photo: drLkPhoto },
  { name: 'Dr. A. Prabhakara Rao', title: 'Professor', photo: drApPhoto },
  { name: 'Dr. Kalyan S Kasturi', title: 'Professor', photo: drKalyanPhoto },
  { name: 'Dr. B. Sai Prasad', title: 'Associate Professor', photo: drBspPhoto, tag: 'Website Faculty Coordinator' },
  { name: 'Dr. V. Ravi Kumar', title: 'Associate Professor', photo: drVrPhoto },
  { name: 'Dr. P. Dhilleswara Rao', title: 'Assistant Professor', photo: drPdrPhoto },
  { name: 'Dr. V. Venu Balaji', title: 'Assistant Professor', photo: drVvbPhoto },
  { name: 'Mr. N. Lava Prasad', title: 'Assistant Professor', photo: mrNlpPhoto },
];

const otherTeachingStaff = [
  'Dr. S. Harsha', 'Mr. D. Balasubramanyam', 'Ms. M. Chaitanya', 'Mr. B. Hari Krishna',
  'Mr. S. Praveen Kumar', 'Mr. N. Srinivas', 'Mr. K. Srinivas', 'Mr. K. Venkatesh',
  'Mr. N. Srinivas Reddy', 'Ms. M. Sravani', 'Mr. D. Srikanth', 'Mr. K. Siva',
  'Ms. A. Lakshmi', 'Ms. E. Bharathi', 'Ms. M. Ruksana', 'Mr. K. Venkata Vinay',
  'Mr. K. Vinay Kumar', 'Mr. P. Dileep Kumar', 'Mr. A. Srinivas', 'Mr. K. Jagadeesh',
  'Mr. K. Rajasekhar', 'Mr. P. Srikanth', 'Mr. K. Nitesh',
];

const nonTeachingStaff = ['Mr. P. Srinivas Rao', 'Mr. K. Srinivas', 'Mr. M. Santosh Kumar', 'Mr. P. Ramesh'];

const labs = [
  { title: 'Fundamentals of IoT Lab', img: labIoT },
  { title: 'Digital Design & Computer Architecture Lab', img: labDdc },
  { title: 'Analog Electronic Circuits Design Lab / Signal & Communication Lab', img: labAnalogSignal },
  { title: 'Processors & Controllers Lab / Electronic System Design Lab', img: labProcessors },
  { title: 'VLSI Design Lab', img: labVlsi1 },
  { title: 'VLSI Design Lab', img: labVlsi2 },
  { title: 'VLSI Design Lab', img: labVlsi3 },
];

const ECEPage = () => (
  <div className="App">

    <section className="section hero-slim">
      <div className="container">
        <div className="hero-title">
          <div className="eyebrow">Department of</div>
          <h1>Electronics & Communication Engineering</h1>
        </div>
      </div>
    </section>
    <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'ECE' }]} />
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
                  <div className="ece-card-kicker">Department Overview</div>
                  <h2 style={{ marginBottom: '1rem' }}>Electronics &amp; Communication Engineering</h2>
                  <p>Electronics and Communication Engineering (ECE) is at the center of innovation, connecting the world through advanced communication technologies and smart electronic systems. The department provides a strong foundation in analog and digital circuits, signals and systems, communication engineering, VLSI, embedded systems, and IoT.</p>
                  <p>Students develop technical depth through hands-on labs, project-based learning, and exposure to modern tools and industry practices, preparing them for careers in semiconductor, telecom, embedded, and systems engineering.</p>
                  <div className="ece-pill-row" style={{ marginTop: '1.5rem' }}>
                    <div className="ece-pill">Academic Regulations: Y23</div>
                    <div className="ece-pill">Y24</div>
                    <div className="ece-pill">Y25</div>
                  </div>
                  <div className="dept-vm-row">
                    <div className="dept-vm-card">
                      <div className="ece-card-kicker">Vision</div>
                      <p>To become a globally recognized center of excellence in Electronics and Communication Engineering by fostering innovation-driven learning, research, and industry collaboration to address societal needs.</p>
                    </div>
                    <div className="dept-vm-card">
                      <div className="ece-card-kicker">Mission</div>
                      <p>To provide quality education through outcome-based learning, hands-on laboratories, and projects; promote research and innovation in emerging areas; and nurture ethical, competent, and industry-ready professionals.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="dept-hod-card">
                    <div className="ece-card-kicker">Head of the Department</div>
                    <img className="ece-hod-photo" src={hodPhoto} alt="Dr. Sunkara Srinivas Rao" />
                    <div className="ece-hod-name">Dr. Sunkara Srinivas Rao</div>
                    <div className="ece-muted">Associate Professor, Dept of ECE</div>
                  </div>
                  <div className="ece-card" style={{ marginTop: '1rem' }}>
                    <div className="ece-card-kicker">Website Faculty Coordinator</div>
                    <div className="ece-strong">Dr. B. Sai Prasad</div>
                    <div className="ece-muted">Associate Professor</div>
                  </div>
                </div>
              </div>

              <div className="ece-section">
                <div className="ece-section-title">People</div>
                <div className="ece-faculty-grid">
                  {featuredFaculty.map((p) => (
                    <div key={p.name} className="ece-person-card">
                      <img className="ece-person-photo" src={p.photo} alt={p.name} />
                      <div className="ece-person-body">
                        <div className="ece-person-name">{p.name}</div>
                        <div className="ece-person-title">{p.title}</div>
                        {p.tag && <div className="ece-person-tag">{p.tag}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ece-split" style={{ marginTop: 14 }}>
                  <div className="ece-card">
                    <div className="ece-card-kicker">Other Teaching Staff</div>
                    <ul className="ece-list">
                      {otherTeachingStaff.map((s) => <li key={s}>{s}, Assistant Professor</li>)}
                    </ul>
                  </div>
                  <div className="ece-card">
                    <div className="ece-card-kicker">Non-Teaching Staff</div>
                    <ul className="ece-list">
                      {nonTeachingStaff.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="ece-section">
                <div className="ece-section-title">Laboratories</div>
                <div className="ece-lab-grid">
                  {labs.map((l, idx) => (
                    <div key={`${l.title}-${idx}`} className="ece-lab-card">
                      <img src={l.img} alt={l.title} />
                      <div className="ece-lab-title">{l.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROGRAM OUTCOMES */}
          {activeTab === 'Program Outcomes' && (
            <div className="dept-coming-soon">Content will be updated soon</div>
          )}

          {/* COMMITTEES */}
          {activeTab === 'Committees' && (
            <div className="ece-section">
              <div className="ece-section-title">Departmental Committees</div>
              <div className="ece-committee-grid">
                {committees.map((c) => (
                  <div key={c.name} className="ece-card">
                    <div className="ece-strong">{c.name}</div>
                    <ul className="ece-list">
                      {c.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESEARCH */}
          {activeTab === 'Research' && (
            <div className="ece-section">
              <div className="ece-section-title">Research &amp; Activities</div>
              <div className="ece-stat-grid">
                <div className="ece-stat"><div className="ece-stat-label">Research Cohorts</div><div className="ece-stat-value">4</div></div>
                <div className="ece-stat"><div className="ece-stat-label">Journals</div><div className="ece-stat-value">20</div></div>
                <div className="ece-stat"><div className="ece-stat-label">Conferences</div><div className="ece-stat-value">31</div></div>
                <div className="ece-stat"><div className="ece-stat-label">Patents</div><div className="ece-stat-value">8</div></div>
              </div>
              <div className="ece-split" style={{ marginTop: 14 }}>
                <div className="ece-card">
                  <div className="ece-card-kicker">Faculty Activities</div>
                  <ul className="ece-list">
                    <li>Workshops: 17</li>
                    <li>Guest Lectures: 15</li>
                    <li>Seminars: 20</li>
                    <li>Conferences: 13</li>
                  </ul>
                </div>
                <div className="ece-card">
                  <div className="ece-card-kicker">Student Activities</div>
                  <ul className="ece-list">
                    <li>Projects: 10</li>
                    <li>Workshops: 25</li>
                    <li>Competitions: 27</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === 'Events' && (
            <div className="dept-coming-soon">Content will be updated soon</div>
          )}
        </>
      )}
    </DeptTabLayout>

    <Footer />
  </div>
);

export default ECEPage;
