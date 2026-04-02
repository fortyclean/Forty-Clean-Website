import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Package, Clock, Check, ShieldAlert } from 'lucide-react';

interface TrackedOrder {
  id: string;
  service: string;
  phone: string;
  trackingCode: string;
  status: 'new' | 'contacted' | 'completed' | string;
  timestamp: string;
}

const statusClasses: Record<string, { badge: string; chip: string }> = {
  blue: {
    badge: 'bg-blue-50 text-blue-600',
    chip: 'bg-blue-50 text-blue-700 border border-blue-100',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600',
    chip: 'bg-amber-50 text-amber-700 border border-amber-100',
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  },
  gray: {
    badge: 'bg-gray-50 text-gray-600',
    chip: 'bg-gray-50 text-gray-700 border border-gray-100',
  },
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = phone.replace(/\D/g, '');
    const normalizedTrackingCode = trackingCode.trim().toUpperCase();
    if (normalizedPhone.length < 8 || normalizedTrackingCode.length < 5 || isSearching) return;

    const now = Date.now();
    if (now - lastSearchAt < 3000) return;
    setLastSearchAt(now);

    setIsSearching(true);
    setHasSearched(true);
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
        return;
      }

      const payload = await response.json() as { orders?: TrackedOrder[] };
      setOrders(Array.isArray(payload.orders) ? payload.orders : []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'new': return { label: t('tracking.status_new'), color: 'blue', icon: Clock };
      case 'contacted': return { label: t('tracking.status_contacted'), color: 'amber', icon: ShieldAlert };
      case 'completed': return { label: t('tracking.status_completed'), color: 'emerald', icon: Check };
      default: return { label: t('tracking.status_review'), color: 'gray', icon: Clock };
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-blue-900">{t('tracking.title')}</h2>
        <p className="text-gray-500 font-bold">{t('tracking.subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="space-y-3">
          <input
            type="tel"
            placeholder={t('tracking.phone_placeholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-8 py-5 rounded-[1.5rem] bg-white border-2 border-gray-100 shadow-xl outline-none focus:border-blue-600 transition-all text-lg font-black text-center"
            maxLength={8}
            required
          />
          <input
            type="text"
            placeholder={isRTL ? 'كود التتبع (مثال: FT-AB12CD)' : 'Tracking code (e.g. FT-AB12CD)'}
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className="w-full px-8 py-5 rounded-[1.5rem] bg-white border-2 border-gray-100 shadow-xl outline-none focus:border-blue-600 transition-all text-lg font-black text-center uppercase"
            required
          />
          <button
            type="submit"
            disabled={isSearching}
            className="w-full px-8 py-4 bg-blue-600 text-white rounded-[1.2rem] font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
            {t('tracking.search_button')}
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-4 animate-fadeInUp">
          {orders.length > 0 ? (
            orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              return (
                <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${statusClasses[statusInfo.color]?.badge || statusClasses.gray.badge}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="font-black text-blue-900">{order.service === 'cleaning' ? t('nav.cleaning') : t('nav.pest')}</p>
                      <p className="text-xs text-gray-400 font-bold">{new Date(order.timestamp).toLocaleDateString(isRTL ? 'ar-KW' : 'en-US')}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${statusClasses[statusInfo.color]?.chip || statusClasses.gray.chip}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-xs font-black">{statusInfo.label}</span>
                  </div>
                </div>
              );
            })
          ) : !isSearching && (
            <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-black">{t('tracking.no_orders')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
