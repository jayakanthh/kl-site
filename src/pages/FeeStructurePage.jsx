import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import './FeeStructurePage.css';

const feeTables = [
  {
    title: 'Hyderabad Campus Fee Structure for AY 2024-25',
    caption: 'HYDERABAD CAMPUS FEE STRUCTURE FOR AY 2024-25',
    rows: [
      ['Program', 'Admissions Fee (One time)', 'Merit Fee* / Semester', 'Total Amount for 1st Semester'],
      ['B.Tech (Computer Science and Engineering)', 'Rs. 15,000', 'Rs. 1,45,000', 'Rs. 1,60,000'],
      ['B.Tech (Computer Science & Information Technology)', 'Rs. 15,000', 'Rs. 1,35,000', 'Rs. 1,50,000'],
      ['B.Tech (Electronics and Communication Engg)', 'Rs. 15,000', 'Rs. 1,25,000', 'Rs. 1,40,000'],
      ['B.Tech (Electronics Engineering)', 'Rs. 15,000', 'Rs. 1,15,000', 'Rs. 1,30,000'],
    ],
    note: '',
  },
  {
    title: 'MBA Merit Fee',
    caption: 'MERIT FEE* - GLOBAL BUSINESS SCHOOL, KONDAPUR, HYDERABAD',
    rows: [
      ['Program Name', 'Duration', 'Admissions Fee (One time)', 'Merit Fee* / Semester', 'Total Amount for 1st Semester'],
      ['MBA - Marketing/HR/Finance/Digital Marketing/Business Analytics', '2 Yrs', 'Rs. 15,000', 'Rs. 2,25,000', 'Rs. 2,40,000'],
    ],
    note: 'Note: # ACCA / CMA Fee Rs. 17,500/- Per Semester. ** ERP Certification Fee Rs. 33,000/- for MBA for entire program.',
  },
  {
    title: 'Hostel Fee 2023-24 (Boys)',
    caption: '',
    rows: [
      ['No', 'Type of Room (Boys)', 'Mess Charges 2023-24', 'GST 5%', 'Room Rent & Maintenance', 'Total Hostel Fee 2023-24', 'Electricity Deposit', 'Registration Fees'],
      ['1', 'Non A/C Room attached Toilet (2-bed)', '80,000', '4,000', '56,000', '1,40,000', '5,000', '5,000'],
      ['2', 'A/C Room attached Toilet (2-bed)', '80,000', '4,000', '66,000', '1,50,000', '5,000', '5,000'],
    ],
    note:
      'Note: Registration fee (Not Refundable) is one time only and to be paid at the time of Admission into Hostel. For payment of hostel fee through online, visit www.klh.edu.in. For mess charges, GST, establishment charges to be paid through DD or online in favour of “Harniks India LLP” payable at Hyderabad. Room rent, electricity, Registration & caution deposit to be paid through DD/online in favour of “KL UNIVERSITY” payable at Hyderabad. Hostel applications are available at Help Desk or download from www.klh.edu.in. For all type of rooms, electricity charges to be paid extra through prepaid meters and will be adjusted from Electricity deposit. Rooms are alloted on First Come First Serve basis and subject to availability.',
  },
  {
    title: 'Cancellation and Fee Refund Policy',
    caption: '',
    rows: [
      ['Sr. No', 'Percentage of Refund of Tuition fees', 'Point of time when notice of withdrawal of admission'],
      ['1', '80%', 'Up to 15 days after the formally notified last date of admission'],
      ['2', '50%', 'More than 15 days but less than 30 days after formally notified last date of admission'],
      ['3', '0%', 'More than 30 days after formally notified last date of admission'],
    ],
    note: '* This is in addition to admission fees which will not be refunded.',
  },
];

const FeeTable = ({ table }) => {
  const [header, ...body] = table.rows;
  const colCount = Math.max(...table.rows.map((r) => r.length));
  const normalize = (row) => {
    if (row.length === colCount) return row;
    return [...row, ...Array(colCount - row.length).fill('')];
  };

  return (
    <div className="fee-card">
      <div className="fee-card-head">
        <h3>{table.title}</h3>
        {table.caption ? <div className="fee-caption">{table.caption}</div> : null}
      </div>
      <div className="fee-table-wrap">
        <table className="fee-table">
          <thead>
            <tr>
              {normalize(header).map((cell, idx) => (
                <th key={idx}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, rIdx) => (
              <tr key={rIdx}>
                {normalize(row).map((cell, cIdx) => (
                  <td key={cIdx}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? <div className="fee-note">{table.note}</div> : null}
    </div>
  );
};

const FeeStructurePage = () => {
  return (
    <div className="App">
      <Navbar />

      <section className="section hero-slim">
        <div className="container">
          <div className="hero-title">
            <div className="eyebrow">Admissions</div>
            <h1>Fee Structure</h1>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.75rem', paddingBottom: '0.25rem' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Fee Structure' }]} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="fee-grid">
            {feeTables.map((t) => (
              <FeeTable key={t.title} table={t} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeeStructurePage;
