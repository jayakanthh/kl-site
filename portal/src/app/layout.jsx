import './globals.css';

export const metadata = {
  title: 'Faculty Portal | KLH Hyderabad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="portal-shell">
          <div className="portal-shell-top">
            <div className="container portal-shell-top-inner">
              <a href="/" className="portal-brand">
                <img src="/logo-final.png?v=20260324" alt="KL University Logo" />
              </a>
            </div>
          </div>
          <div className="portal-shell-body">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
