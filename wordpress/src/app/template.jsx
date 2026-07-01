export default function Template({ children }) {
  // CSS-based fade-in (see .page-fade-in in index.css).
  // Uses pure CSS instead of framer-motion so page content is always
  // visible even if JavaScript is slow, blocked, or fails to load.
  return <div className="page-fade-in">{children}</div>;
}
