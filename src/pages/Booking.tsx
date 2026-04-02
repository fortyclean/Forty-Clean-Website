import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import { BookingStepper } from '../components/BookingStepper';
import { ShieldCheck, Star, Clock, Check } from 'lucide-react';

const Booking = () => {
  return (
    <Layout variant="landing">
      <Helmet>
        <title>احجز الآن - فورتي لخدمات النظافة ومكافحة الحشرات</title>
        <meta name="description" content="احجز موعدك الآن مع شركة فورتي لخدمات النظافة العامة ومكافحة الحشرات في الكويت. نظام حجز سهل وسريع." />
      </Helmet>

      <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-blue-900">نظام الحجز الذكي</h1>
            <p className="text-gray-500 text-xl leading-relaxed font-bold">
              خطوات بسيطة تفصلك عن الحصول على أفضل خدمة نظافة أو مكافحة حشرات في الكويت
            </p>
          </div>

          {/* Main Booking Stepper */}
          <BookingStepper />

          {/* Trust Signals Footer */}
          <div className="mt-20 max-w-5xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-100">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-lg shadow-blue-50">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-blue-900">ضمان 100%</h3>
                <p className="text-gray-500 font-bold leading-relaxed">
                  نضمن لك جودة الخدمة ورضاك التام، مع إعادة الخدمة مجاناً في حال عدم الرضا.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-lg shadow-emerald-50">
                  <Star className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-blue-900">فريق معتمد</h3>
                <p className="text-gray-500 font-bold leading-relaxed">
                  جميع الفنيين لدينا مدربون ومعتمدون بأعلى المعايير المهنية في الكويت.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-lg shadow-blue-50">
                  <Clock className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-blue-900">مواعيد دقيقة</h3>
                <p className="text-gray-500 font-bold leading-relaxed">
                  نحن نحترم وقتك، ونلتزم بالوصول في الموعد المحدد تماماً دون تأخير.
                </p>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100 text-center">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholder for trust logos/badges */}
                <div className="flex items-center gap-2 font-black text-2xl text-blue-900">
                  <Check className="w-8 h-8 text-emerald-500" />
                  K-NET ACCEPTED
                </div>
                <div className="flex items-center gap-2 font-black text-2xl text-blue-900">
                  <Check className="w-8 h-8 text-emerald-500" />
                  ISO CERTIFIED
                </div>
                <div className="flex items-center gap-2 font-black text-2xl text-blue-900">
                  <Check className="w-8 h-8 text-emerald-500" />
                  MINISTRY LICENSED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
