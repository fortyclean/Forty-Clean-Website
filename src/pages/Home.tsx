import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CalendarClock, Calculator, Check, Clock, MessageCircle, ShieldCheck, Sparkles, Star } from 'lucide-react';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import TrackedContactLink from '../components/TrackedContactLink';
import HeroSection from '../components/sections/HeroSection';
import { buildWhatsAppMessage, siteConfig } from '../config/site';

const WhyUsSection = lazy(() => import('../components/sections/WhyUsSection'));
const BeforeAfterSection = lazy(() => import('../components/sections/BeforeAfterSection'));
const CoverageAreasSection = lazy(() => import('../components/sections/CoverageAreasSection'));
const ReviewsSection = lazy(() => import('../components/sections/ReviewsSection'));
const FAQSection = lazy(() => import('../components/sections/FAQSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));
const PartnersSection = lazy(() => import('../components/sections/PartnersSection'));

const socialProofProfiles = ['NA', 'SA', 'MK', 'FA'];

const SectionLoader = () => (
  <div className="flex justify-center py-8 md:py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
  </div>
);

const SectionCardLoader = ({ minHeight = 320 }: { minHeight?: number }) => (
  <div className="px-4 py-6 md:py-8">
    <div
      className="mx-auto max-w-6xl rounded-[2rem] border border-gray-100 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
      style={{ minHeight }}
    >
      <div className="flex h-full items-center justify-center py-10 md:py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </div>
  </div>
);

// ── Schema.org — كامل ومحسّن ──────────────────────────────────────────────────
const HOME_SCHEMA = [
  // 1. WebSite
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "فورتي",
    "alternateName": "Forty Clean Kuwait",
    "url": "https://www.fortyclean.com",
    "inLanguage": ["ar", "en"]
  },
  // 2. Service + OfferCatalog متداخل (تنظيف + مكافحة)
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "خدمات التنظيف ومكافحة الحشرات",
    "provider": {
      "@type": "LocalBusiness",
      "name": "شركة فورتي للتنظيف ومكافحة الحشرات"
    },
    "areaServed": { "@type": "Country", "name": "الكويت" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات فورتي",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "خدمات النظافة",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنظيف منازل بالكويت" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنظيف مكاتب وشركات" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنظيف بعد البناء والتشطيب" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "تنظيف واجهات زجاجية" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "مكافحة الحشرات",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "مكافحة صراصير" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "مكافحة قوارض وفئران" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "مكافحة نمل أبيض" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "مكافحة بق الفراش" } }
          ]
        }
      ]
    }
  },
  // 3. LocalBusiness — كامل مع بيانات قانونية + 7 منصات + AdministrativeArea
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "شركة فورتي للتنظيف ومكافحة الحشرات",
    "alternateName": "Forty Clean",
    "legalName": "شركة فورتي خدمات التنظيف العامه للمباني ذ.م.م",
    "taxID": "384145",
    "foundingDate": "2018",
    "image": "https://www.fortyclean.com/images/forty-clean-logo.png",
    "url": "https://www.fortyclean.com",
    "telephone": ["+96569988979", "+96551004910"],
    "email": "forty@fortyclean.com",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "العاصمة - المرقاب - قطعة 15 - شارع الوزان - مبنى بيت التمويل الكويتي - الدور الخامس - مكتب رقم 1",
      "addressLocality": "مدينة الكويت",
      "addressRegion": "العاصمة",
      "addressCountry": "KW"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.3759,
      "longitude": 47.9774
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "محافظة العاصمة" },
      { "@type": "AdministrativeArea", "name": "محافظة حولي" },
      { "@type": "AdministrativeArea", "name": "محافظة الفروانية" },
      { "@type": "AdministrativeArea", "name": "محافظة الأحمدي" },
      { "@type": "AdministrativeArea", "name": "محافظة مبارك الكبير" },
      { "@type": "AdministrativeArea", "name": "محافظة الجهراء" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "500"
    },
    "sameAs": [
      "https://facebook.com/FortyClean.kw",
      "https://instagram.com/fortyclean_kw",
      "https://x.com/CleanForty",
      "https://www.tiktok.com/@forty.kw",
      "https://www.snapchat.com/add/forty.kw",
      "https://www.pinterest.com/forty0854",
      "https://www.threads.net/fortyclean_kw"
    ]
  },
  // 4. FAQPage
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "هل تقدمون ضماناً على خدمات مكافحة الحشرات؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نقدم ضماناً حقيقياً لمدة 6 أشهر على جميع خدمات مكافحة الحشرات والقوارض. في حال ظهور أي حشرات خلال فترة الضمان، نقوم بإعادة الرش مجاناً."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي المناطق التي تغطيها خدماتكم في الكويت؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نغطي جميع مناطق ومحافظات الكويت (العاصمة، حولي، الفروانية، الأحمدي، مبارك الكبير، الجهراء) ونصل إليكم في أسرع وقت."
        }
      },
      {
        "@type": "Question",
        "name": "هل المواد المستخدمة في التنظيف والمكافحة آمنة؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بالتأكيد، نستخدم مواد تنظيف ومبيدات حشرية معتمدة من وزارة الصحة الكويتية، وهي آمنة تماماً على الأطفال والحيوانات الأليفة وصديقة للبيئة."
        }
      },
      {
        "@type": "Question",
        "name": "كيف يمكنني حجز موعد؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يمكنك الحجز بسهولة عبر موقعنا الإلكتروني من خلال نظام الحجز الذكي، أو التواصل معنا مباشرة عبر الواتساب أو الاتصال الهاتفي على 69988979."
        }
      }
    ]
  }
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const copy = isRTL
    ? {
        licensed: 'مرخص ومؤمن',
        rating: 'تقييم 4.9 على جوجل',
        availability: 'خدمة 24 ساعة طوال الأسبوع',
        certified: 'معايير جودة معتمدة',
        socialProof: '+1,500 عميل سعيد في الكويت',
        journeyBadge: 'اختر الطريقة المناسبة لك خلال دقائق',
        journeyTitle: 'احجز مباشرة أو احسب السعر أو تواصل فورًا مع فريق فورتي',
        journeySubtitle:
          'إذا كنت جاهزًا لتحديد الموعد فابدأ الحجز الذكي. وإذا أردت معرفة السعر أولًا فالحاسبة التقديرية متاحة الآن في صفحة مستقلة. أما واتساب فهو للمحادثة السريعة والتنسيق الفوري.',
        ctaPrimary: 'ابدأ الحجز الذكي',
        ctaPricing: 'احسب السعر التقديري',
        ctaSecondary: 'تواصل واتساب الآن',
        sideTitle: 'ثلاثة مسارات واضحة للعميل',
        sideBullets: [
          'الحجز الذكي مناسب لمن يريد اختيار الخدمة والموعد مباشرة.',
          'الحاسبة مناسبة لمن يريد معرفة السعر التقديري قبل التواصل.',
          'واتساب مناسب للاستفسار السريع أو التنسيق الفوري مع الفريق.',
        ],
        steps: [
          {
            title: 'اختر المسار المناسب',
            text: 'إما الحجز المباشر أو الحاسبة التقديرية أو واتساب الفوري.',
          },
          {
            title: 'حدد التفاصيل الأساسية',
            text: 'الخدمة، الموعد، أو حجم الطلب حسب ما تحتاجه في تلك اللحظة.',
          },
          {
            title: 'استلم المتابعة بسرعة',
            text: 'يصل طلبك إلى فريق فورتي ونرتب معك الخطوة التالية بوضوح.',
          },
        ],
      }
    : {
        licensed: 'Licensed & insured',
        rating: '4.9 Google rating',
        availability: '24/7 service availability',
        certified: 'Certified quality standards',
        socialProof: '+1,500 happy clients in Kuwait',
        journeyBadge: 'Choose the path that suits you in minutes',
        journeyTitle: 'Book directly, estimate pricing, or contact the Forty team instantly',
        journeySubtitle:
          'If you are ready to schedule, start smart booking. If you want to know the price first, the estimate calculator now has its own page. WhatsApp remains the fastest route for quick questions and direct coordination.',
        ctaPrimary: 'Start smart booking',
        ctaPricing: 'Estimate pricing',
        ctaSecondary: 'Chat on WhatsApp',
        sideTitle: 'Three clear customer paths',
        sideBullets: [
          'Smart booking is ideal when you want to choose the service and schedule immediately.',
          'The calculator is ideal when you want a price estimate before contacting the team.',
          'WhatsApp is ideal for quick questions and fast coordination.',
        ],
        steps: [
          {
            title: 'Choose the right path',
            text: 'Use direct booking, the estimate calculator, or instant WhatsApp.',
          },
          {
            title: 'Set the essential details',
            text: 'Service, date, or job size depending on what you need right now.',
          },
          {
            title: 'Get fast follow-up',
            text: 'Your request reaches the Forty team and we guide the next step clearly.',
          },
        ],
      };

  const whatsappHref = siteConfig.links.whatsapp(
    siteConfig.contact.cleaningPhone,
    buildWhatsAppMessage({
      language: i18n.language,
      service: isRTL ? 'خدمات التنظيف' : 'Cleaning services',
      intent: 'quote',
    })
  );

  return (
    <Layout variant="landing">
      <Seo
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        canonical="https://www.fortyclean.com/"
        structuredData={HOME_SCHEMA}
      />

      <HeroSection variant="landing" />

      <div className="overflow-hidden border-y border-gray-100 bg-white py-4 dark:border-slate-800 dark:bg-slate-900 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10">
            <div className="flex items-center gap-2 text-sm font-black text-blue-900 dark:text-slate-100 md:text-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 md:h-6 md:w-6" />
              {isRTL ? 'شركة مرخصة رسميًا' : 'Officially Licensed'}
            </div>
            <div className="flex items-center gap-2 text-sm font-black text-blue-900 dark:text-slate-100 md:text-lg">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500 md:h-6 md:w-6" />
              {isRTL ? `تأسست عام ${siteConfig.establishedYear}` : `Established ${siteConfig.establishedYear}`}
            </div>
            <div className="flex items-center gap-2 text-sm font-black text-blue-900 dark:text-slate-100 md:text-lg">
              <Clock className="h-5 w-5 text-emerald-500 dark:text-emerald-400 md:h-6 md:w-6" />
              {copy.availability}
            </div>
            <div className="flex items-center gap-2 text-sm font-black text-blue-900 dark:text-slate-100 md:text-lg">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 md:h-6 md:w-6" />
              {copy.certified}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-slate-50 py-5 dark:bg-slate-950 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_90px_-50px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-4 md:p-8 lg:p-10">
                <div className={`max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-[11px] font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-200 md:px-4 md:text-sm">
                    <Sparkles className="h-4 w-4" />
                    {copy.journeyBadge}
                  </span>
                  <h2 className="mt-3 text-xl font-black leading-tight text-blue-950 dark:text-white md:mt-4 md:text-4xl">
                    {copy.journeyTitle}
                  </h2>
                  <p className="mt-3 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300 md:mt-4 md:text-lg md:leading-7">
                    {copy.journeySubtitle}
                  </p>
                </div>

                <div className="mt-4 grid gap-2.5 md:grid-cols-3 md:mt-6 md:gap-4">
                  {copy.steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-[1.15rem] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70 md:rounded-[1.5rem] md:p-4"
                    >
                      <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-lg shadow-blue-600/20 md:mb-3 md:h-10 md:w-10 md:rounded-2xl md:text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-[13px] font-black leading-5 text-slate-900 dark:text-white md:text-lg">{step.title}</h3>
                      <p className="mt-1.5 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400 md:mt-2 md:text-sm md:leading-6">{step.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-2.5 md:grid-cols-3 md:mt-5 md:gap-3">
                  <Link
                    to="/booking"
                    className="group flex items-center justify-center gap-3 rounded-[1.2rem] bg-blue-600 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 md:rounded-[1.35rem] md:px-6 md:py-4 md:text-lg"
                  >
                    <CalendarClock className="h-5 w-5 md:h-6 md:w-6" />
                    {copy.ctaPrimary}
                  </Link>
                  <Link
                    to="/pricing"
                    className="group flex items-center justify-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-900 transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-blue-800 dark:hover:bg-slate-800 md:rounded-[1.35rem] md:px-6 md:py-4 md:text-lg"
                  >
                    <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-300 md:h-6 md:w-6" />
                    {copy.ctaPricing}
                  </Link>
                  <TrackedContactLink
                    href={whatsappHref}
                    channel="whatsapp"
                    section="home-booking-choice"
                    service="cleaning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-900 transition-all hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-800 dark:hover:bg-slate-800 md:rounded-[1.35rem] md:px-6 md:py-4 md:text-lg"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-500 md:h-6 md:w-6" />
                    {copy.ctaSecondary}
                  </TrackedContactLink>
                </div>

                <div className="mt-3 grid gap-2 lg:hidden">
                  {copy.sideBullets.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/70"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden border-t border-slate-200 bg-blue-950 p-6 text-white dark:border-slate-800 dark:bg-slate-950 md:p-8 lg:block lg:border-r lg:border-t-0 lg:p-10">
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-xl font-black md:text-3xl">{copy.sideTitle}</h3>
                </div>

                <div className="mt-6 space-y-3">
                  {copy.sideBullets.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-bold leading-6 text-slate-100">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-5 text-center md:flex-row md:gap-4">
                  <div className="hidden -space-x-3 rtl:space-x-reverse md:flex">
                    {socialProofProfiles.map((profile) => (
                      <div
                        key={profile}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-blue-950 bg-gradient-to-br from-blue-200 via-white to-emerald-200 text-xs font-black text-blue-900 shadow-lg dark:border-slate-950"
                      >
                        {profile}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-100 md:text-base">{copy.socialProof}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionLoader />}>
        <BeforeAfterSection />
        <ReviewsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PartnersSection />
      </Suspense>

      <Suspense fallback={<SectionCardLoader minHeight={360} />}>
        <WhyUsSection variant="landing" />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQSection />
      </Suspense>

      <div className="hidden lg:block">
        <Suspense fallback={<SectionLoader />}>
          <CoverageAreasSection />
        </Suspense>
      </div>

      <Suspense fallback={<SectionCardLoader minHeight={520} />}>
        <ContactSection variant="landing" />
      </Suspense>
    </Layout>
  );
};

export default Home;
