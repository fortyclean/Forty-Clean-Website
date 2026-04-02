import { Routes, Route, Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { ShoppingCart, User as UserIcon, X, Trash2 } from 'lucide-react';
import { useStore } from './lib/store';
import { Button } from './components/ui/button';

const Home = lazy(() => import('./pages/Home'));
const Cleaning = lazy(() => import('./pages/Cleaning'));
const Pest = lazy(() => import('./pages/Pest'));
const Offers = lazy(() => import('./pages/Offers'));
const Blog = lazy(() => import('./pages/Blog'));
const Admin = lazy(() => import('./pages/Admin'));
const Booking = lazy(() => import('./pages/Booking'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const { cart, user, removeFromCart, clearCart } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-4">
        {cart.length > 0 ? (
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center relative hover:scale-110 transition-all"
          >
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cart.length}
            </span>
          </button>
        ) : null}

        {user ? (
          <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl shadow-2xl flex items-center justify-center border border-gray-100 group relative">
            <UserIcon className="w-7 h-7" />
            <div className="absolute right-full mr-4 top-0 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[200px]">
              <p className="font-black text-blue-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.phone}</p>
            </div>
          </div>
        ) : null}
      </div>

      {isCartOpen ? (
        <>
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] animate-in fade-in duration-200"
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-blue-900">سلة الحجوزات</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 left-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-blue-900">{item.service === 'cleaning' ? 'تنظيف منازل' : 'مكافحة حشرات'}</p>
                      <p className="text-emerald-600 font-black">{item.price} د.ك</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-100 mt-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold">الإجمالي</span>
                <span className="text-3xl font-black text-blue-900">
                  {cart.reduce((sum, item) => sum + item.price, 0)} د.ك
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={clearCart} className="rounded-2xl py-6 font-bold">
                  مسح السلة
                </Button>
                <Link to="/booking" onClick={() => setIsCartOpen(false)} className="w-full">
                  <Button className="w-full bg-blue-600 py-6 rounded-2xl font-black">
                    إتمام الحجز
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/pest" element={<Pest />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/dashboard-secret" element={<Admin />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin-leads" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
