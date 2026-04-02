import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <Layout variant="landing">
      <Seo title="404" robots="noindex" />
      <main className="min-h-screen bg-slate-50 pb-16 pt-28 dark:bg-slate-950">
        <div className="container mx-auto max-w-3xl px-4">
          <section className="rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12">
            <p className="mb-4 text-sm font-black text-gray-400 dark:text-slate-500">404</p>
            <h1 className="text-3xl font-black text-blue-900 dark:text-slate-100 md:text-4xl">الصفحة غير موجودة</h1>
            <p className="mt-4 font-bold text-gray-500 dark:text-slate-400">
              الرابط الذي طلبته غير متاح أو تم نقله.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-blue-700"
              >
                العودة للرئيسية
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
