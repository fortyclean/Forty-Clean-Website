import { useState } from 'react';
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
      console.error('Error adding customer:', error);
      setMessage(
        error instanceof Error && error.message.includes('signed in')
          ? 'يجب تسجيل الدخول أولاً لإضافة عميل'
          : 'حدث خطأ أثناء إضافة العميل'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 bg-slate-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-blue-900">إضافة عميل جديد</h2>
            <p className="mt-3 text-gray-500 font-bold">أدخل البيانات الأساسية وسيتم حفظها مباشرة داخل النظام</p>
          </div>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-black text-blue-900 mb-2">
                  الاسم
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="اسم العميل"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-blue-900 font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-sm font-black text-blue-900 mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="customer-phone"
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="رقم الهاتف"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-blue-900 font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-white font-black shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'جارٍ الإضافة...' : 'إضافة العميل'}
              </button>

              {message ? (
                <p className={`text-center font-bold ${message.includes('بنجاح') ? 'text-emerald-600' : 'text-red-600'}`}>
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
