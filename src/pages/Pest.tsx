import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import PriceCalculator from '../components/PriceCalculator';
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
  const { t } = useTranslation();
  const galleryItems = [
    { webp: '/images/pest-extermination-service.webp', png: '/images/pest-extermination-service.png', alt: t('gallery.items.pest_control') },
    { webp: '/images/pest-control-kuwait.webp', png: '/images/pest-control-kuwait.png', alt: t('gallery.items.pest_all') },
    { webp: '/images/pest-control-services-kuwait.webp', png: '/images/pest-control-services-kuwait.png', alt: t('gallery.items.pest_services') },
  ];

  return (
    <Layout variant="pest">
      <Seo title={t('seo.pest.title')} description={t('seo.pest.description')} />
      <HeroSection variant="pest" />
      <ServicesSection variant="pest" />
      <PriceCalculator initialType="pest" />
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
