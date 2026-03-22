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
  Phone,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { BookingCalendar } from './BookingCalendar';
import { calculatePrice } from '../services/priceService';
import { useLeads } from '../hooks/useLeads';
import { siteConfig } from '../config/site';
import { useStore } from '../lib/store';

export const BookingStepper = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { saveLead } = useLeads();
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
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
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

  const handleBooking = async () => {
    try {
      const leadDetails = serviceType === 'pest' 
        ? `نوع الحشرة: ${t(`calculator.pest_types.${details.pestType}`)}, غرف: ${details.rooms}, صالات: ${details.halls}, حمامات: ${details.bathrooms}`
        : `أدوار: ${details.floors}, مساحة: ${details.area}م, مطابخ: ${details.kitchens}, حمامات: ${details.bathrooms}`;

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
      await saveLead({
        name: userInfo.name,
        phone: userInfo.phone,
        service: serviceType!,
        price: price,
        details: `${leadDetails} | الموعد: ${formattedDate} ${selectedTime} | العنوان: ${userInfo.address}`,
        source: 'booking_system'
      });

      // Add to global cart for history/reference
      addToCart({
        id: crypto.randomUUID(),
        service: serviceType!,
        price: price,
        details: { leadDetails, date: formattedDate, time: selectedTime }
      });

      // Send to WhatsApp
      const whatsappNumber = serviceType === 'cleaning' ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
      const text = `طلب حجز جديد من الموقع:\n\nالخدمة: ${serviceType === 'cleaning' ? 'تنظيف' : 'مكافحة حشرات'}\nالتفاصيل: ${leadDetails}\nالموعد: ${formattedDate} ${selectedTime}\nالاسم: ${userInfo.name}\nالهاتف: ${userInfo.phone}\nالعنوان: ${userInfo.address}\nالسعر التقديري: ${price} د.ك`;
      window.open(siteConfig.links.whatsapp(whatsappNumber, text), '_blank');
      
      setCurrentStep(3); // Final confirmation step
    } catch (error) {
      console.error("Booking error:", error);
      alert(isRTL ? "حدث خطأ أثناء حفظ طلبك، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة." : "An error occurred while saving your request. Please try again or contact us directly.");
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

  const progress = ((currentStep + 1) / 3) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* Optimized Stepper Header */}
      <div className="mb-12">
        <div className="flex justify-between items-center max-w-md mx-auto relative">
          {[
            { id: 'service', title: 'الخدمة', icon: Sparkles },
            { id: 'datetime', title: 'الموعد', icon: CalendarIcon },
            { id: 'info', title: 'البيانات', icon: User },
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

      <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900">اختر خدمتك المفضلة</h2>
                  <p className="text-gray-500 text-xl font-bold">نقدم أفضل خدمات النظافة والمكافحة في الكويت</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { id: 'cleaning', title: 'تنظيف شامل', icon: Sparkles, color: 'blue', price: 'من 110 د.ك' },
                    { id: 'pest', title: 'مكافحة حشرات', icon: Bug, color: 'red', price: 'من 25 د.ك' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setServiceType(s.id as any);
                        setCurrentStep(1);
                      }}
                      className={cn(
                        "p-10 rounded-[3rem] border-4 text-right transition-all group relative overflow-hidden",
                        serviceType === s.id 
                          ? "border-blue-600 bg-blue-50/50 shadow-2xl scale-[1.02]" 
                          : "border-gray-50 hover:border-blue-200 hover:bg-gray-50 shadow-lg"
                      )}
                    >
                      <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all shadow-lg",
                        serviceType === s.id ? "bg-blue-600 text-white" : "bg-white text-blue-600 group-hover:scale-110"
                      )}>
                        <s.icon className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-black text-blue-900 mb-3">{s.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-black text-xl">{s.price}</span>
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ChevronLeft className="w-6 h-6" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900">تحديد الموعد والتفاصيل</h2>
                  <p className="text-gray-500 text-xl font-bold">اختر ما يناسبك لنقوم بخدمتك</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-10">
                    <BookingCalendar 
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                    />
                    
                    {/* Compact Details Integration */}
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                      <h4 className="text-xl font-black text-blue-900 mb-6 flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                        تخصيص الخدمة
                      </h4>
                      {serviceType === 'cleaning' ? (
                        <div className="space-y-6">
                          <label className="text-blue-900 font-bold block">المساحة التقريبية ({details.area} م²)</label>
                          <input 
                            type="range" min="50" max="1000" step="50" 
                            value={details.area}
                            onChange={(e) => setDetails({...details, area: parseInt(e.target.value)})}
                            className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-blue-600 shadow-inner"
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
                                  : "bg-white border-gray-100 hover:border-blue-100 text-gray-500"
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
                  <div className="bg-blue-900 rounded-[3rem] p-10 text-white space-y-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-800 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                    <div>
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-3 opacity-90">
                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        ملخص الحجز
                      </h3>
                      <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-blue-100 font-bold">
                          <span>الخدمة</span>
                          <span>{serviceType === 'cleaning' ? 'تنظيف' : 'مكافحة'}</span>
                        </div>
                        <div className="flex justify-between text-blue-100 font-bold">
                          <span>الضمان</span>
                          <span>6 أشهر</span>
                        </div>
                      </div>
                      <div className="pt-8 border-t border-blue-800">
                        <span className="text-blue-200 font-bold block mb-2">السعر التقديري</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-7xl font-black">{price}</span>
                          <span className="text-3xl font-bold opacity-60">د.ك</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full bg-white text-blue-900 hover:bg-blue-50 py-10 rounded-[2rem] text-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      تأكيد الموعد
                      <ChevronLeft className="mr-2 w-8 h-8" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-blue-900">بيانات التواصل</h2>
                  <p className="text-gray-500 text-xl font-bold">لنتمكن من تأكيد طلبك فوراً</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-blue-900 font-black pr-2">الاسم</label>
                      <input 
                        type="text"
                        placeholder="مثال: أحمد محمد"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-lg font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-blue-900 font-black pr-2">رقم الهاتف</label>
                      <input 
                        type="tel"
                        placeholder="5xxxxxxx"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-lg font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-blue-900 font-black pr-2">العنوان بالتفصيل</label>
                    <textarea 
                      placeholder="المنطقة، القطعة، الشارع، رقم المنزل..."
                      rows={4}
                      value={userInfo.address}
                      onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                      className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-lg font-bold resize-none"
                    />
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={handleBooking}
                      disabled={!isStepValid()}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 py-12 rounded-[2.5rem] text-3xl font-black shadow-2xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      تأكيد الحجز النهائي
                      <ShieldCheck className="mr-4 w-10 h-10" />
                    </Button>
                    <p className="text-center text-gray-400 mt-6 font-bold flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5" />
                      سيتم الرد عليك خلال أقل من 5 دقائق
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16 space-y-10"
              >
                <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-100 animate-bounce">
                  <Check className="w-16 h-16" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-blue-900">طلبك قيد التنفيذ!</h2>
                  <p className="text-gray-500 text-2xl font-bold max-w-md mx-auto leading-relaxed">
                    شكراً لثقتك بـ فورتي. تم إرسال تفاصيل الحجز عبر واتساب وسيتم التواصل معك الآن.
                  </p>
                </div>
                <div className="pt-10">
                  <Button 
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-16 py-8 rounded-[2rem] text-2xl font-black shadow-2xl"
                  >
                    العودة للرئيسية
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Trust Badges */}
      {currentStep < 3 && (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {[
            { icon: ShieldCheck, text: 'حجز آمن 100%' },
            { icon: Star, text: 'تقييم 4.9/5' },
            { icon: Clock, text: 'دعم 24 ساعة' },
            { icon: Check, text: 'فريق معتمد' }
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
