import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout variant="landing">
      <Helmet>
        <title>404</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen bg-slate-50 pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-12 text-center">
            <p className="text-sm font-black text-gray-400 mb-4">404</p>
            <h1 className="text-3xl md:text-4xl font-black text-blue-900">الصفحة غير موجودة</h1>
            <p className="mt-4 text-gray-500 font-bold">
              الرابط الذي طلبته غير متاح أو تم نقله.
            </p>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-black shadow-sm transition hover:bg-blue-700"
              >
                العودة إلى الرئيسية
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
