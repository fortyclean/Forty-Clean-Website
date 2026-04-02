import { lazy, Suspense, useMemo, useState } from 'react';
import { Calculator, Sparkles, Bug, Info, MessageCircle, User, Phone, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLeads } from '../hooks/useLeads';
import { calculatePrice } from '../services/priceService';
import { siteConfig } from '../config/site';

const BookingCalendar = lazy(() =>
  import('./BookingCalendar').then((module) => ({ default: module.BookingCalendar }))
);

const CalendarLoader = () => (
  <div className="py-10 flex justify-center">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const kuwaitPhoneRegex = /^[2569]\d{7}$/;

type CalculatorFormData = {
  name: string;
  phone: string;
};

type CalculatorErrors = Partial<Record<keyof CalculatorFormData, 'name_min' | 'invalid_phone'>>;

interface PriceCalculatorProps {
  initialType?: 'cleaning' | 'pest';
}

const PriceCalculator = ({ initialType = 'cleaning' }: PriceCalculatorProps) => {
  const { t, i18n } = useTranslation();
  const { saveLead } = useLeads({ subscribe: false });
  const [formData, setFormData] = useState<CalculatorFormData>({ name: '', phone: '' });
  const [errors, setErrors] = useState<CalculatorErrors>({});
  const [serviceType, setServiceType] = useState<'cleaning' | 'pest'>(initialType);
  const [rooms, setRooms] = useState(1);
  const [halls, setHalls] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [kitchens, setKitchens] = useState(1);
  const [floors, setFloors] = useState(1);
  const [area, setArea] = useState(100);
  const [pestType, setPestType] = useState('general');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');

  const estimatedPrice = useMemo(() => {
    const options = serviceType === 'pest'
      ? { pestType, rooms, halls, bathrooms }
      : { area, floors, bathrooms, kitchens };
    return calculatePrice(serviceType, options);
  }, [serviceType, rooms, halls, bathrooms, kitchens, floors, area, pestType]);

  const validateForm = () => {
    const nextErrors: CalculatorErrors = {};

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'name_min';
    }

    if (!kuwaitPhoneRegex.test(formData.phone.trim())) {
      nextErrors.phone = 'invalid_phone';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    const conversionReporter = (window as Window & { gtag_report_conversion?: () => void }).gtag_report_conversion;
    if (typeof conversionReporter === 'function') {
      conversionReporter();
    }

    const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
    let details = '';
    const currentPestLabel = t(`calculator.pest_types.${pestType}`);

    if (serviceType === 'pest') {
      details = `${t('calculator.whatsapp_message.pest_request')} (${currentPestLabel}): ${rooms} ${t('calculator.whatsapp_message.rooms')}, ${halls} ${t('calculator.whatsapp_message.halls')}, ${bathrooms} ${t('calculator.whatsapp_message.bathrooms')}.`;
    } else {
      details = `${t('calculator.whatsapp_message.cleaning_request')}: ${floors} ${t('calculator.whatsapp_message.floors')}, ${t('calculator.whatsapp_message.area')} ${area}m, ${kitchens} ${t('calculator.whatsapp_message.kitchens')}, ${bathrooms} ${t('calculator.whatsapp_message.bathrooms')}.`;
    }

    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-KW' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      details += `\n- ${t('booking.whatsapp.selected_time')}: ${formattedDate} ${t('booking.whatsapp.at_time')} ${t(`calculator.booking.times.${selectedTime}`)}`;
    }

    const savedLead = await saveLead({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      price: estimatedPrice,
      service: serviceType,
      details,
      source: 'price_calculator'
    });

    const text = `${t('calculator.whatsapp_message.intro')} (${estimatedPrice} ${t('calculator.currency')}).\n\n*${t('calculator.whatsapp_message.details_label')}:*\n${details}\n\n*${t('booking.whatsapp.name')}:* ${formData.name.trim()}\n*${t('booking.whatsapp.phone')}:* ${formData.phone.trim()}\n*${t('tracking.title')}:* ${savedLead.trackingCode}`;
    window.open(siteConfig.links.whatsapp(whatsappNumber, text), '_blank');
  };

  return (
    <section id="calculator" className="py-20 bg-gray-light dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-slate-700">
            <div className="p-8 md:w-2/3">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h2 className="text-2xl font-bold text-blue-dark dark:text-white">{t('calculator.title')}</h2>
                  <p className="text-gray-medium dark:text-slate-400 text-sm">{t('calculator.subtitle')}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setServiceType('cleaning')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    serviceType === 'cleaning'
                    ? 'bg-blue-medium text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('calculator.cleaning')}</span>
                </button>
                <button
                  onClick={() => setServiceType('pest')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    serviceType === 'pest'
                    ? 'bg-blue-medium text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Bug className="w-5 h-5" />
                  <span>{t('calculator.pest')}</span>
                </button>
              </div>

              <div className={`grid grid-cols-2 gap-6 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                {serviceType === 'cleaning' ? (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.area')}</label>
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="10"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-medium"
                      />
                      <div className="text-center font-bold text-blue-medium dark:text-blue-400 mt-2">{area} {t('calculator.area_unit')}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.floors')}</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={floors}
                        onChange={(e) => setFloors(Number(e.target.value))}
                        className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.kitchens')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={kitchens}
                        onChange={(e) => setKitchens(Number(e.target.value))}
                        className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.pest_type')}</label>
                      <select
                        value={pestType}
                        onChange={(e) => setPestType(e.target.value)}
                        className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      >
                        <option value="general">{t('calculator.pest_types.general')}</option>
                        <option value="termites">{t('calculator.pest_types.termites')}</option>
                        <option value="rodents">{t('calculator.pest_types.rodents')}</option>
                        <option value="bedbugs">{t('calculator.pest_types.bedbugs')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.rooms')}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={rooms}
                        onChange={(e) => setRooms(Number(e.target.value))}
                        className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.halls')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={halls}
                        onChange={(e) => setHalls(Number(e.target.value))}
                        className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                      />
                    </div>
                  </>
                )}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-blue-dark dark:text-slate-300 mb-2">{t('calculator.bathrooms')}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="form-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((current) => ({ ...current, name }));
                      if (errors.name) {
                        setErrors((current) => ({ ...current, name: undefined }));
                      }
                    }}
                    placeholder={t('contact.name')}
                    className={`form-input pl-12 dark:bg-slate-900 dark:border-slate-700 dark:text-white ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs px-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>{t(`contact.errors.${errors.name}`)}</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setFormData((current) => ({ ...current, phone }));
                      if (errors.phone) {
                        setErrors((current) => ({ ...current, phone: undefined }));
                      }
                    }}
                    placeholder={t('contact.phone')}
                    className={`form-input pl-12 dark:bg-slate-900 dark:border-slate-700 dark:text-white ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs px-2">
                      <AlertCircle className="w-3 h-3" />
                      <span>{t(`contact.errors.${errors.phone}`)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-dark dark:bg-slate-900 p-8 md:w-1/3 text-white flex flex-col justify-center relative overflow-hidden border-l border-gray-100 dark:border-slate-700">
              <div className="relative z-10 text-center">
                <h3 className="text-lg font-medium opacity-80 mb-2">{t('calculator.estimated_price')}</h3>
                <div className="text-4xl font-black text-white mb-1">
                  {estimatedPrice} <span className="text-lg font-bold">{t('calculator.currency')}</span>
                </div>
                <p className="text-white/60 text-[10px] md:text-xs font-medium max-w-[200px] mx-auto leading-tight mb-8">
                  {t('calculator.disclaimer')}
                </p>

                <button
                  onClick={onSubmit}
                  className="w-full bg-white text-blue-dark py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-cyan-brand hover:text-white transition-all shadow-xl group relative z-10"
                >
                  <span>{t('calculator.book_now')}</span>
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 opacity-60 relative z-10">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px]">{t('calculator.note')}</span>
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5"></div>
            </div>
          </div>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="p-8">
              <Suspense fallback={<CalendarLoader />}>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </Suspense>
            </div>
          </div>

          <div className={`mt-6 flex items-start gap-3 text-gray-medium dark:text-slate-400 text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <Info className="w-5 h-5 text-blue-medium dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p>{t('calculator.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
