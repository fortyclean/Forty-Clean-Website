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

const Cleaning = () => {
  const { t } = useTranslation();
  const galleryItems = [
    { webp: '/images/professional-cleaning-kuwait.webp', png: '/images/professional-cleaning-kuwait.png', alt: t('gallery.items.cleaning_home') },
    { webp: '/images/office-cleaning-service.webp', png: '/images/office-cleaning-service.png', alt: t('gallery.items.cleaning_office') },
    { webp: '/images/glass-cleaning-kuwait.webp', png: '/images/glass-cleaning-kuwait.png', alt: t('gallery.items.cleaning_glass') },
  ];

  return (
    <Layout variant="cleaning">
      <Seo
        title={t('seo.cleaning.title')}
        description={t('seo.cleaning.description')}
        canonical="https://www.fortyclean.com/cleaning"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "خدمات التنظيف في الكويت - شركة فورتي",
            "serviceType": "Cleaning Service",
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
            "description": t('seo.cleaning.description'),
            "offers": {
              "@type": "Offer",
              "priceCurrency": "KWD",
              "availability": "https://schema.org/InStock"
            }
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
                "name": "خدمات النظافة",
                "item": "https://www.fortyclean.com/cleaning"
              }
            ]
          }
        ]}
      />
      <HeroSection variant="cleaning" />
      <ServicesSection variant="cleaning" />
      {/* Internal link to Plans */}
      <section className="bg-blue-50 py-8 dark:bg-blue-950/20 text-center">
        <div className="container mx-auto px-4">
          <p className="mb-3 text-base font-bold text-blue-900 dark:text-blue-200">
            {t('language') === 'en'
              ? 'Looking for a recurring cleaning subscription?'
              : 'تبحث عن اشتراك تنظيف دوري بسعر ثابت؟'}
          </p>
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
          >
            {t('language') === 'en' ? 'View Subscription Plans →' : 'اكتشف باقات الاشتراك ←'}
          </Link>
        </div>
      </section>
      <section aria-labelledby="pricing-banner-title" className="bg-gray-50 py-12 dark:bg-slate-950 text-center">
        <div className="container mx-auto px-4">
          <h2 id="pricing-banner-title" className="text-2xl font-black text-blue-900 dark:text-white mb-4">
            {t('pricing_banner.cleaning_title')}
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6 max-w-xl mx-auto leading-relaxed">
            {t('pricing_banner.cleaning_desc')}
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
          <WhyUsSection variant="cleaning" />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<SectionLoader />} minHeight={420}>
        <Suspense fallback={<SectionLoader />}>
          <StatsSection variant="cleaning" />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<SectionLoader />} minHeight={520}>
        <Suspense fallback={<SectionLoader />}>
          <ContactSection variant="cleaning" />
        </Suspense>
      </DeferredSection>
    </Layout>
  );
};

export default Cleaning;
