import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import AdminLogin from '../components/AdminLogin';
import AddCustomerForm from '../components/AddCustomerForm';
import CustomersList from '../components/CustomersList';
import { getFirebaseAuth } from '../lib/firebase';

const allowedAdminEmail = (import.meta.env.VITE_ADMIN_ALLOWED_EMAIL as string | undefined)?.trim().toLowerCase();

export default function Admin() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged, signOut } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        const normalizedEmail = user?.email?.trim().toLowerCase() ?? null;
        const authorized = Boolean(normalizedEmail && allowedAdminEmail && normalizedEmail === allowedAdminEmail);

        if (user && allowedAdminEmail && !authorized) {
          await signOut(auth);
          setIsSignedIn(false);
          setCurrentUserEmail(null);
          setIsAuthorizedAdmin(false);
          setAuthReady(true);
          return;
        }

        setIsSignedIn(Boolean(user));
        setCurrentUserEmail(user?.email ?? null);
        setIsAuthorizedAdmin(authorized || (!allowedAdminEmail && Boolean(user)));
        setAuthReady(true);
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, []);

  return (
    <Layout variant="landing">
      <Helmet>
        <title>لوحة الإدارة</title>
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
      </Helmet>
      <main className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-black text-blue-900">لوحة الإدارة</h1>
            <p className="mt-3 text-gray-500 font-bold">
              صفحة خاصة لإدارة العملاء وتظهر فقط بعد تسجيل الدخول بحساب Firebase.
            </p>
            {allowedAdminEmail ? (
              <p className="mt-2 text-sm font-bold text-gray-400">البريد المصرح له: {allowedAdminEmail}</p>
            ) : null}
          </section>

          <AdminLogin />

          {authReady ? (
            isSignedIn && isAuthorizedAdmin ? (
              <>
                <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
                  <p className="text-gray-600 font-bold">مرحبًا {currentUserEmail}</p>
                </section>
                <AddCustomerForm />
                <CustomersList />
              </>
            ) : isSignedIn ? (
              <section className="bg-white rounded-[2rem] border border-red-100 shadow-sm p-6 md:p-8 text-center">
                <p className="text-red-600 font-bold">هذا الحساب غير مصرح له بدخول لوحة الإدارة.</p>
              </section>
            ) : (
              <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 text-center">
                <p className="text-gray-600 font-bold">سجّل دخولك للوصول إلى أدوات الإدارة.</p>
              </section>
            )
          ) : (
            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8 text-center">
              <p className="text-gray-600 font-bold">جاري التحقق من حالة تسجيل الدخول...</p>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}
