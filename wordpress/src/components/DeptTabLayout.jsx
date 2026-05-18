'use client';
import { useState } from 'react';

const DEFAULT_TABS = ['Overview', 'Program Outcomes', 'Committees', 'Research', 'Events'];

export default function DeptTabLayout({ tabs = DEFAULT_TABS, children }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <>
      <section className="dept-tab-bar-wrap">
        <div className="container">
          <div className="dept-tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`dept-tab-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          {children(activeTab)}
        </div>
      </section>
    </>
  );
}
