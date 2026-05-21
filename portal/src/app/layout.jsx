import './globals.css';
/* eslint-disable no-unused-vars -- JSX component usage not tracked by this rule */
import PortalHeader from './_header';
import PageTransition from './_transition';
/* eslint-enable no-unused-vars */

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
