import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Bug, 
  Calendar as CalendarIcon, 
  User, 
  CreditCard, 
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { BookingCalendar } from './BookingCalendar';
import { calculatePrice } from '../services/priceService';
import { useLeads } from '../hooks/useLeads';
import { siteConfig } from '../config/site';

const steps = [
  { id: 'service', title: 'الخدمة', icon: Sparkles },
  { id: 'details', title: 'التفاصيل', icon: Check },
  { id: 'datetime', title: 'الموعد', icon: CalendarIcon },
  { id: 'info', title: 'البيانات', icon: User },
  { id: 'payment', title: 'الدفع', icon: CreditCard },
];

export const BookingStepper = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { saveLead } = useLeads();
  
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
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (serviceType) {
      const options = serviceType === 'pest' 
        ? { pestType: details.pestType, rooms: details.rooms, halls: details.halls, bathrooms: details.bathrooms }
        : { area: details.area, floors: details.floors, bathrooms: details.bathrooms, kitchens: details.kitchens };
      setPrice(calculatePrice(serviceType, options));
    }
  }, [serviceType, details]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBooking = async () => {
    try {
      const leadDetails = serviceType === 'pest' 
        ? `نوع الحشرة: ${t(`calculator.pest_types.${details.pestType}`)}, غرف: ${details.rooms}, صالات: ${details.halls}, حمامات: ${details.bathrooms}`
        : `أدوار: ${details.floors}, مساحة: ${details.area}م, مطابخ: ${details.kitchens}, حمامات: ${details.bathrooms}`;

      const formattedDate = selectedDate?.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      await saveLead({
        name: userInfo.name,
        phone: userInfo.phone,
        service: serviceType!,
        price: price,
        details: `${leadDetails} | الموعد: ${formattedDate} ${selectedTime} | العنوان: ${userInfo.address}`,
        source: 'booking_system'
      });

      // Send to WhatsApp
      const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
      const text = `طلب حجز جديد من الموقع:\n\nالخدمة: ${serviceType === 'cleaning' ? 'تنظيف' : 'مكافحة حشرات'}\nالتفاصيل: ${leadDetails}\nالموعد: ${formattedDate} ${selectedTime}\nالاسم: ${userInfo.name}\nالهاتف: ${userInfo.phone}\nالعنوان: ${userInfo.address}\nالسعر التقديري: ${price} د.ك`;
      window.open(siteConfig.links.whatsapp(whatsappNumber, text), '_blank');
      
      setCurrentStep(steps.length); // Final confirmation step
    } catch (error) {
      console.error("Booking error:", error);
      alert(isRTL ? "حدث خطأ أثناء حفظ طلبك، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة." : "An error occurred while saving your request. Please try again or contact us directly.");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return serviceType !== null;
      case 1: return true; // Details always have defaults
      case 2: return selectedDate !== undefined && selectedTime !== '';
      case 3: return userInfo.name.length >= 2 && /^[2569]\d{7}$/.test(userInfo.phone) && userInfo.address.length > 5;
      case 4: return true;
      default: return false;
    }
  };

  const progress = Math.min((currentStep / (steps.length - 1)) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Stepper Header */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-gray-100 text-gray-400",
                  isCurrent && "ring-4 ring-blue-100 scale-110"
                )}>
                  {isActive && index < currentStep ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <span className={cn(
                  "mt-3 text-xs font-bold transition-colors duration-500",
                  isActive ? "text-blue-900" : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
          {/* Progress Line */}
          <div className="absolute left-0 right-0 h-1 bg-gray-100 -translate-y-8 mx-auto w-[80%] -z-0">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-blue-900">اختر الخدمة المطلوبة</h2>
                  <p className="text-gray-500 text-lg">نقدم خدمات احترافية بأيدي متخصصين</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { id: 'cleaning', title: 'تنظيف منازل', icon: Sparkles, desc: 'تنظيف عميق وشامل لكل ركن في منزلك' },
                    { id: 'pest', title: 'مكافحة حشرات', icon: Bug, desc: 'إبادة فورية وضمان 6 أشهر على جميع الخدمات' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServiceType(s.id as any)}
                      className={cn(
                        "p-8 rounded-[2.5rem] border-2 text-right transition-all group relative overflow-hidden",
                        serviceType === s.id 
                          ? "border-blue-600 bg-blue-50/50 shadow-xl" 
                          : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all",
                        serviceType === s.id ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:scale-110"
                      )}>
                        <s.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-blue-900 mb-2">{s.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                      {serviceType === s.id && (
                        <div className="absolute top-6 left-6 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-blue-900">تفاصيل الخدمة</h2>
                  <p className="text-gray-500 text-lg">حدد التفاصيل لنعطيك سعراً دقيقاً</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    {serviceType === 'cleaning' ? (
                      <>
                        <div className="space-y-4">
                          <label className="text-blue-900 font-black text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            المساحة الإجمالية (م²)
                          </label>
                          <input 
                            type="range" min="50" max="1000" step="50" 
                            value={details.area}
                            onChange={(e) => setDetails({...details, area: parseInt(e.target.value)})}
                            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-blue-900 font-bold">
                            <span>50 م²</span>
                            <span className="text-2xl text-blue-600">{details.area} م²</span>
                            <span>1000 م²</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'floors', label: 'أدوار', max: 5 },
                            { id: 'kitchens', label: 'مطابخ', max: 5 },
                            { id: 'bathrooms', label: 'حمامات', max: 10 }
                          ].map((item) => (
                            <div key={item.id} className="bg-gray-50 p-6 rounded-3xl space-y-3">
                              <span className="text-gray-500 font-bold">{item.label}</span>
                              <div className="flex items-center justify-between">
                                <button 
                                  onClick={() => setDetails({...details, [item.id]: Math.max(1, (details as any)[item.id] - 1)})}
                                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black hover:bg-blue-600 hover:text-white transition-all"
                                >-</button>
                                <span className="text-xl font-black text-blue-900">{(details as any)[item.id]}</span>
                                <button 
                                  onClick={() => setDetails({...details, [item.id]: Math.min(item.max, (details as any)[item.id] + 1)})}
                                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black hover:bg-blue-600 hover:text-white transition-all"
                                >+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <label className="text-blue-900 font-black text-lg">نوع الحشرات</label>
                          <div className="grid grid-cols-1 gap-3">
                            {['general', 'termites', 'rodents', 'bedbugs'].map((type) => (
                              <button
                                key={type}
                                onClick={() => setDetails({...details, pestType: type})}
                                className={cn(
                                  "p-5 rounded-2xl text-right font-bold transition-all border-2",
                                  details.pestType === type 
                                    ? "border-blue-600 bg-blue-50 text-blue-900" 
                                    : "border-gray-100 hover:border-blue-100 text-gray-500"
                                )}
                              >
                                {t(`calculator.pest_types.${type}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Price Card */}
                  <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white space-y-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 opacity-80">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        السعر التقديري
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black">{price}</span>
                        <span className="text-2xl font-bold opacity-60">د.ك</span>
                      </div>
                      <p className="mt-6 text-blue-100/60 text-sm leading-relaxed">
                        * هذا السعر تقديري بناءً على المعلومات المقدمة، وقد يتغير قليلاً بعد المعاينة الفعلية.
                      </p>
                    </div>
                    <div className="space-y-4 pt-8 border-t border-blue-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-bold">ضمان حقيقي على الخدمة</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="font-bold">فريق فني متخصص ومحترف</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-blue-900">تحديد الموعد</h2>
                  <p className="text-gray-500 text-lg">اختر اليوم والوقت المناسب لزيارتنا</p>
                </div>
                <BookingCalendar 
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-blue-900">البيانات الشخصية</h2>
                  <p className="text-gray-500 text-lg">لنتمكن من التواصل معك وتأكيد الحجز</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-blue-900 font-bold block pr-2">الاسم الكامل</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="text"
                          placeholder="مثال: أحمد محمد"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                          className="w-full pl-6 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-blue-900 font-bold block pr-2">رقم الهاتف (الكويت)</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input 
                          type="tel"
                          placeholder="مثال: 5xxxxxxx"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                          className="w-full pl-6 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-blue-900 font-bold block pr-2">العنوان بالتفصيل</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-4 text-gray-400 w-5 h-5" />
                        <textarea 
                          placeholder="المنطقة، القطعة، الشارع، رقم المنزل..."
                          rows={5}
                          value={userInfo.address}
                          onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                          className="w-full pl-6 pr-12 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-blue-900">تأكيد الحجز والدفع</h2>
                  <p className="text-gray-500 text-lg">راجع تفاصيل طلبك قبل الإتمام</p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-500 font-bold">الخدمة</span>
                      <span className="text-blue-900 font-black">{serviceType === 'cleaning' ? 'تنظيف منازل' : 'مكافحة حشرات'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-500 font-bold">الموعد</span>
                      <span className="text-blue-900 font-black">
                        {selectedDate?.toLocaleDateString('ar-KW')} - {t(`calculator.booking.times.${selectedTime}`)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xl text-blue-900 font-black">الإجمالي المستحق</span>
                      <span className="text-3xl text-blue-600 font-black">{price} د.ك</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-blue-900 font-black pr-2">اختر طريقة الدفع</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-6 rounded-2xl border-2 border-blue-600 bg-blue-50 flex flex-col items-center gap-3">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        <span className="font-bold text-blue-900">الدفع نقداً / K-Net</span>
                      </button>
                      <button disabled className="p-6 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-50 flex flex-col items-center gap-3 cursor-not-allowed">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                        <span className="font-bold text-gray-400">الدفع أونلاين (قريباً)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Check className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-blue-900">تم استلام طلبك بنجاح!</h2>
                <p className="text-gray-500 text-xl max-w-md mx-auto leading-relaxed">
                  شكراً لثقتك بـ فورتي. سيقوم فريقنا بالتواصل معك خلال دقائق لتأكيد الموعد النهائي.
                </p>
                <div className="pt-8">
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-8 rounded-2xl text-xl font-black shadow-xl"
                  >
                    العودة للرئيسية
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={cn(
                  "flex items-center gap-2 font-black text-lg transition-all",
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-blue-900"
                )}
              >
                {isRTL ? <ChevronRight /> : <ChevronLeft />}
                السابق
              </button>
              
              <Button
                onClick={currentStep === 4 ? handleBooking : nextStep}
                disabled={!isStepValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl text-lg font-black shadow-xl shadow-blue-100 disabled:opacity-50 disabled:shadow-none"
              >
                {currentStep === 4 ? 'تأكيد الحجز النهائي' : 'المتابعة'}
                {isRTL ? <ChevronLeft className="mr-2" /> : <ChevronRight className="ml-2" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Trust Signals in Stepper */}
      {currentStep < 5 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">دفع آمن</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Star className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">تقييم 4.9/5</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">دعم 24/7</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Check className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">فريق معتمد</span>
          </div>
        </div>
      )}
    </div>
  );
};
