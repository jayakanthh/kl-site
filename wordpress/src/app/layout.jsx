import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
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

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

export const metadata = {
  title: 'KLH Hyderabad',
  description: 'KLH Hyderabad Campus website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`}>
      <body>
        <NextTopLoader color="#A52A2A" height={3} showSpinner={false} />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
