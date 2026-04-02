import { useTranslation } from 'react-i18next';
import { Check, Clock, ShieldCheck, Star } from 'lucide-react';
import Layout from '../components/Layout';
import { BookingStepper } from '../components/BookingStepper';
import Seo from '../components/Seo';

const Booking = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const pageCopy = isRTL
    ? {
        title: 'احجز الآن - فورتي لخدمات النظافة ومكافحة الحشرات',
        description: 'احجز موعدك الآن مع شركة فورتي لخدمات النظافة العامة ومكافحة الحشرات في الكويت عبر نظام حجز سريع وسهل.',
        heading: 'نظام الحجز الذكي',
        subtitle: 'خطوات بسيطة تفصلك عن الحصول على خدمة النظافة أو مكافحة الحشرات المناسبة في الكويت.',
        guaranteeTitle: 'ضمان 100%',
        guaranteeDescription: 'نضمن لك جودة الخدمة ورضاك التام، مع إعادة الخدمة مجانًا إذا لم تكن النتيجة بالمستوى المتوقع.',
        teamTitle: 'فريق معتمد',
        teamDescription: 'جميع الفنيين لدينا مدربون ومؤهلون لتقديم الخدمة بمستوى مهني ثابت وموثوق.',
        timingTitle: 'مواعيد دقيقة',
        timingDescription: 'نحترم وقتك ونلتزم بالوصول في الموعد المحدد بدل المواعيد الفضفاضة المعتادة.',
        badgeKnet: 'الدفع عبر كي نت',
        badgeIso: 'معايير جودة معتمدة',
        badgeLicensed: 'مرخص من الجهات المختصة',
      }
    : {
        title: 'Book Now - Forty Cleaning & Pest Control Services',
        description: 'Book your appointment now with Forty for general cleaning and pest control services in Kuwait through a fast and simple booking flow.',
        heading: 'Smart Booking System',
        subtitle: 'Simple steps separate you from getting the right cleaning or pest control service in Kuwait.',
        guaranteeTitle: '100% Guarantee',
        guaranteeDescription: 'We stand behind service quality and your satisfaction, with free re-service if the outcome falls short.',
        teamTitle: 'Certified Team',
        teamDescription: 'Every technician is trained and qualified to deliver service to a consistent professional standard.',
        timingTitle: 'Punctual Appointments',
        timingDescription: 'We respect your time and aim to arrive on schedule without the usual vague time windows.',
        badgeKnet: 'K-Net Accepted',
        badgeIso: 'ISO Certified',
        badgeLicensed: 'Ministry Licensed',
      };

  return (
    <Layout variant="landing">
      <Seo title={pageCopy.title} description={pageCopy.description} />

      <div className="min-h-screen bg-gray-50 pt-32 pb-20 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center md:mb-12">
            <h1 className="text-3xl font-black text-blue-900 dark:text-white md:text-5xl">{pageCopy.heading}</h1>
            <p className="mx-auto max-w-2xl text-lg font-bold leading-relaxed text-gray-500 dark:text-slate-400 md:text-xl">
              {pageCopy.subtitle}
            </p>
          </div>

          <BookingStepper />

          <div className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:mt-20 md:rounded-[3rem] md:p-16">
            <div className="grid gap-8 text-center md:grid-cols-3 md:gap-12">
              <div className="space-y-4 rounded-[1.75rem] bg-gray-50 p-6 dark:bg-slate-800/70 md:bg-transparent md:p-0">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 shadow-lg shadow-blue-50 dark:bg-blue-950/50 dark:text-blue-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <ShieldCheck className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.guaranteeTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base">{pageCopy.guaranteeDescription}</p>
              </div>

              <div className="space-y-4 rounded-[1.75rem] bg-gray-50 p-6 dark:bg-slate-800/70 md:bg-transparent md:p-0">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <Star className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.teamTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base">{pageCopy.teamDescription}</p>
              </div>

              <div className="space-y-4 rounded-[1.75rem] bg-gray-50 p-6 dark:bg-slate-800/70 md:bg-transparent md:p-0">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 shadow-lg shadow-blue-50 dark:bg-slate-800 dark:text-blue-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <Clock className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.timingTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base">{pageCopy.timingDescription}</p>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-100 pt-8 text-center dark:border-slate-800 md:mt-16 md:pt-12">
              <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-10">
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-base font-black text-blue-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-white md:text-xl">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {pageCopy.badgeKnet}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-base font-black text-blue-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-white md:text-xl">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {pageCopy.badgeIso}
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-base font-black text-blue-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-white md:text-xl">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {pageCopy.badgeLicensed}
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
