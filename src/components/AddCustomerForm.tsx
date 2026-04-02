import { useState } from 'react';
import { getUserFacingErrorMessage, reportAppError } from '../lib/appError';
import { createCustomer } from '../lib/firebase';

export default function AddCustomerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setMessage('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await createCustomer(name, phone);
      setName('');
      setPhone('');
      setMessage('تمت إضافة العميل بنجاح');
      window.dispatchEvent(new Event('customers:changed'));
    } catch (error) {
      reportAppError({ scope: 'add-customer', error });
      setMessage(
        getUserFacingErrorMessage(error, {
          fallback: 'حدث خطأ أثناء إضافة العميل',
          signedOut: 'يجب تسجيل الدخول أولًا لإضافة عميل',
        })
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border-y border-gray-100 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-blue-900 dark:text-slate-100 md:text-4xl">إضافة عميل جديد</h2>
            <p className="mt-3 font-bold text-gray-500 dark:text-slate-400">
              أدخل البيانات الأساسية وسيتم حفظها مباشرة داخل النظام
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="customer-name" className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">
                  الاسم
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="اسم العميل"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">
                  رقم الهاتف
                </label>
                <input
                  id="customer-phone"
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="رقم الهاتف"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'جارٍ الإضافة...' : 'إضافة العميل'}
              </button>

              {message ? (
                <p className={`text-center font-bold ${message.includes('بنجاح') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
