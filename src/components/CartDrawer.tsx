import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, User as UserIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

const CartDrawer = () => {
  const { cart, user, removeFromCart, clearCart } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (cart.length === 0 && !user) {
    return null;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div className="fixed right-6 top-24 z-[60] flex flex-col gap-4">
        {cart.length > 0 ? (
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl transition-all hover:scale-110"
            aria-label="فتح سلة الحجوزات"
          >
            <ShoppingCart className="h-7 w-7" />
            <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-black text-white">
              {cart.length}
            </span>
          </button>
        ) : null}

        {user ? (
          <div className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-blue-600 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <UserIcon className="h-7 w-7" />
            <div className="invisible absolute right-full top-0 mr-4 min-w-[200px] rounded-2xl border border-gray-100 bg-white p-4 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
              <p className="font-black text-blue-900 dark:text-slate-100">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{user.phone}</p>
            </div>
          </div>
        ) : null}
      </div>

      {isCartOpen ? (
        <>
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-[70] animate-in bg-black/40 backdrop-blur-sm fade-in duration-200"
          />
          <div className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md animate-in flex-col bg-white p-8 shadow-2xl slide-in-from-right duration-300 dark:bg-slate-950">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-blue-900 dark:text-slate-100">سلة الحجوزات</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-2 transition hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="إغلاق السلة"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="group relative rounded-3xl border border-gray-100 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute left-4 top-4 text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:text-red-600"
                    aria-label="حذف العنصر"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-blue-900 dark:text-slate-100">
                        {item.service === 'cleaning' ? 'تنظيف منازل' : 'مكافحة حشرات'}
                      </p>
                      <p className="font-black text-emerald-600 dark:text-emerald-400">{item.price} د.ك</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-8 dark:border-slate-800">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-bold text-gray-500 dark:text-slate-400">الإجمالي</span>
                <span className="text-3xl font-black text-blue-900 dark:text-slate-100">{total} د.ك</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={clearCart} className="rounded-2xl py-6 font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  مسح السلة
                </Button>
                <Link to="/booking" onClick={() => setIsCartOpen(false)} className="w-full">
                  <Button className="w-full rounded-2xl bg-blue-600 py-6 font-black text-white hover:bg-blue-700">
                    إتمام الحجز
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CartDrawer;
