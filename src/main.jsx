import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CSEPage from './pages/CSEPage.jsx';
import CSITPage from './pages/CSITPage.jsx';
import AIDSPage from './pages/AIDSPage.jsx';
import ECEPage from './pages/ECEPage.jsx';
import FEPage from './pages/FEPage.jsx';
import MCAPage from './pages/MCAPage.jsx';
import BCAPage from './pages/BCAPage.jsx';
import MBAPage from './pages/MBAPage.jsx';
import BBAPage from './pages/BBAPage.jsx';
import FeeStructurePage from './pages/FeeStructurePage.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/cse', element: <CSEPage /> },
  { path: '/csit', element: <CSITPage /> },
  { path: '/ai-ds', element: <AIDSPage /> },
  { path: '/ece', element: <ECEPage /> },
  { path: '/fe', element: <FEPage /> },
  { path: '/mca', element: <MCAPage /> },
  { path: '/bca', element: <BCAPage /> },
  { path: '/mba', element: <MBAPage /> },
  { path: '/bba', element: <BBAPage /> },
  { path: '/fee-structure', element: <FeeStructurePage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
