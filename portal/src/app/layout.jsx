/* eslint-disable no-unused-vars */
import './globals.css';
import PortalHeader from './_header';
import PageTransition from './_transition';

export const metadata = {
  title: 'Faculty Portal | KLH Hyderabad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="portal-shell">
          <PortalHeader />
          <div className="portal-shell-body">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </body>
    </html>
  );
}
