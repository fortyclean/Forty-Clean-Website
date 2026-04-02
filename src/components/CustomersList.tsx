import { useEffect, useState } from 'react';
import { getCustomers, getDb, getFirebaseAuth } from '../lib/firebase';

type CustomerStatus = 'new' | 'contacted' | 'completed';
type CustomerFilter = 'all' | CustomerStatus;
type SortOption = 'latest' | 'name' | 'status';
type FeedbackTone = 'success' | 'error';

type Customer = {
  id: string;
  name?: string;
  phone?: string;
  status?: CustomerStatus;
  createdAt?: unknown;
  userId?: string;
};

const statusLabels: Record<CustomerStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  completed: 'مكتمل',
};

const statusBadgeClasses: Record<CustomerStatus, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const statusSortWeight: Record<CustomerStatus, number> = {
  new: 0,
  contacted: 1,
  completed: 2,
};

const CUSTOMER_FILTER_STORAGE_KEY = 'fortyclean:customers-filter';
const CUSTOMER_SEARCH_STORAGE_KEY = 'fortyclean:customers-search';
const CUSTOMER_SORT_STORAGE_KEY = 'fortyclean:customers-sort';

export default function CustomersList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>('success');
  const [filter, setFilter] = useState<CustomerFilter>(() => {
    if (typeof window === 'undefined') {
      return 'all';
    }

    const savedFilter = window.localStorage.getItem(CUSTOMER_FILTER_STORAGE_KEY);
    return savedFilter === 'new' || savedFilter === 'contacted' || savedFilter === 'completed' || savedFilter === 'all'
      ? savedFilter
      : 'all';
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem(CUSTOMER_SEARCH_STORAGE_KEY) || '';
  });
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    if (typeof window === 'undefined') {
      return 'latest';
    }

    const savedSort = window.localStorage.getItem(CUSTOMER_SORT_STORAGE_KEY);
    return savedSort === 'name' || savedSort === 'status' || savedSort === 'latest' ? savedSort : 'latest';
  });
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function loadCustomers() {
      try {
        const data = await getCustomers();
        if (isMounted) {
          setCustomers(data as Customer[]);
        }
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    const handleCustomersChanged = () => {
      setLoading(true);
      void loadCustomers();
    };

    window.addEventListener('customers:changed', handleCustomersChanged);

    void (async () => {
      const auth = await getFirebaseAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!isMounted) {
          return;
        }

        setIsSignedIn(Boolean(user));
        setLoading(true);
        void loadCustomers();
      });
    })();

    return () => {
      isMounted = false;
      unsubscribe?.();
      window.removeEventListener('customers:changed', handleCustomersChanged);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CUSTOMER_FILTER_STORAGE_KEY, filter);
  }, [filter]);

  useEffect(() => {
    window.localStorage.setItem(CUSTOMER_SEARCH_STORAGE_KEY, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    window.localStorage.setItem(CUSTOMER_SORT_STORAGE_KEY, sortBy);
  }, [sortBy]);

  function showFeedback(message: string, tone: FeedbackTone) {
    setFeedbackMessage(message);
    setFeedbackTone(tone);
  }

  function startEdit(customer: Customer) {
    setEditingId(customer.id);
    setEditName(customer.name || '');
    setEditPhone(customer.phone || '');
    setFeedbackMessage('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  }

  function resetControls() {
    setFilter('all');
    setSearchTerm('');
    setSortBy('latest');
    setFeedbackMessage('');
  }

  async function handleUpdate(id: string) {
    if (!editName.trim() || !editPhone.trim()) {
      showFeedback('يرجى إدخال الاسم ورقم الهاتف قبل الحفظ.', 'error');
      return;
    }

    try {
      const db = await getDb();
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'customers', id), {
        name: editName.trim(),
        phone: editPhone.trim(),
      });

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === id
            ? {
                ...customer,
                name: editName.trim(),
                phone: editPhone.trim(),
              }
            : customer
        )
      );

      cancelEdit();
      showFeedback('تم تحديث بيانات العميل بنجاح.', 'success');
    } catch (error) {
      console.error('Error updating customer:', error);
      showFeedback('تعذر تحديث بيانات العميل حاليًا.', 'error');
    }
  }

  async function handleStatusChange(id: string, status: CustomerStatus) {
    try {
      const db = await getDb();
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'customers', id), { status });

      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === id
            ? {
                ...customer,
                status,
              }
            : customer
        )
      );

      showFeedback('تم تحديث حالة العميل.', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showFeedback('تعذر تحديث حالة العميل.', 'error');
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const db = await getDb();
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'customers', id));
      setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== id));

      if (editingId === id) {
        cancelEdit();
      }

      showFeedback('تم حذف العميل من القائمة.', 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showFeedback('تعذر حذف العميل حاليًا.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopyPhone(phone?: string) {
    if (!phone) {
      showFeedback('لا يوجد رقم هاتف لنسخه.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      showFeedback('تم نسخ رقم الهاتف.', 'success');
    } catch (error) {
      console.error('Error copying phone:', error);
      showFeedback('تعذر نسخ رقم الهاتف.', 'error');
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    const matchesFilter = filter === 'all' ? true : (customer.status || 'new') === filter;
    const matchesSearch =
      normalizedSearch === ''
        ? true
        : (customer.name || '').toLowerCase().includes(normalizedSearch) ||
          (customer.phone || '').toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '', 'ar');
    }

    if (sortBy === 'status') {
      const aStatus = statusSortWeight[a.status || 'new'];
      const bStatus = statusSortWeight[b.status || 'new'];
      if (aStatus !== bStatus) {
        return aStatus - bStatus;
      }

      return (a.name || '').localeCompare(b.name || '', 'ar');
    }

    return 0;
  });

  const stats = {
    all: customers.length,
    new: customers.filter((customer) => (customer.status || 'new') === 'new').length,
    contacted: customers.filter((customer) => customer.status === 'contacted').length,
    completed: customers.filter((customer) => customer.status === 'completed').length,
  };

  const hasActiveControls = filter !== 'all' || searchTerm.trim() !== '' || sortBy !== 'latest';
  const visibleCustomersCount = sortedCustomers.length;

  return (
    <section className="border-y border-gray-100 bg-white py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-blue-900 md:text-4xl">العملاء</h2>
          <p className="mt-3 font-bold text-gray-500">هذه البطاقات تعرض عملاء الحساب المسجل فقط.</p>
        </div>

        {loading ? (
          <p className="text-center font-bold text-gray-500">جاري تحميل العملاء...</p>
        ) : !isSignedIn ? (
          <p className="text-center font-bold text-gray-500">سجّل دخولك لعرض عملائك.</p>
        ) : customers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-slate-50 px-6 py-10 text-center">
            <p className="font-bold text-gray-500">لا يوجد عملاء مرتبطون بهذا الحساب حاليًا.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'all' ? 'border-blue-200 bg-blue-50 ring-4 ring-blue-100' : 'border-gray-100 bg-slate-50 hover:border-blue-100'
                }`}
              >
                <p className="text-sm font-black text-gray-500">إجمالي العملاء</p>
                <p className="mt-2 text-3xl font-black text-blue-900">{stats.all}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('new')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'new' ? 'border-blue-200 bg-blue-50 ring-4 ring-blue-100' : 'border-blue-100 bg-blue-50 hover:border-blue-200'
                }`}
              >
                <p className="text-sm font-black text-blue-600">جديد</p>
                <p className="mt-2 text-3xl font-black text-blue-900">{stats.new}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('contacted')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'contacted'
                    ? 'border-amber-200 bg-amber-50 ring-4 ring-amber-100'
                    : 'border-amber-100 bg-amber-50 hover:border-amber-200'
                }`}
              >
                <p className="text-sm font-black text-amber-600">تم التواصل</p>
                <p className="mt-2 text-3xl font-black text-amber-700">{stats.contacted}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'completed'
                    ? 'border-emerald-200 bg-emerald-50 ring-4 ring-emerald-100'
                    : 'border-emerald-100 bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                <p className="text-sm font-black text-emerald-600">مكتمل</p>
                <p className="mt-2 text-3xl font-black text-emerald-700">{stats.completed}</p>
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="w-full max-w-md">
                <label htmlFor="customer-search" className="mb-2 block text-sm font-black text-gray-500">
                  بحث
                </label>
                <input
                  id="customer-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="ابحث بالاسم أو رقم الهاتف"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <label htmlFor="customer-filter" className="text-sm font-black text-gray-500">
                تصفية الحالة:
              </label>
              <select
                id="customer-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value as CustomerFilter)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">الكل</option>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="completed">مكتمل</option>
              </select>

              <label htmlFor="customer-sort" className="text-sm font-black text-gray-500">
                ترتيب حسب:
              </label>
              <select
                id="customer-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="latest">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="status">الحالة</option>
              </select>
            </div>

            <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-100 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-black text-blue-900">النتائج المعروضة: {visibleCustomersCount}</p>
                <p className="text-xs font-bold text-gray-500">يمكنك الضغط على بطاقات الإحصاء لتفعيل الفلترة بسرعة.</p>
              </div>
              {hasActiveControls ? (
                <button
                  type="button"
                  onClick={resetControls}
                  className="inline-flex items-center justify-center rounded-2xl bg-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-300"
                >
                  إعادة ضبط البحث والفلاتر
                </button>
              ) : null}
            </div>

            {feedbackMessage ? (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-black ${
                  feedbackTone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            {sortedCustomers.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
                <p className="font-bold text-gray-500">لا يوجد عملاء مطابقون للبحث أو الحالة المختارة.</p>
                {hasActiveControls ? (
                  <button
                    type="button"
                    onClick={resetControls}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
                  >
                    عرض جميع العملاء
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedCustomers.map((customer) => {
                  const currentStatus = customer.status || 'new';

                  return (
                    <div
                      key={customer.id}
                      className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                      {editingId === customer.id ? (
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            placeholder="اسم العميل"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(event) => setEditPhone(event.target.value)}
                            placeholder="رقم الهاتف"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-lg font-black text-blue-900">{customer.name || 'بدون اسم'}</p>
                          <p className="font-bold text-gray-500">{customer.phone || 'بدون هاتف'}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${statusBadgeClasses[currentStatus]}`}>
                              {statusLabels[currentStatus]}
                            </span>
                            <select
                              value={currentStatus}
                              onChange={(event) => void handleStatusChange(customer.id, event.target.value as CustomerStatus)}
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="completed">مكتمل</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <p className="break-all text-xs font-black text-gray-400">{customer.id}</p>
                        {editingId === customer.id ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleUpdate(customer.id)}
                              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700"
                            >
                              حفظ
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="inline-flex items-center justify-center rounded-2xl bg-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-300"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopyPhone(customer.phone)}
                              className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-300"
                            >
                              نسخ الرقم
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(customer)}
                              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-2 text-sm font-black text-white transition hover:bg-amber-600"
                            >
                              تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(customer.id)}
                              disabled={deletingId === customer.id}
                              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {deletingId === customer.id ? 'جارٍ الحذف...' : 'حذف'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
