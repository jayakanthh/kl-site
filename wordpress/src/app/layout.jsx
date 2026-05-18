import '../index.css';
import '../App.css';

import '../components/Navbar.css';
import '../components/Hero.css';
import '../components/Programs.css';
import '../components/Breadcrumb.css';
import '../components/Footer.css';

import '../screens/DepartmentCommon.css';
import '../screens/CSITPage.css';
import '../screens/ECEPage.css';
import '../screens/FeeStructurePage.css';
import '../screens/FacultyPage.css';

import Navbar from '../components/Navbar';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'KLH Hyderabad',
  description: 'KLH Hyderabad Campus website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="#A52A2A" height={3} showSpinner={false} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
