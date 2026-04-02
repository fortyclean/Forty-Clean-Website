import { useCallback, useEffect, useMemo, useState } from 'react';
import { reportAppError } from '../lib/appError';
import { getCustomers, getDb, getFirebaseAuth } from '../lib/firebase';

export type CustomerStatus = 'new' | 'contacted' | 'completed';
export type CustomerFilter = 'all' | CustomerStatus;
export type SortOption = 'latest' | 'name' | 'status';
export type FeedbackTone = 'success' | 'error';

export type Customer = {
  id: string;
  name?: string;
  phone?: string;
  status?: CustomerStatus;
  createdAt?: unknown;
  userId?: string;
};

export const statusLabels: Record<CustomerStatus, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  completed: 'مكتمل',
};

export const statusBadgeClasses: Record<CustomerStatus, string> = {
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

const readPersistedFilter = (): CustomerFilter => {
  if (typeof window === 'undefined') {
    return 'all';
  }

  const savedFilter = window.localStorage.getItem(CUSTOMER_FILTER_STORAGE_KEY);
  return savedFilter === 'new' || savedFilter === 'contacted' || savedFilter === 'completed' || savedFilter === 'all'
    ? savedFilter
    : 'all';
};

const readPersistedSearch = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(CUSTOMER_SEARCH_STORAGE_KEY) || '';
};

const readPersistedSort = (): SortOption => {
  if (typeof window === 'undefined') {
    return 'latest';
  }

  const savedSort = window.localStorage.getItem(CUSTOMER_SORT_STORAGE_KEY);
  return savedSort === 'name' || savedSort === 'status' || savedSort === 'latest' ? savedSort : 'latest';
};

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>('success');
  const [filter, setFilter] = useState<CustomerFilter>(readPersistedFilter);
  const [searchTerm, setSearchTerm] = useState(readPersistedSearch);
  const [sortBy, setSortBy] = useState<SortOption>(readPersistedSort);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const showFeedback = useCallback((message: string, tone: FeedbackTone) => {
    setFeedbackMessage(message);
    setFeedbackTone(tone);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await getCustomers();
      setCustomers(data as Customer[]);
    } catch (error) {
      reportAppError({ scope: 'customers-load', error });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const handleCustomersChanged = () => {
      if (!isMounted) {
        return;
      }

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
  }, [loadCustomers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CUSTOMER_FILTER_STORAGE_KEY, filter);
    }
  }, [filter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CUSTOMER_SEARCH_STORAGE_KEY, searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CUSTOMER_SORT_STORAGE_KEY, sortBy);
    }
  }, [sortBy]);

  const startEdit = useCallback((customer: Customer) => {
    setEditingId(customer.id);
    setEditName(customer.name || '');
    setEditPhone(customer.phone || '');
    setFeedbackMessage('');
  }, []);

  const resetControls = useCallback(() => {
    setFilter('all');
    setSearchTerm('');
    setSortBy('latest');
    setFeedbackMessage('');
  }, []);

  const handleUpdate = useCallback(async (id: string) => {
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
      reportAppError({ scope: 'customers-update', error });
      showFeedback('تعذر تحديث بيانات العميل حاليًا.', 'error');
    }
  }, [cancelEdit, editName, editPhone, showFeedback]);

  const handleStatusChange = useCallback(async (id: string, status: CustomerStatus) => {
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
      reportAppError({ scope: 'customers-status', error });
      showFeedback('تعذر تحديث حالة العميل.', 'error');
    }
  }, [showFeedback]);

  const handleDelete = useCallback(async (id: string) => {
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
      reportAppError({ scope: 'customers-delete', error });
      showFeedback('تعذر حذف العميل حاليًا.', 'error');
    } finally {
      setDeletingId(null);
    }
  }, [cancelEdit, editingId, showFeedback]);

  const handleCopyPhone = useCallback(async (phone?: string) => {
    if (!phone) {
      showFeedback('لا يوجد رقم هاتف لنسخه.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      showFeedback('تم نسخ رقم الهاتف.', 'success');
    } catch (error) {
      reportAppError({ scope: 'customers-copy-phone', error });
      showFeedback('تعذر نسخ رقم الهاتف.', 'error');
    }
  }, [showFeedback]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesFilter = filter === 'all' ? true : (customer.status || 'new') === filter;
      const matchesSearch =
        normalizedSearch === ''
          ? true
          : (customer.name || '').toLowerCase().includes(normalizedSearch) ||
            (customer.phone || '').toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [customers, filter, normalizedSearch]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
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
  }, [filteredCustomers, sortBy]);

  const stats = useMemo(() => ({
    all: customers.length,
    new: customers.filter((customer) => (customer.status || 'new') === 'new').length,
    contacted: customers.filter((customer) => customer.status === 'contacted').length,
    completed: customers.filter((customer) => customer.status === 'completed').length,
  }), [customers]);

  return {
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
    hasActiveControls: filter !== 'all' || searchTerm.trim() !== '' || sortBy !== 'latest',
    visibleCustomersCount: sortedCustomers.length,
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
  };
};
