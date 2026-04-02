import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../lib/firebase';

const defaultAdminEmail = (import.meta.env.VITE_ADMIN_ALLOWED_EMAIL as string | undefined) || 'test@test.com';

export default function AdminLogin() {
  const [email, setEmail] = useState(defaultAdminEmail);
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUserEmail(user?.email ?? null);
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const auth = await getFirebaseAuth();
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('تم تسجيل الدخول بنجاح');
    } catch (error) {
      console.error(error);
      setMessage('فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const auth = await getFirebaseAuth();
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      setMessage('تم تسجيل الخروج');
    } catch (error) {
      console.error(error);
      setMessage('فشل تسجيل الخروج');
    }
  }

  return (
    <section className="py-16 bg-slate-100 border-y border-gray-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-blue-900">دخول المشرف</h2>
          </div>

          {currentUserEmail ? (
            <div className="space-y-4 text-center">
              <p className="text-gray-600 font-bold">مسجل الدخول: {currentUserEmail}</p>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3 text-blue-900 font-black transition hover:bg-gray-200"
              >
                تسجيل الخروج
              </button>
              {message ? (
                <p className={`font-bold ${message.includes('بنجاح') || message.includes('الخروج') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message}
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-black text-blue-900 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-blue-900 font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-black text-blue-900 mb-2">
                  كلمة المرور
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-blue-900 font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-black shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
              </button>

              {message ? (
                <p className={`font-bold ${message.includes('بنجاح') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {message}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
