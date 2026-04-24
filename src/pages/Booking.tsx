import { ShieldCheck, Star, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { BookingStepper } from '../components/BookingStepper';

const Booking = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const pageCopy = isArabic
    ? {
        seoTitle: 'احجز خدمة مكافحة الحشرات أو التنظيف بعد التشطيب | فورتي الكويت',
        seoDescription: 'احجز خدمة مكافحة الحشرات أو تنظيف بعد التشطيب في الكويت مع فورتي. خطوات سريعة، ضمان 6 أشهر، تغطية جميع المناطق.',
        title: 'احجز خدمتك خلال دقائق',
        subtitle:
          'اختر الخدمة والموعد المناسب، ثم أرسل طلبك وسيتواصل معك فريق فورتي سريعًا لتأكيد التفاصيل وترتيب الزيارة.',
        qualityTitle: 'تنفيذ منظم وواضح',
        qualityText:
          'ننسق الخدمة معك بخطوات واضحة من البداية حتى التنفيذ، مع متابعة جادة لراحة العميل وجودة النتيجة.',
        teamTitle: 'فريق محترف ومجهز',
        teamText:
          'فريقنا مدرب على خدمات المنازل والمكاتب والمكافحة المتخصصة، مع تجهيزات مناسبة لكل نوع خدمة.',
        timingTitle: 'مواعيد دقيقة وسريعة',
        timingText:
          'اختر الوقت الأنسب لك، وسنرتب الموعد بشكل واضح وسهل حتى تصل الخدمة بدون تعقيد أو انتظار مرهق.',
        bottomBadges: ['حجز سريع وواضح', 'أسعار تقديرية مباشرة', 'خدمة مرنة حسب الموعد'],
      }
    : {
        seoTitle: 'Book Pest Control or Post-Construction Cleaning in Kuwait | Forty',
        seoDescription: 'Book pest control or post-construction cleaning in Kuwait with Forty. Fast steps, 6-month guarantee, all areas covered.',
        title: 'Book Your Service In Minutes',
        subtitle:
          'Choose the service and time that fit you, then send your request and our team will quickly confirm the details and arrange the visit.',
        qualityTitle: 'Clear, Organized Execution',
        qualityText:
          'We coordinate every step clearly from booking to delivery, with a strong focus on client comfort and service quality.',
        teamTitle: 'Professional, Equipped Team',
        teamText:
          'Our team is trained for homes, offices, and specialized pest control visits with the right setup for each job.',
        timingTitle: 'Fast, Accurate Scheduling',
        timingText:
          'Pick the time that suits you best and we will arrange the visit clearly without unnecessary delays or confusion.',
        bottomBadges: ['Fast booking flow', 'Instant estimated pricing', 'Flexible scheduling'],
      };

  return (
    <Layout variant="landing">
      <Seo
        title={pageCopy.seoTitle}
        description={pageCopy.seoDescription}
        canonical="https://www.fortyclean.com/booking"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": isArabic ? "حجز خدمات التنظيف ومكافحة الحشرات" : "Book Cleaning & Pest Control",
            "serviceType": isArabic ? "خدمات التنظيف ومكافحة الحشرات" : "Cleaning & Pest Control",
            "provider": {
              "@type": "LocalBusiness",
              "name": "شركة فورتي للتنظيف ومكافحة الحشرات",
              "url": "https://www.fortyclean.com",
              "telephone": "+96569988979",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              }
            },
            "areaServed": { "@type": "Country", "name": "Kuwait" },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://www.fortyclean.com/booking",
              "serviceType": "Online Booking"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://www.fortyclean.com/" },
              { "@type": "ListItem", "position": 2, "name": "الحجز", "item": "https://www.fortyclean.com/booking" }
            ]
          }
        ]}
      />

      <div className="min-h-screen bg-gray-50 pb-16 pt-24 dark:bg-slate-950 md:pb-20 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center md:mb-12 md:space-y-4">
            <h1 className="text-3xl font-black text-blue-900 dark:text-white md:text-5xl">{pageCopy.title}</h1>
            <p className="text-base font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-xl md:leading-relaxed">{pageCopy.subtitle}</p>
          </div>

          <BookingStepper />

          <div className="mx-auto mt-12 max-w-5xl rounded-[2.25rem] border border-gray-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 md:mt-20 md:rounded-[3rem] md:p-16">
            <div className="grid gap-8 text-center md:grid-cols-3 md:gap-12">
              <div className="space-y-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 shadow-lg shadow-blue-50 dark:bg-blue-950/30 dark:text-blue-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <ShieldCheck className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.qualityTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base md:leading-relaxed">{pageCopy.qualityText}</p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <Star className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.teamTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base md:leading-relaxed">{pageCopy.teamText}</p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 shadow-lg shadow-blue-50 dark:bg-blue-950/30 dark:text-blue-300 dark:shadow-none md:mb-6 md:h-20 md:w-20 md:rounded-[2rem]">
                  <Clock className="h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h3 className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">{pageCopy.timingTitle}</h3>
                <p className="text-sm font-bold leading-7 text-gray-500 dark:text-slate-400 md:text-base md:leading-relaxed">{pageCopy.timingText}</p>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-100 pt-8 text-center dark:border-slate-800 md:mt-16 md:pt-12">
              <div className="flex flex-wrap justify-center gap-4 opacity-90 transition-all duration-500 hover:opacity-100 md:gap-10">
                {pageCopy.bottomBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-sm font-black text-blue-900 dark:text-slate-100 md:text-xl">
                    <Check className="h-5 w-5 text-emerald-500 md:h-7 md:w-7" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
