import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Button } from './ui/button';
import { calculatePrice } from '../services/priceService';
import { useLeads } from '../hooks/useLeads';
import { siteConfig } from '../config/site';
import { useStore } from '../lib/store';

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
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const price = useMemo(() => {
    if (!serviceType) return 0;
    const options = serviceType === 'pest'
      ? { pestType: details.pestType, rooms: details.rooms, halls: details.halls, bathrooms: details.bathrooms }
      : { area: details.area, floors: details.floors, bathrooms: details.bathrooms, kitchens: details.kitchens };
    return calculatePrice(serviceType, options);
  }, [serviceType, details]);

  const handleBooking = async () => {
    try {
      const leadDetails = serviceType === 'pest' 
        ? `${t('booking.whatsapp.details')}: ${t(`calculator.pest_types.${details.pestType}`)}, ${t('calculator.whatsapp_message.rooms')}: ${details.rooms}, ${t('calculator.whatsapp_message.halls')}: ${details.halls}, ${t('calculator.whatsapp_message.bathrooms')}: ${details.bathrooms}`
        : `${t('calculator.whatsapp_message.floors')}: ${details.floors}, ${t('calculator.whatsapp_message.area')}: ${details.area}${t('calculator.area_unit')}, ${t('calculator.whatsapp_message.kitchens')}: ${details.kitchens}, ${t('calculator.whatsapp_message.bathrooms')}: ${details.bathrooms}`;

      const formattedDate = selectedDate?.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      // Save user to global store
      setUser({
        id: user?.id || crypto.randomUUID(),
        name: userInfo.name,
        phone: userInfo.phone,
        address: userInfo.address
      });

      // Save Lead to Firestore
      const savedLead = await saveLead({
        name: userInfo.name,
        phone: userInfo.phone,
        service: serviceType!,
        price: price,
        details: `${leadDetails} | ${t('booking.whatsapp.appointment')}: ${formattedDate} ${t(`calculator.booking.times.${selectedTime}`)} | ${t('booking.whatsapp.address')}: ${userInfo.address}`,
        source: 'booking_system'
      });
      setBookingReference(savedLead.trackingCode);

      // Add to global cart
      addToCart({
        id: crypto.randomUUID(),
        service: serviceType!,
        price: price,
        details: { leadDetails, date: formattedDate, time: selectedTime }
      });

      // Send to WhatsApp
      const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
      const text = `${t('booking.whatsapp.new_booking')}\n\n${t('booking.whatsapp.service')}: ${serviceType === 'cleaning' ? t('booking.whatsapp.cleaning') : t('booking.whatsapp.pest')}\n${t('booking.whatsapp.details')}: ${leadDetails}\n${t('booking.whatsapp.appointment')}: ${formattedDate} ${t(`calculator.booking.times.${selectedTime}`)}\n${t('booking.whatsapp.name')}: ${userInfo.name}\n${t('booking.whatsapp.phone')}: ${userInfo.phone}\n${t('booking.whatsapp.address')}: ${userInfo.address}\n${t('booking.whatsapp.price')}: ${price} ${t('calculator.currency')}\n${isRTL ? 'كود التتبع' : 'Tracking code'}: ${savedLead.trackingCode}`;
      window.open(siteConfig.links.whatsapp(whatsappNumber, text), '_blank');
      
      setCurrentStep(3);
    } catch (error) {
      console.error("Booking error:", error);
      alert(t('common.error_saving'));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return serviceType !== null;
      case 1: return selectedDate !== undefined && selectedTime !== '';
      case 2: return userInfo.name.length >= 2 && /^[2569]\d{7}$/.test(userInfo.phone) && userInfo.address.length > 5;
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Optimized Stepper Header */}
      <div className="mb-12">
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
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-gray-100 text-gray-400",
                  isCurrent && "ring-4 ring-blue-100 scale-110"
                )}>
                  {isActive && index < currentStep ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                </div>
                <span className={cn(
                  "mt-3 text-sm font-black transition-colors duration-500",
                  isActive ? "text-blue-900" : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
          {/* Progress Line */}
          <div className="absolute left-0 right-0 h-1 bg-gray-100 top-7 mx-auto w-[80%] -z-0">
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
              <div key="step0" className="space-y-10 animate-fadeInUp">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900 dark:text-white">{t('booking.titles.select_service')}</h2>
                  <p className="text-gray-500 dark:text-slate-400 text-xl font-bold">{t('booking.titles.select_subtitle')}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { id: 'cleaning', title: t('booking.services.cleaning'), icon: Sparkles, color: 'blue', price: `${t('booking.services.price_from')} 110 ${t('calculator.currency')}` },
                    { id: 'pest', title: t('booking.services.pest'), icon: Bug, color: 'red', price: `${t('booking.services.price_from')} 25 ${t('calculator.currency')}` }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServiceType(s.id as 'cleaning' | 'pest');
                        setCurrentStep(1);
                      }}
                      className={cn(
                        "p-10 rounded-[3rem] border-4 text-right transition-all group relative overflow-hidden",
                        serviceType === s.id 
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-2xl scale-[1.02]" 
                          : "border-gray-50 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 shadow-lg"
                      )}
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all shadow-lg",
                        serviceType === s.id ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-700 text-blue-600 group-hover:scale-110"
                      )}>
                        <s.icon className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-black text-blue-900 dark:text-white mb-3">{s.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 dark:text-blue-400 font-black text-xl">{s.price}</span>
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronLeft className={cn("w-6 h-6", !isRTL && "rotate-180")} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {currentStep === 1 && (
              <div key="step1" className={`space-y-10 ${isRTL ? 'animate-slideInLeft' : 'animate-slideInRight'}`}>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900 dark:text-white">{t('booking.titles.details_title')}</h2>
                  <p className="text-gray-500 dark:text-slate-400 text-xl font-bold">{t('booking.titles.details_subtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-10">
                    <Suspense fallback={<CalendarLoader />}>
                      <BookingCalendar 
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                      />
                    </Suspense>
                    
                    {/* Compact Details Integration */}
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                      <h4 className="text-xl font-black text-blue-900 dark:text-white mb-6 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                        {t('booking.summary.customize')}
                      </h4>
                      {serviceType === 'cleaning' ? (
                        <div className="space-y-6">
                          <label className="text-blue-900 dark:text-slate-300 font-bold block">{t('booking.summary.approx_area')} ({details.area} {t('calculator.area_unit')})</label>
                          <input 
                            type="range" min="50" max="1000" step="50" 
                            value={details.area}
                            onChange={(e) => setDetails({...details, area: parseInt(e.target.value)})}
                            className="w-full h-3 bg-white dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {['general', 'termites', 'rodents', 'bedbugs'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setDetails({...details, pestType: type})}
                              className={cn(
                                "p-4 rounded-2xl text-center font-black transition-all border-2 text-sm",
                                details.pestType === type 
                                  ? "border-blue-600 bg-blue-600 text-white shadow-lg" 
                                  : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900 text-gray-500 dark:text-slate-400"
                              )}
                            >
                              {t(`calculator.pest_types.${type}`)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-blue-900 dark:bg-slate-900 rounded-[3rem] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden border border-blue-800 dark:border-slate-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 dark:bg-slate-800 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                    <div>
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-3 opacity-90">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        {t('booking.summary.title')}
                      </h3>
                      <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-blue-100 dark:text-slate-300 font-bold">
                          <span>{t('booking.summary.service_label')}</span>
                          <span>{serviceType === 'cleaning' ? t('booking.whatsapp.cleaning') : t('booking.whatsapp.pest')}</span>
                        </div>
                        <div className="flex justify-between text-blue-100 dark:text-slate-300 font-bold">
                          <span>{t('booking.summary.guarantee_label')}</span>
                          <span>{t('booking.summary.guarantee_value')}</span>
                        </div>
                      </div>
                      <div className="pt-8 border-t border-blue-800 dark:border-slate-700">
                        <span className="text-blue-200 dark:text-slate-400 font-bold block mb-2">{t('booking.summary.estimated_price')}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-7xl font-black">{price}</span>
                          <span className="text-3xl font-bold opacity-60">{t('calculator.currency')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full bg-white dark:bg-blue-600 text-blue-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-500 py-10 rounded-[2rem] text-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {t('booking.summary.confirm_date')}
                      <ChevronLeft className={cn("mr-2 w-8 h-8", !isRTL && "rotate-180")} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

          {currentStep === 2 && (
              <div key="step2" className={`space-y-10 ${isRTL ? 'animate-slideInLeft' : 'animate-slideInRight'}`}>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900 dark:text-white">{t('booking.titles.contact_title')}</h2>
                  <p className="text-gray-500 dark:text-slate-400 text-xl font-bold">{t('booking.titles.contact_subtitle')}</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.name')}</label>
                      <input 
                        type="text"
                        placeholder={t('booking.fields.name_placeholder')}
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-lg font-bold dark:text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.phone')}</label>
                      <input 
                        type="tel"
                        placeholder={t('booking.fields.phone_placeholder')}
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-lg font-bold dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-blue-900 dark:text-slate-300 font-black pr-2">{t('booking.fields.address')}</label>
                    <textarea 
                      placeholder={t('booking.fields.address_placeholder')}
                      rows={4}
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      className="w-full px-8 py-5 rounded-3xl bg-gray-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all text-lg font-bold resize-none dark:text-white"
                    />
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={handleBooking}
                      disabled={!isStepValid()}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 py-12 rounded-[2.5rem] text-3xl font-black shadow-2xl shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {t('booking.summary.confirm_final')}
                      <ShieldCheck className="mr-4 w-10 h-10" />
                    </Button>
                    <p className="text-center text-gray-400 dark:text-slate-500 mt-6 font-bold flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('booking.summary.response_time')}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {currentStep === 3 && (
              <div key="step3" className="text-center py-16 space-y-10 animate-fadeInUp">
                <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 dark:shadow-none animate-bounce">
                  <Check className="w-16 h-16" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-blue-900 dark:text-white">{t('booking.titles.success_title')}</h2>
                  <p className="text-gray-500 dark:text-slate-400 text-2xl font-bold max-w-md mx-auto leading-relaxed">
                    {t('booking.titles.success_subtitle')}
                  </p>
                  {bookingReference && (
                    <div className="inline-flex flex-col items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl px-6 py-4 border border-blue-100 dark:border-blue-800">
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        {isRTL ? 'احفظ كود التتبع لاستخدامه في متابعة الطلب' : 'Save this tracking code to follow up your order'}
                      </span>
                      <span className="text-2xl font-black text-blue-900 dark:text-white tracking-wider">{bookingReference}</span>
                    </div>
                  )}
                </div>
                <div className="pt-10">
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-900 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white px-16 py-8 rounded-[2rem] text-2xl font-black shadow-2xl"
                  >
                    {t('booking.fields.back_home')}
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Trust Badges */}
      {currentStep < 3 && (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            { icon: ShieldCheck, text: t('common.trust_safe') || 'Secure Booking' },
            { icon: Star, text: t('common.trust_rating') || '4.9/5 Rating' },
            { icon: Clock, text: t('common.trust_support') || '24/7 Support' },
            { icon: Check, text: t('common.trust_team') || 'Certified Team' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <item.icon className="w-10 h-10 text-blue-900" />
              <span className="text-sm font-black text-blue-900">{item.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
