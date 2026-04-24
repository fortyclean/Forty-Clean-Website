import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import DeferredSection from '../components/DeferredSection';

const GallerySection = lazy(() => import('../components/sections/GallerySection'));
const WhyUsSection = lazy(() => import('../components/sections/WhyUsSection'));
const StatsSection = lazy(() => import('../components/sections/StatsSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

const SectionLoader = () => (
  <div className="py-10 flex justify-center">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const Pest = () => {
  const { t, i18n } = useTranslation();
  const galleryItems = [
    { webp: '/images/pest-extermination-service.webp', png: '/images/pest-extermination-service.png', alt: t('gallery.items.pest_control') },
    { webp: '/images/pest-control-kuwait.webp', png: '/images/pest-control-kuwait.png', alt: t('gallery.items.pest_all') },
    { webp: '/images/pest-control-services-kuwait.webp', png: '/images/pest-control-services-kuwait.png', alt: t('gallery.items.pest_services') },
  ];

  return (
    <Layout variant="pest">
      <Seo
        title={t('seo.pest.title')}
        description={t('seo.pest.description')}
        canonical="https://www.fortyclean.com/pest"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "مكافحة الحشرات والقوارض في الكويت - شركة فورتي",
            "serviceType": "Pest Control Service",
            "provider": {
              "@type": "LocalBusiness",
              "name": "شركة فورتي للتنظيف ومكافحة الحشرات",
              "url": "https://www.fortyclean.com",
              "telephone": "+96569988979",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday", "Tuesday", "Wednesday", "Thursday",
                  "Friday", "Saturday", "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            },
            "areaServed": [
              { "@type": "City", "name": "Kuwait City" },
              { "@type": "City", "name": "Hawalli" },
              { "@type": "City", "name": "Farwaniya" },
              { "@type": "City", "name": "Ahmadi" },
              { "@type": "City", "name": "Mubarak Al-Kabeer" },
              { "@type": "City", "name": "Jahra" }
            ],
            "description": t('seo.pest.description'),
            "offers": {
              "@type": "Offer",
              "priceCurrency": "KWD",
              "availability": "https://schema.org/InStock"
            },
            "warranty": "ضمان 6 أشهر على جميع خدمات مكافحة الحشرات والقوارض"
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "الرئيسية",
                "item": "https://www.fortyclean.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "مكافحة الحشرات",
                "item": "https://www.fortyclean.com/pest"
              }
            ]
          }
        ]}
      />
      <HeroSection variant="pest" />
      <ServicesSection variant="pest" />
      {/* Internal link to Plans */}
      <section className="bg-blue-50 py-8 dark:bg-blue-950/20 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-base font-bold text-blue-900 dark:text-blue-200">
            {i18n.language === 'en'
              ? 'Want year-round pest protection? Check our subscription plans.'
              : 'تريد حماية دائمة من الحشرات طوال العام؟ اكتشف باقات الاشتراك.'}
          </p>
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
          >
            {i18n.language === 'en' ? 'View SHIELD Plans →' : 'اكتشف باقات SHIELD ←'}
          </Link>
        </div>
      </section>
      <section aria-labelledby="pricing-banner-title" className="bg-gray-50 py-12 dark:bg-slate-950 text-center">
        <div className="container mx-auto px-4">
          <h2 id="pricing-banner-title" className="text-2xl font-black text-blue-900 dark:text-white mb-4">
            {t('pricing_banner.pest_title')}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-xl mx-auto leading-relaxed">
            {t('pricing_banner.pest_desc')}
          </p>
          <Link
            to="/pricing"
            aria-label={t('pricing_banner.button')}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-black text-white shadow-xl transition-all hover:bg-blue-700 hover:scale-105"
          >
            {t('pricing_banner.button')}
          </Link>
        </div>
      </section>
      <DeferredSection fallback={<SectionLoader />} minHeight={520}>
        <Suspense fallback={<SectionLoader />}>
          <GallerySection 
            title={t('gallery.title')} 
            subtitle={t('gallery.subtitle')} 
            items={galleryItems} 
          />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<SectionLoader />} minHeight={520}>
        <Suspense fallback={<SectionLoader />}>
          <WhyUsSection variant="pest" />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<SectionLoader />} minHeight={420}>
        <Suspense fallback={<SectionLoader />}>
          <StatsSection variant="pest" />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<SectionLoader />} minHeight={520}>
        <Suspense fallback={<SectionLoader />}>
          <ContactSection variant="pest" />
        </Suspense>
      </DeferredSection>
    </Layout>
  );
};

export default Pest;
