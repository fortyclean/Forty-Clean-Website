import { useEffect, useState } from 'react';
import { getUserFacingErrorMessage, reportAppError } from '../lib/appError';
import { getAdminClaims, getFirebaseAuth } from '../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUserEmail(user?.email ?? null);
        const { isAdmin } = await getAdminClaims(user);
        setIsAdminUser(isAdmin);
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
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const { isAdmin } = await getAdminClaims(credential.user);

      setIsAdminUser(isAdmin);
      setMessage(
        isAdmin
          ? 'تم تسجيل الدخول بحساب إدارة معتمد.'
          : 'تم تسجيل الدخول، لكن هذا الحساب لا يحمل صلاحية الإدارة.'
      );
    } catch (error) {
      reportAppError({ scope: 'admin-login', error });
      setMessage(
        getUserFacingErrorMessage(error, {
          fallback: 'فشل تسجيل الدخول.',
          signedOut: 'تعذر التحقق من صلاحية الحساب. تأكد من claims الخاصة بالإدارة ثم حاول مرة أخرى.',
        })
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const auth = await getFirebaseAuth();
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      setIsAdminUser(false);
      setMessage('تم تسجيل الخروج.');
    } catch (error) {
      reportAppError({ scope: 'admin-logout', error });
      setMessage(
        getUserFacingErrorMessage(error, {
          fallback: 'فشل تسجيل الخروج.',
        })
      );
    }
  }

  const isSuccessMessage =
    isAdminUser || message.includes('تم تسجيل الخروج') || message.includes('تم تسجيل الدخول');

  return (
    <section className="border-y border-gray-200 bg-slate-100 py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-blue-900 dark:text-white md:text-4xl">دخول المشرف</h2>
            <p className="mt-3 text-sm font-bold text-gray-500 dark:text-slate-400">
              استخدم حساب Firebase الذي يحمل claim إدارة للوصول إلى لوحة التحكم.
            </p>
          </div>

          {currentUserEmail ? (
            <div className="space-y-4 text-center">
              <p className="font-bold text-gray-600 dark:text-slate-300">مسجل الدخول: {currentUserEmail}</p>
              <p className={`font-bold ${isAdminUser ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-300'}`}>
                {isAdminUser ? 'صلاحية الإدارة مفعلة لهذا الحساب.' : 'هذا الحساب لا يحمل claim إدارة بعد.'}
              </p>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center justify-center rounded-2xl bg-gray-100 px-6 py-3 font-black text-blue-900 transition hover:bg-gray-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                تسجيل الخروج
              </button>
              {message ? (
                <p className={`font-bold ${isSuccessMessage ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message}
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">
                  البريد الإلكتروني
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  placeholder="admin@company.com"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">
                  كلمة المرور
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="********"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>

              {message ? (
                <p className={`font-bold ${isSuccessMessage ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
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
