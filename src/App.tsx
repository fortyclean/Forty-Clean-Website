import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from './lib/store';

const Home = lazy(() => import('./pages/Home'));
const Cleaning = lazy(() => import('./pages/Cleaning'));
const Pest = lazy(() => import('./pages/Pest'));
const Offers = lazy(() => import('./pages/Offers'));
const Blog = lazy(() => import('./pages/Blog'));
const Admin = lazy(() => import('./pages/Admin'));
const Booking = lazy(() => import('./pages/Booking'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
  </div>
);

function App() {
  const { cart, user } = useStore();

  return (
    <Suspense fallback={<PageLoader />}>
      {cart.length > 0 || user ? (
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
      ) : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/pest" element={<Pest />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard-secret" element={<Navigate to="/admin" replace />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin-leads" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
