import { lazy, Suspense, useMemo, useState } from 'react';
import { Calculator, Sparkles, Bug, Info, MessageCircle, User, Phone, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reportAppError } from '../lib/appError';
import { useLeads } from '../hooks/useLeads';
import { calculatePrice } from '../services/priceService';
import { buildWhatsAppMessage, siteConfig } from '../config/site';
import { saveContactInteraction } from '../lib/firebase';

const BookingCalendar = lazy(() =>
  import('./BookingCalendar').then((module) => ({ default: module.BookingCalendar }))
);

const CalendarLoader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [withGuarantee, setWithGuarantee] = useState(true);

  const estimatedPrice = useMemo(() => {
    const options =
      serviceType === 'pest'
        ? { pestType, rooms, halls, bathrooms, kitchens }
        : { area, floors, bathrooms, kitchens };
    const basePrice = calculatePrice(serviceType, options);
    return (withGuarantee && serviceType === 'pest') ? basePrice + 20 : basePrice;
  }, [serviceType, rooms, halls, bathrooms, kitchens, floors, area, pestType, withGuarantee]);

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
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const conversionReporter = (window as Window & { gtag_report_conversion?: () => void }).gtag_report_conversion;
      if (typeof conversionReporter === 'function') {
        conversionReporter();
      }

      const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
      let details = '';
      const currentPestLabel = t(`calculator.pest_types.${pestType}`);

      if (serviceType === 'pest') {
        details = `${t('calculator.whatsapp_message.pest_request')} (${currentPestLabel}): ${rooms} ${t('calculator.whatsapp_message.rooms')}, ${halls} ${t('calculator.whatsapp_message.halls')}, ${bathrooms} ${t('calculator.whatsapp_message.bathrooms')}, ${kitchens} ${t('calculator.whatsapp_message.kitchens')}.`;
      } else {
        details = `${t('calculator.whatsapp_message.cleaning_request')}: ${floors} ${t('calculator.whatsapp_message.floors')}, ${t('calculator.whatsapp_message.area')} ${area}m, ${kitchens} ${t('calculator.whatsapp_message.kitchens')}, ${bathrooms} ${t('calculator.whatsapp_message.bathrooms')}.`;
      }

      if (selectedDate && selectedTime) {
        const formattedDate = selectedDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-KW' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        details += `\n- ${t('booking.whatsapp.selected_time')}: ${formattedDate} ${t('booking.whatsapp.at_time')} ${t(`calculator.booking.times.${selectedTime}`)}`;
      }

      if (serviceType === 'pest') {
        details += `\n- ${t('booking.summary.guarantee_label')}: ${withGuarantee ? t('booking.summary.guarantee_value') : (i18n.language === 'ar' ? 'بدون ضمان' : 'No Guarantee')}`;
      }

      const savedLead = await saveLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        price: estimatedPrice,
        service: serviceType,
        details,
        source: 'price_calculator',
      });

      const referenceLabel = i18n.language === 'ar' ? 'رقم الطلب' : 'Order reference';
      const text = [
        buildWhatsAppMessage({
          language: i18n.language,
          service: serviceType === 'cleaning' ? t('calculator.cleaning') : t('calculator.pest'),
          intent: 'quote',
          details: `${t('calculator.whatsapp_message.details_label')}: ${details}`,
        }),
        '',
        `*${t('calculator.estimated_price')}:* ${estimatedPrice} ${t('calculator.currency')}`,
        `*${t('booking.whatsapp.name')}:* ${formData.name.trim()}`,
        `*${t('booking.whatsapp.phone')}:* ${formData.phone.trim()}`,
        `*${referenceLabel}:* ${savedLead.trackingCode}`,
      ].join('\n');

      void saveContactInteraction({
        type: 'whatsapp',
        page: window.location.pathname,
        section: 'price-calculator',
        language: i18n.language === 'en' ? 'en' : 'ar',
        deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
        service: serviceType,
      });

      const whatsappUrl = siteConfig.links.whatsapp(whatsappNumber, text);
      
      setTimeout(() => {
        setIsSubmitting(false);
        window.location.assign(whatsappUrl);
      }, 500);
    } catch (error) {
      reportAppError({ scope: 'price-calculator-submit', error });
      setSubmitError(t('common.error_saving'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="bg-gray-light py-12 transition-colors dark:bg-slate-900 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800 md:flex-row">
            <div className="p-6 md:w-[64%] md:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="gradient-bg flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg">
                  <Calculator className="h-6 w-6" />
                </div>
                <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                  <h2 className="text-2xl font-black text-blue-dark dark:text-white">{t('calculator.title')}</h2>
                  <p className="text-sm font-medium text-gray-medium dark:text-slate-300">{t('calculator.subtitle')}</p>
                </div>
              </div>

              <div className="mb-8 flex gap-3">
                <button
                  onClick={() => setServiceType('cleaning')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-black transition-all ${
                    serviceType === 'cleaning'
                      ? 'bg-blue-medium text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>{t('calculator.cleaning')}</span>
                </button>
                <button
                  onClick={() => setServiceType('pest')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-black transition-all ${
                    serviceType === 'pest'
                      ? 'bg-blue-medium text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <Bug className="h-5 w-5" />
                  <span>{t('calculator.pest')}</span>
                </button>
              </div>

              <div className={`grid grid-cols-2 gap-5 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                {serviceType === 'cleaning' ? (
                  <>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.area')}</label>
                      <input
                        type="range"
                        min="50"
                        max="1000"
                        step="10"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-medium dark:bg-slate-700"
                      />
                      <div className="mt-2 text-center text-lg font-black text-blue-medium dark:text-blue-300">
                        {area} {t('calculator.area_unit')}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.floors')}</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={floors}
                        onChange={(e) => setFloors(Number(e.target.value))}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.kitchens')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={kitchens}
                        onChange={(e) => setKitchens(Number(e.target.value))}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.pest_type')}</label>
                      <select
                        value={pestType}
                        onChange={(e) => setPestType(e.target.value)}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      >
                        <option value="general">{t('calculator.pest_types.general')}</option>
                        <option value="termites">{t('calculator.pest_types.termites')}</option>
                        <option value="rodents">{t('calculator.pest_types.rodents')}</option>
                        <option value="bedbugs">{t('calculator.pest_types.bedbugs')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.rooms')}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={rooms}
                        onChange={(e) => setRooms(Number(e.target.value))}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.halls')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={halls}
                        onChange={(e) => setHalls(Number(e.target.value))}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.kitchens')}</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={kitchens}
                        onChange={(e) => setKitchens(Number(e.target.value))}
                        className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="col-span-2 md:col-span-1">
                  <label className="mb-2 block text-sm font-black text-blue-dark dark:text-slate-100">{t('calculator.bathrooms')}</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="form-input dark:border-slate-600 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 dark:border-slate-700 md:grid-cols-2">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-slate-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((current) => ({ ...current, name }));
                      if (submitError) setSubmitError('');
                      if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
                    }}
                    placeholder={t('contact.name')}
                    className={`form-input pl-12 dark:border-slate-600 dark:bg-slate-950 dark:text-white ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name ? (
                    <div className="mt-1 flex items-center gap-1 px-2 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>{t(`contact.errors.${errors.name}`)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-slate-300" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setFormData((current) => ({ ...current, phone }));
                      if (submitError) setSubmitError('');
                      if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
                    }}
                    placeholder={t('contact.phone')}
                    className={`form-input pl-12 dark:border-slate-600 dark:bg-slate-950 dark:text-white ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone ? (
                    <div className="mt-1 flex items-center gap-1 px-2 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>{t(`contact.errors.${errors.phone}`)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-gray-100 bg-blue-dark p-6 text-white dark:border-slate-700 dark:bg-slate-900 md:w-[36%] md:border-r md:border-t-0 md:p-8">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/8 to-transparent dark:from-blue-400/8" />
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-blue-100 dark:text-slate-200">
                  {t('calculator.estimated_price')}
                </div>

                <div className="mb-2 text-5xl font-black text-white md:text-6xl">
                  {estimatedPrice}
                  <span className="mr-2 text-xl font-bold text-blue-100 dark:text-slate-200">{t('calculator.currency')}</span>
                </div>

                {serviceType === 'pest' && (
                  <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <input
                      type="checkbox"
                      id="calc-guarantee-toggle"
                      checked={withGuarantee}
                      onChange={(e) => setWithGuarantee(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="calc-guarantee-toggle" className="cursor-pointer text-sm font-bold text-blue-100">
                      {t('booking.summary.guarantee_toggle')}
                    </label>
                  </div>
                )}

                <p className="mx-auto mb-6 max-w-[260px] text-sm font-medium leading-7 text-slate-200 dark:text-slate-300">
                  {t('calculator.disclaimer')}
                </p>

                <button
                  onClick={onSubmit}
                  disabled={isSubmitting}
                  className="relative z-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 font-black text-blue-dark shadow-xl transition-all hover:bg-cyan-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-cyan-300 dark:hover:text-slate-950"
                >
                  <span>{isSubmitting ? (i18n.language === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : t('calculator.book_now')}</span>
                  <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                </button>

                {submitError ? (
                  <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center dark:border-red-900/40 dark:bg-red-950/30">
                    <p className="text-sm font-bold text-red-600 dark:text-red-300">{submitError}</p>
                  </div>
                ) : null}

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm font-medium leading-6 text-slate-200 dark:text-slate-300">
                  <div className="mb-2 flex items-center gap-2 text-blue-100 dark:text-slate-100">
                    <Info className="h-4 w-4 text-cyan-300" />
                    <span className="font-black">{i18n.language === 'ar' ? 'ملاحظة مهمة' : 'Important note'}</span>
                  </div>
                  <p>{t('calculator.note')}</p>
                </div>
              </div>

              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/5 dark:bg-blue-500/10" />
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="p-6 md:p-8">
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

          <div
            className={`mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-medium dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-slate-300 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-medium dark:text-blue-400" />
            <p>{t('calculator.note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
