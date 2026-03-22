import { Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Cleaning = lazy(() => import('./pages/Cleaning'));
const Pest = lazy(() => import('./pages/Pest'));
const Offers = lazy(() => import('./pages/Offers'));
const Blog = lazy(() => import('./pages/Blog'));
const AdminLeads = lazy(() => import('./pages/AdminLeads'));
const Booking = lazy(() => import('./pages/Booking'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Lead Capture Backup Helper
    (window as any).showLeads = () => {
      const leads = JSON.parse(localStorage.getItem('forty_captured_leads') || '[]');
      if (leads.length === 0) {
        console.log("%c📭 No leads captured yet.", "color: #64748b; font-weight: bold;");
      } else {
        console.log("%c🎯 Captured Leads Backup:", "color: #2563eb; font-weight: bold; font-size: 14px;");
        console.table(leads);
      }
    };

    // Log count on start
    const leads = JSON.parse(localStorage.getItem('forty_captured_leads') || '[]');
    if (leads.length > 0) {
      console.log(`%c✓ Found ${leads.length} captured leads in backup. Type showLeads() to view.`, "color: #059669; font-weight: bold;");
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/pest" element={<Pest />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin-leads" element={<AdminLeads />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Suspense>
  );
}

export default App;
