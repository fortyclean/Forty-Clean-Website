import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package, Clock, Check, ShieldAlert } from 'lucide-react';
import { getUserFacingErrorMessage, reportAppError } from '@/lib/appError';
import { siteConfig } from '@/config/site';

interface TrackedOrder {
  id: string;
  service: string;
  trackingCode: string;
  status: 'new' | 'contacted' | 'completed' | string;
  timestamp: string;
}

type TimelineStep = {
  key: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
};

const statusClasses: Record<string, { badge: string; chip: string }> = {
  blue: {
    badge: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
    chip: 'border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
    chip: 'border border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    chip: 'border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  },
  gray: {
    badge: 'bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-slate-300',
    chip: 'border border-gray-100 bg-gray-50 text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
};

const getTrackingTimeline = (status: string, isRTL: boolean): TimelineStep[] => {
  const currentStage = status === 'completed' ? 3 : status === 'contacted' ? 2 : status === 'review' ? 1 : 0;

  const steps = isRTL
    ? [
        {
          key: 'received',
          label: 'تم استلام الطلب',
          description: 'وصل طلبك إلى النظام وتم تسجيله بنجاح.',
        },
        {
          key: 'review',
          label: 'جارٍ المراجعة',
          description: 'نراجع التفاصيل ونجهز الطلب للتواصل والتأكيد.',
        },
        {
          key: 'contacted',
          label: 'تم التواصل',
          description: 'قام الفريق أو خدمة العملاء ببدء التواصل معك.',
        },
        {
          key: 'completed',
          label: 'اكتملت الخدمة',
          description: 'تم تنفيذ الطلب أو إغلاقه بنجاح.',
        },
      ]
    : [
        {
          key: 'received',
          label: 'Request Received',
          description: 'Your request reached the system and was logged successfully.',
        },
        {
          key: 'review',
          label: 'Under Review',
          description: 'We are reviewing the details and preparing the request for confirmation.',
        },
        {
          key: 'contacted',
          label: 'Contacted',
          description: 'Our team has started contacting you to confirm the request.',
        },
        {
          key: 'completed',
          label: 'Completed',
          description: 'The service was completed or the request was closed successfully.',
        },
      ];

  return steps.map((step, index) => ({
    ...step,
    completed: index < currentStage,
    current: index === currentStage,
  }));
};

const OrderTracking = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [phone, setPhone] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchAt, setLastSearchAt] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const getTrackingErrorMessage = (status: number) => {
    if (isRTL) {
      switch (status) {
        case 400:
          return 'تحقق من رقم الهاتف وكود التتبع ثم حاول مرة أخرى.';
        case 429:
          return 'أجريت محاولات كثيرة خلال وقت قصير. انتظر قليلًا ثم أعد المحاولة.';
        default:
          return 'تعذر الوصول إلى حالة الطلب حاليًا. حاول مرة أخرى بعد قليل.';
      }
    }

    switch (status) {
      case 400:
        return 'Please check the phone number and tracking code, then try again.';
      case 429:
        return 'Too many attempts in a short time. Please wait a little and try again.';
      default:
        return 'We could not load your order status right now. Please try again shortly.';
    }
  };

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = phone.replace(/\D/g, '');
    const normalizedTrackingCode = trackingCode.trim().toUpperCase();

    if (normalizedPhone.length < 8 || normalizedTrackingCode.length < 5 || isSearching) {
      setErrorMessage(isRTL ? 'أدخل رقم هاتف صالحًا وكود تتبع صحيحًا.' : 'Enter a valid phone number and tracking code.');
      return;
    }

    const now = Date.now();
    if (now - lastSearchAt < 3000) {
      return;
    }

    setLastSearchAt(now);
    setIsSearching(true);
    setHasSearched(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/order-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          trackingCode: normalizedTrackingCode,
        }),
      });

      if (!response.ok) {
        setOrders([]);
        setErrorMessage(getTrackingErrorMessage(response.status));
        return;
      }

      const payload = (await response.json()) as { orders?: TrackedOrder[] };
      setOrders(Array.isArray(payload.orders) ? payload.orders : []);
      setErrorMessage('');
    } catch (error) {
      reportAppError({ scope: 'order-tracking-search', error });
      setOrders([]);
      setErrorMessage(
        getUserFacingErrorMessage(error, {
          fallback: isRTL ? 'تعذر تنفيذ البحث حاليًا. حاول مرة أخرى بعد قليل.' : 'We could not complete the search right now. Please try again shortly.',
          network: isRTL ? 'حدث خطأ في الاتصال أثناء البحث. حاول مرة أخرى.' : 'A network error occurred while searching. Please try again.',
        })
      );
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new':
        return { label: t('tracking.status_new'), color: 'blue', icon: Clock };
      case 'review':
        return { label: t('tracking.status_review'), color: 'gray', icon: Clock };
      case 'contacted':
        return { label: t('tracking.status_contacted'), color: 'amber', icon: ShieldAlert };
      case 'completed':
        return { label: t('tracking.status_completed'), color: 'emerald', icon: Check };
      default:
        return { label: t('tracking.status_review'), color: 'gray', icon: Clock };
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-black text-blue-900 dark:text-slate-100">{t('tracking.title')}</h2>
        <p className="font-bold text-gray-500 dark:text-slate-400">{t('tracking.subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="group relative">
        <div className="space-y-3">
          <input
            type="tel"
            placeholder={t('tracking.phone_placeholder')}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError();
            }}
            className="w-full rounded-[1.5rem] border-2 border-gray-100 bg-white px-8 py-5 text-center text-lg font-black shadow-xl outline-none transition-all focus:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            maxLength={8}
            required
          />
          <input
            type="text"
            placeholder={isRTL ? 'كود التتبع (مثال: FT-AB12CD)' : 'Tracking code (e.g. FT-AB12CD)'}
            value={trackingCode}
            onChange={(e) => {
              setTrackingCode(e.target.value);
              clearError();
            }}
            className="w-full rounded-[1.5rem] border-2 border-gray-100 bg-white px-8 py-5 text-center text-lg font-black uppercase shadow-xl outline-none transition-all focus:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            required
          />
          <button
            type="submit"
            disabled={isSearching}
            className="flex w-full items-center justify-center gap-2 rounded-[1.2rem] bg-blue-600 px-8 py-4 font-black text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Search className="h-5 w-5" />}
            {t('tracking.search_button')}
          </button>
        </div>
      </form>

      {errorMessage ? (
        <div className="rounded-[1.5rem] border border-red-100 bg-red-50 px-6 py-4 text-center dark:border-red-900/40 dark:bg-red-950/30">
          <p className="font-black text-red-600 dark:text-red-300">{errorMessage}</p>
        </div>
      ) : null}

      {hasSearched && (
        <div className="animate-fadeInUp space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const timeline = getTrackingTimeline(order.status, isRTL);
              const normalizedDate = order.timestamp ? new Date(order.timestamp) : null;
              const formattedDate = normalizedDate && !Number.isNaN(normalizedDate.getTime())
                ? normalizedDate.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : (isRTL ? 'غير متوفر حاليًا' : 'Not available yet');
              const currentTimelineStep = timeline.find((step) => step.current) ?? timeline[0];
              const whatsappMessage = isRTL
                ? `مرحبًا فورتي، أحتاج تحديثًا على طلبي. كود التتبع: ${order.trackingCode}`
                : `Hello Forty, I need an update on my order. Tracking code: ${order.trackingCode}`;
              const whatsappPhone = order.service === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;

              return (
                <div key={order.id} className="space-y-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${statusClasses[statusInfo.color]?.badge || statusClasses.gray.badge}`}>
                        <Package className="h-6 w-6" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="font-black text-blue-900 dark:text-slate-100">{order.service === 'cleaning' ? t('nav.cleaning') : t('nav.pest')}</p>
                        <p className="text-xs font-bold text-gray-400 dark:text-slate-500">{formattedDate}</p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${statusClasses[statusInfo.color]?.chip || statusClasses.gray.chip}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-xs font-black">{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                      <p className="text-xs font-black uppercase tracking-wider text-blue-500 dark:text-blue-300">
                        {isRTL ? 'كود التتبع' : 'Tracking Code'}
                      </p>
                      <p className="mt-2 text-2xl font-black text-blue-900 dark:text-slate-100">{order.trackingCode}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        {isRTL ? 'الحالة الحالية' : 'Current Update'}
                      </p>
                      <p className="mt-2 text-lg font-black text-blue-900 dark:text-slate-100">{currentTimelineStep.label}</p>
                      <p className="mt-1 text-sm font-bold text-gray-500 dark:text-slate-400">{currentTimelineStep.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className={`text-sm font-black text-blue-900 dark:text-slate-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {isRTL ? 'مراحل الطلب' : 'Order Timeline'}
                    </p>
                    <div className="grid gap-3">
                      {timeline.map((step, index) => (
                        <div
                          key={step.key}
                          className={`flex items-start gap-3 rounded-[1.25rem] border px-4 py-3 ${
                            step.current
                              ? 'border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30'
                              : step.completed
                                ? 'border-emerald-100 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                                : 'border-gray-100 bg-gray-50 dark:border-slate-700 dark:bg-slate-800'
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                              step.current
                                ? 'bg-blue-600 text-white'
                                : step.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-gray-200 bg-white text-gray-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                            }`}
                          >
                            {step.completed ? <Check className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className={isRTL ? 'text-right' : 'text-left'}>
                            <p className="font-black text-blue-900 dark:text-slate-100">{step.label}</p>
                            <p className="text-sm font-bold text-gray-500 dark:text-slate-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <a
                      href={siteConfig.links.whatsapp(whatsappPhone, whatsappMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-[1.25rem] bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
                    >
                      {isRTL ? 'اطلب تحديثًا عبر واتساب' : 'Request an update on WhatsApp'}
                    </a>
                  </div>
                </div>
              );
            })
          ) : !isSearching && !errorMessage ? (
            <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="font-black text-gray-400 dark:text-slate-500">{t('tracking.no_orders')}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
