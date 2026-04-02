import { useEffect, useState } from 'react';
import AddCustomerForm from '../components/AddCustomerForm';
import AdminLogin from '../components/AdminLogin';
import CustomersList from '../components/CustomersList';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { getAdminClaims, getFirebaseAuth } from '../lib/firebase';

export default function Admin() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        const { isAdmin } = await getAdminClaims(user);

        setIsSignedIn(Boolean(user));
        setCurrentUserEmail(user?.email ?? null);
        setIsAuthorizedAdmin(isAdmin);
        setAuthReady(true);
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <Layout variant="landing">
      <Seo title="لوحة الإدارة" robots="noindex,nofollow,noarchive,nosnippet" />
      <main className="min-h-screen bg-slate-50 pb-16 pt-28 dark:bg-slate-950">
        <div className="container mx-auto max-w-5xl space-y-6 px-4">
          <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h1 className="text-3xl font-black text-blue-900 dark:text-slate-100 md:text-4xl">لوحة الإدارة</h1>
            <p className="mt-3 font-bold text-gray-500 dark:text-slate-400">
              صفحة خاصة لإدارة العملاء والعملاء المحتملين، وتظهر فقط للحسابات التي تحمل صلاحية إدارة واضحة داخل Firebase.
            </p>
            <p className="mt-2 text-sm font-bold text-gray-400 dark:text-slate-500">
              يشترط وجود claim باسم `admin: true` أو `role: "admin"` داخل حساب Firebase.
            </p>
          </section>

          <AdminLogin />

          {authReady ? (
            isSignedIn && isAuthorizedAdmin ? (
              <>
                <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                  <p className="font-bold text-gray-600 dark:text-slate-300">مرحبًا {currentUserEmail}</p>
                </section>
                <AddCustomerForm />
                <CustomersList />
              </>
            ) : isSignedIn ? (
              <section className="rounded-[2rem] border border-red-100 bg-white p-6 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900 md:p-8">
                <p className="font-bold text-red-600 dark:text-red-300">هذا الحساب مسجل الدخول، لكنه لا يحمل صلاحية الإدارة المطلوبة.</p>
              </section>
            ) : (
              <section className="rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
                <p className="font-bold text-gray-600 dark:text-slate-300">سجّل دخولك للوصول إلى أدوات الإدارة.</p>
              </section>
            )
          ) : (
            <section className="rounded-[2rem] border border-gray-100 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <p className="font-bold text-gray-600 dark:text-slate-300">جارٍ التحقق من حالة تسجيل الدخول...</p>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}
