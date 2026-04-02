import {
  statusBadgeClasses,
  statusLabels,
  useCustomers,
} from '../hooks/useCustomers';
import type { CustomerStatus } from '../hooks/useCustomers';

export default function CustomersList() {
  const {
    customers,
    sortedCustomers,
    stats,
    loading,
    isSignedIn,
    deletingId,
    editingId,
    editName,
    editPhone,
    feedbackMessage,
    feedbackTone,
    filter,
    searchTerm,
    sortBy,
    hasActiveControls,
    visibleCustomersCount,
    setFilter,
    setSearchTerm,
    setSortBy,
    setEditName,
    setEditPhone,
    startEdit,
    cancelEdit,
    resetControls,
    handleUpdate,
    handleStatusChange,
    handleDelete,
    handleCopyPhone,
  } = useCustomers();

  return (
    <section className="border-y border-gray-100 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-blue-900 dark:text-slate-100 md:text-4xl">العملاء</h2>
          <p className="mt-3 font-bold text-gray-500 dark:text-slate-400">هذه البطاقات تعرض عملاء الحساب المسجل فقط.</p>
        </div>

        {loading ? (
          <p className="text-center font-bold text-gray-500 dark:text-slate-400">جارٍ تحميل العملاء...</p>
        ) : !isSignedIn ? (
          <p className="text-center font-bold text-gray-500 dark:text-slate-400">سجّل دخولك لعرض عملائك.</p>
        ) : customers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-gray-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="font-bold text-gray-500 dark:text-slate-400">لا يوجد عملاء مرتبطون بهذا الحساب حاليًا.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'all'
                    ? 'border-blue-200 bg-blue-50 ring-4 ring-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:ring-blue-900/40'
                    : 'border-gray-100 bg-slate-50 hover:border-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800'
                }`}
              >
                <p className="text-sm font-black text-gray-500 dark:text-slate-400">إجمالي العملاء</p>
                <p className="mt-2 text-3xl font-black text-blue-900 dark:text-slate-100">{stats.all}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('new')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'new'
                    ? 'border-blue-200 bg-blue-50 ring-4 ring-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:ring-blue-900/40'
                    : 'border-blue-100 bg-blue-50 hover:border-blue-200 dark:border-blue-900/50 dark:bg-blue-950/30 dark:hover:border-blue-800'
                }`}
              >
                <p className="text-sm font-black text-blue-600 dark:text-blue-300">جديد</p>
                <p className="mt-2 text-3xl font-black text-blue-900 dark:text-slate-100">{stats.new}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('contacted')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'contacted'
                    ? 'border-amber-200 bg-amber-50 ring-4 ring-amber-100 dark:border-amber-700 dark:bg-amber-950/30 dark:ring-amber-900/40'
                    : 'border-amber-100 bg-amber-50 hover:border-amber-200 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:border-amber-700'
                }`}
              >
                <p className="text-sm font-black text-amber-600 dark:text-amber-300">تم التواصل</p>
                <p className="mt-2 text-3xl font-black text-amber-700 dark:text-slate-100">{stats.contacted}</p>
              </button>

              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`rounded-3xl border px-5 py-4 text-right shadow-sm transition ${
                  filter === 'completed'
                    ? 'border-emerald-200 bg-emerald-50 ring-4 ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:ring-emerald-900/40'
                    : 'border-emerald-100 bg-emerald-50 hover:border-emerald-200 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:hover:border-emerald-700'
                }`}
              >
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-300">مكتمل</p>
                <p className="mt-2 text-3xl font-black text-emerald-700 dark:text-slate-100">{stats.completed}</p>
              </button>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="w-full max-w-md">
                <label htmlFor="customer-search" className="mb-2 block text-sm font-black text-gray-500 dark:text-slate-400">
                  بحث
                </label>
                <input
                  id="customer-search"
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="ابحث بالاسم أو رقم الهاتف"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <label htmlFor="customer-filter" className="text-sm font-black text-gray-500 dark:text-slate-400">
                تصفية الحالة:
              </label>
              <select
                id="customer-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value as CustomerStatus | 'all')}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              >
                <option value="all">الكل</option>
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="completed">مكتمل</option>
              </select>

              <label htmlFor="customer-sort" className="text-sm font-black text-gray-500 dark:text-slate-400">
                ترتيب حسب:
              </label>
              <select
                id="customer-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'latest' | 'name' | 'status')}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
              >
                <option value="latest">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="status">الحالة</option>
              </select>
            </div>

            <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-gray-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-black text-blue-900 dark:text-slate-100">النتائج المعروضة: {visibleCustomersCount}</p>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400">يمكنك الضغط على بطاقات الإحصاء لتفعيل الفلترة بسرعة.</p>
              </div>
              {hasActiveControls ? (
                <button
                  type="button"
                  onClick={resetControls}
                  className="inline-flex items-center justify-center rounded-2xl bg-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  إعادة ضبط البحث والفلاتر
                </button>
              ) : null}
            </div>

            {feedbackMessage ? (
              <div
                className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-black ${
                  feedbackTone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300'
                }`}
              >
                {feedbackMessage}
              </div>
            ) : null}

            {sortedCustomers.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="font-bold text-gray-500 dark:text-slate-400">لا يوجد عملاء مطابقون للبحث أو الحالة المختارة.</p>
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
                      className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50 px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
                    >
                      {editingId === customer.id ? (
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(event) => setEditName(event.target.value)}
                            placeholder="اسم العميل"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                          />
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(event) => setEditPhone(event.target.value)}
                            placeholder="رقم الهاتف"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-bold text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-lg font-black text-blue-900 dark:text-slate-100">{customer.name || 'بدون اسم'}</p>
                          <p className="font-bold text-gray-500 dark:text-slate-400">{customer.phone || 'بدون هاتف'}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${statusBadgeClasses[currentStatus]}`}>
                              {statusLabels[currentStatus]}
                            </span>
                            <select
                              value={currentStatus}
                              onChange={(event) => void handleStatusChange(customer.id, event.target.value as CustomerStatus)}
                              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-black text-blue-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-900/40"
                            >
                              <option value="new">جديد</option>
                              <option value="contacted">تم التواصل</option>
                              <option value="completed">مكتمل</option>
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <p className="break-all text-xs font-black text-gray-400 dark:text-slate-500">{customer.id}</p>
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
                              className="inline-flex items-center justify-center rounded-2xl bg-gray-200 px-4 py-2 text-sm font-black text-gray-700 transition hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleCopyPhone(customer.phone)}
                              className="inline-flex items-center justify-center rounded-2xl bg-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
