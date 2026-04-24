import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  Sparkles,
  Bug,
  Calendar as CalendarIcon,
  User,
  ShieldCheck,
  Star,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { reportAppError } from '@/lib/appError';
import { Button } from './ui/button';
import { calculatePrice } from '../services/priceService';
import { useLeads } from '../hooks/useLeads';
import { useStore } from '../lib/store';
import { siteConfig } from '../config/site';
import { submitBooking } from '../services/bookingService';

const BookingCalendar = lazy(() =>
  import('./BookingCalendar').then((module) => ({ default: module.BookingCalendar }))
);

const CalendarLoader = () => (
  <div className="py-10 flex justify-center">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const BookingStepper = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const { saveLead } = useLeads({ subscribe: false });
  const { user, setUser, addToCart } = useStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [serviceType, setServiceType] = useState<'cleaning' | 'pest' | null>(null);
  const [details, setDetails] = useState({
    rooms: 1,
    halls: 1,
    bathrooms: 1,
    kitchens: 1,
    floors: 1,
    area: 100,
    pestType: 'general'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingReference, setBookingReference] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [withGuarantee, setWithGuarantee] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const price = useMemo(() => {
    if (!serviceType) return 0;
    const options = serviceType === 'pest'
      ? { pestType: details.pestType, rooms: details.rooms, halls: details.halls, bathrooms: details.bathrooms, kitchens: details.kitchens }
      : { area: details.area, floors: details.floors, bathrooms: details.bathrooms, kitchens: details.kitchens };
    const basePrice = calculatePrice(serviceType, options);
    return (withGuarantee && serviceType === 'pest') ? basePrice + 20 : basePrice;
  }, [serviceType, details, withGuarantee]);

  const handleBooking = async () => {
    try {
      if (!serviceType) {
        return;
      }

      setSubmitError('');

      const trackingCode = await submitBooking({
        serviceType,
        details,
        selectedDate,
        selectedTime,
        isRTL,
        price,
        userInfo,
        saveLead,
        setUser,
        currentUserId: user?.id,
        addToCart,
        t,
      });

      setBookingReference(trackingCode);
      
      // WhatsApp Redirection
      const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
      const referenceLabel = isRTL ? 'رقم الطلب' : 'Order reference';
      
      const bookingDate = selectedDate
        ? selectedDate.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';

      const detailsText = serviceType === 'cleaning'
        ? (isRTL 
            ? `تنظيف شامل: ${details.floors} أدوار، مساحة تقريبية ${details.area} م2، ${details.kitchens} مطابخ، ${details.bathrooms} حمامات.`
            : `Full cleaning: ${details.floors} floors, approx. area ${details.area} m2, ${details.kitchens} kitchens, ${details.bathrooms} bathrooms.`)
        : (isRTL
            ? `مكافحة حشرات (${t(`calculator.pest_types.${details.pestType}`)}): ${details.rooms} غرف، ${details.halls} صالات، ${details.kitchens} مطابخ، ${details.bathrooms} حمامات.`
            : `Pest control (${t(`calculator.pest_types.${details.pestType}`)}): ${details.rooms} rooms, ${details.halls} halls, ${details.kitchens} kitchens, ${details.bathrooms} bathrooms.`);

      const fullDetails = [
        detailsText,
        bookingDate ? `${t('booking.whatsapp.selected_time')}: ${bookingDate}` : '',
        selectedTime ? `${t('booking.whatsapp.at_time')} ${t(`calculator.booking.times.${selectedTime}`)}` : '',
        serviceType === 'pest' ? `${t('booking.summary.guarantee_label')}: ${withGuarantee ? t('booking.summary.guarantee_value') : (isRTL ? 'بدون ضمان' : 'No Guarantee')}` : '',
        `${isRTL ? 'العنوان' : 'Address'}: ${userInfo.address.trim()}`
      ].filter(Boolean).join('\n');

      const whatsappText = `${t('calculator.whatsapp_message.intro')} (${price} ${t('calculator.currency')}).\n\n*${t('calculator.whatsapp_message.details_label')}:*\n${fullDetails}\n\n*${t('booking.whatsapp.name')}:* ${userInfo.name.trim()}\n*${t('booking.whatsapp.phone')}:* ${userInfo.phone.trim()}\n*${referenceLabel}:* ${trackingCode}`;
      
      const whatsappUrl = siteConfig.links.whatsapp(whatsappNumber, whatsappText);
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

      setCurrentStep(3);
    } catch (error) {
      reportAppError({ scope: 'booking-submit', error });
      setSubmitError(t('common.error_saving'));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return serviceType !== null;
      case 1:
        return selectedDate !== undefined && selectedTime !== '';
      case 2:
        return userInfo.name.length >= 2 && /^[2569]\d{7}$/.test(userInfo.phone) && userInfo.address.length > 5;
      default:
        return false;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8 md:mb-12">
        <div className="flex justify-between items-center max-w-md mx-auto relative">
          {[
            { id: 'service', title: t('booking.steps.service'), icon: Sparkles },
            { id: 'datetime', title: t('booking.steps.datetime'), icon: CalendarIcon },
            { id: 'info', title: t('booking.steps.info'), icon: User },
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 md:h-14 md:w-14 md:rounded-2xl",
                  isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300",
                  isCurrent && "ring-4 ring-blue-100 dark:ring-blue-900/40 scale-110"
                )}>
                  {isActive && index < currentStep ? <Check className="h-6 w-6 md:h-7 md:w-7" /> : <Icon className="h-6 w-6 md:h-7 md:w-7" />}
                </div>
                <span className={cn(
                  "mt-2 text-xs font-black transition-colors duration-500 md:mt-3 md:text-sm",
                  isActive ? "text-blue-900 dark:text-slate-100" : "text-gray-500 dark:text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
          <div className="absolute left-0 right-0 top-7 mx-auto h-1 w-[80%] bg-gray-100 dark:bg-slate-800 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-8 md:p-12">
          {currentStep === 0 && (
            <div key="step0" className="space-y-6 md:space-y-10 animate-fadeInUp">
              <div className="space-y-2 text-center md:space-y-4">
                <h2 className="text-2xl font-black text-blue-900 dark:text-white md:text-4xl">{t('booking.titles.select_service')}</h2>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 md:text-xl">{t('booking.titles.select_subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-8">
                {[
                  { id: 'cleaning', title: t('booking.services.cleaning'), icon: Sparkles, price: `${t('booking.services.price_from')} 110 ${t('calculator.currency')}` },
                  { id: 'pest', title: t('booking.services.pest'), icon: Bug, price: `${t('booking.services.price_from')} 25 ${t('calculator.currency')}` }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setServiceType(s.id as 'cleaning' | 'pest');
                      setCurrentStep(1);
                    }}
                    className={cn(
                      "relative overflow-hidden rounded-[1.6rem] border-2 p-4 text-right transition-all group md:rounded-[3rem] md:border-4 md:p-10",
                      serviceType === s.id
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-2xl scale-[1.02]"
                        : "border-gray-50 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 shadow-lg"
                    )}
                  >
                    <div className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-lg md:mb-8 md:h-20 md:w-20 md:rounded-[2rem]",
                      serviceType === s.id ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-700 text-blue-600 group-hover:scale-110"
                    )}>
                      <s.icon className="h-6 w-6 md:h-10 md:w-10" />
                    </div>
                    <h3 className="mb-2 text-lg font-black leading-7 text-blue-900 dark:text-white md:mb-3 md:text-3xl">{s.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 md:text-xl">{s.price}</span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400 md:h-12 md:w-12">
                        <ChevronLeft className={cn("h-5 w-5 md:h-6 md:w-6", !isRTL && "rotate-180")} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div key="step1" className={`space-y-6 md:space-y-10 ${isRTL ? 'animate-slideInLeft' : 'animate-slideInRight'}`}>
              <div className="space-y-2 text-center md:space-y-4">
                <h2 className="text-2xl font-black text-blue-900 dark:text-white md:text-4xl">{t('booking.titles.details_title')}</h2>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 md:text-xl">{t('booking.titles.details_subtitle')}</p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
                <div className="space-y-6 lg:col-span-2 lg:space-y-10">
                  <Suspense fallback={<CalendarLoader />}>
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                    />
                  </Suspense>

                  <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-5 dark:border-slate-700 dark:bg-slate-900/50 md:rounded-[2.5rem] md:p-8">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-black text-blue-900 dark:text-white md:mb-6 md:text-xl">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                      {t('booking.summary.customize')}
                    </h4>
                    {serviceType === 'cleaning' ? (
                      <div className="space-y-6">
                        <label className="text-blue-900 dark:text-slate-300 font-bold block">{t('booking.summary.approx_area')} ({details.area} {t('calculator.area_unit')})</label>
                        <input
                          type="range"
                          min="50"
                          max="1000"
                          step="50"
                          value={details.area}
                          onChange={(e) => setDetails({ ...details, area: parseInt(e.target.value) })}
                          className="w-full h-3 bg-white dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                        {['general', 'termites', 'rodents', 'bedbugs'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setDetails({ ...details, pestType: type })}
                            className={cn(
                              "rounded-xl border-2 p-3 text-center text-xs font-black transition-all md:rounded-2xl md:p-4 md:text-sm",
                              details.pestType === type
                                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                                : "bg-white text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 border-gray-100 hover:border-blue-100 dark:hover:border-blue-900"
                            )}
                          >
                            {t(`calculator.pest_types.${type}`)}
                          </button>
                        ))}
                        <div className="col-span-2 grid grid-cols-2 gap-3 pt-3">
                          <div>
                            <label className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">{t('calculator.kitchens')}</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={details.kitchens}
                              onChange={(e) => setDetails({ ...details, kitchens: Number(e.target.value) })}
                              className="form-input dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-black text-blue-900 dark:text-slate-200">{t('calculator.bathrooms')}</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={details.bathrooms}
                              onChange={(e) => setDetails({ ...details, bathrooms: Number(e.target.value) })}
                              className="form-input dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-900 dark:bg-slate-900 rounded-[3rem] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden border border-blue-800 dark:border-slate-700">
                  <div className="absolute top-0 right-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-blue-800/60 dark:bg-slate-700/70 md:h-32 md:w-32 md:-translate-y-16 md:translate-x-16" />
                  <div>
                    <h3 className="mb-5 flex items-center gap-3 text-xl font-black opacity-90 md:mb-8 md:text-2xl">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 md:h-6 md:w-6" />
                      {t('booking.summary.title')}
                    </h3>
                    <div className="mb-8 space-y-3 md:mb-10 md:space-y-4">
                      <div className="flex justify-between text-blue-100 dark:text-slate-300 font-bold">
                        <span>{t('booking.summary.service_label')}</span>
                        <span>{serviceType === 'cleaning' ? t('booking.whatsapp.cleaning') : t('booking.whatsapp.pest')}</span>
                      </div>
                      {serviceType === 'pest' && (
                        <div className="flex justify-between text-blue-100 dark:text-slate-300 font-bold">
                          <span>{t('booking.summary.guarantee_label')}</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="guarantee-toggle"
                              checked={withGuarantee}
                              onChange={(e) => setWithGuarantee(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="guarantee-toggle" className="cursor-pointer">
                              {withGuarantee ? t('booking.summary.guarantee_value') : (isRTL ? 'بدون ضمان' : 'No Guarantee')}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-blue-800 pt-6 dark:border-slate-700 md:pt-8">
                      <span className="text-blue-200 dark:text-slate-400 font-bold block mb-2">{t('booking.summary.estimated_price')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black md:text-7xl">{price}</span>
                        <span className="text-2xl font-bold text-blue-100 dark:text-slate-200 md:text-3xl">{t('calculator.currency')}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedDate || !selectedTime}
                    className="flex h-auto w-full flex-col items-center justify-center gap-2 rounded-[1.6rem] bg-white px-5 py-6 text-center text-lg font-black leading-tight text-blue-900 shadow-xl transition-all active:scale-95 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 md:rounded-[2rem] md:py-8 md:text-2xl"
                  >
                    <span>{t('booking.summary.confirm_date')}</span>
                    <ChevronLeft className={cn("h-6 w-6 md:h-7 md:w-7", !isRTL && "rotate-180")} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div key="step2" className={`space-y-6 md:space-y-10 ${isRTL ? 'animate-slideInLeft' : 'animate-slideInRight'}`}>
              <div className="space-y-2 text-center md:space-y-4">
                <h2 className="text-2xl font-black text-blue-900 dark:text-white md:text-4xl">{t('booking.titles.contact_title')}</h2>
                <p className="text-sm font-bold text-gray-500 dark:text-slate-400 md:text-xl">{t('booking.titles.contact_subtitle')}</p>
              </div>

              <div className="mx-auto max-w-2xl space-y-6 md:space-y-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                  <div className="space-y-3">
                    <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.name')}</label>
                    <input
                      type="text"
                      placeholder={t('booking.fields.name_placeholder')}
                      value={userInfo.name}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, name: e.target.value });
                        if (submitError) {
                          setSubmitError('');
                        }
                      }}
                      className="w-full rounded-[1.5rem] border-2 border-transparent bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:border-blue-600 focus:bg-white dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800 md:rounded-3xl md:px-8 md:py-5 md:text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.phone')}</label>
                    <input
                      type="tel"
                      placeholder={t('booking.fields.phone_placeholder')}
                      value={userInfo.phone}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, phone: e.target.value });
                        if (submitError) {
                          setSubmitError('');
                        }
                      }}
                      className="w-full rounded-[1.5rem] border-2 border-transparent bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:border-blue-600 focus:bg-white dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800 md:rounded-3xl md:px-8 md:py-5 md:text-lg"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.address')}</label>
                  <textarea
                    placeholder={t('booking.fields.address_placeholder')}
                    rows={4}
                    value={userInfo.address}
                    onChange={(e) => {
                      setUserInfo({ ...userInfo, address: e.target.value });
                      if (submitError) {
                        setSubmitError('');
                      }
                    }}
                    className="w-full resize-none rounded-[1.5rem] border-2 border-transparent bg-gray-50 px-6 py-4 text-base font-bold outline-none transition-all focus:border-blue-600 focus:bg-white dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-800 md:rounded-3xl md:px-8 md:py-5 md:text-lg"
                  />
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleBooking}
                    disabled={!isStepValid()}
                    className="w-full rounded-[1.8rem] bg-blue-600 py-7 text-xl font-black text-white shadow-2xl shadow-blue-200 transition-all active:scale-95 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-blue-900/20 md:rounded-[2.5rem] md:py-12 md:text-3xl"
                  >
                    {t('booking.summary.confirm_final')}
                    <ShieldCheck className="mr-3 h-7 w-7 md:mr-4 md:h-10 md:w-10" />
                  </Button>
                  {submitError ? (
                    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-center dark:border-red-900/40 dark:bg-red-950/30">
                      <p className="font-bold text-red-600 dark:text-red-300">{submitError}</p>
                    </div>
                  ) : null}
                  <p className="mt-6 flex items-center justify-center gap-2 text-center font-bold text-gray-500 dark:text-slate-400">
                    <Clock className="w-5 h-5" />
                    {t('booking.summary.response_time')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div key="step3" className="space-y-8 py-10 text-center md:space-y-10 md:py-16 animate-fadeInUp">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-2xl shadow-emerald-100 animate-bounce dark:bg-emerald-900/30 dark:text-emerald-400 dark:shadow-none md:h-32 md:w-32">
                <Check className="h-12 w-12 md:h-16 md:w-16" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-blue-900 dark:text-white md:text-5xl">{t('booking.titles.success_title')}</h2>
                <p className="mx-auto max-w-md text-lg font-bold leading-relaxed text-gray-500 dark:text-slate-400 md:text-2xl">
                  {t('booking.titles.success_subtitle')}
                </p>
                {bookingReference && (
                  <div className="inline-flex flex-col items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-6 py-4 border border-blue-100 dark:border-blue-800">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {isRTL ? 'احتفظ برقم الطلب عند الحاجة للتواصل مع خدمة العملاء' : 'Save this order reference in case you need support'}
                    </span>
                    <span className="text-xl font-black tracking-wider text-blue-900 dark:text-white md:text-2xl">{bookingReference}</span>
                  </div>
                )}
              </div>
              <div className="pt-6 md:pt-10">
                <Button
                  onClick={() => navigate('/')}
                  className="rounded-[1.5rem] bg-blue-900 px-10 py-5 text-lg font-black text-white shadow-2xl transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 md:rounded-[2rem] md:px-16 md:py-8 md:text-2xl"
                >
                  {t('booking.fields.back_home')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {currentStep < 3 && (
        <div className="mt-10 grid grid-cols-2 gap-4 opacity-90 transition-all duration-500 hover:opacity-100 md:mt-16 md:gap-8 md:grid-cols-4 dark:opacity-100">
          {[
            { icon: ShieldCheck, text: t('common.trust_safe') || 'Secure Booking' },
            { icon: Star, text: t('common.trust_rating') || '4.9/5 Rating' },
            { icon: Clock, text: t('common.trust_support') || '24/7 Support' },
            { icon: Check, text: t('common.trust_team') || 'Certified Team' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <item.icon className="h-8 w-8 text-blue-900 dark:text-slate-100 md:h-10 md:w-10" />
              <span className="text-xs font-black text-blue-900 dark:text-slate-100 md:text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
