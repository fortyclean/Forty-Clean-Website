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

const Cleaning = () => {
  const { t } = useTranslation();
  const galleryItems = [
    { webp: '/images/professional-cleaning-kuwait.webp', png: '/images/professional-cleaning-kuwait.png', alt: t('gallery.items.cleaning_home') },
    { webp: '/images/office-cleaning-service.webp', png: '/images/office-cleaning-service.png', alt: t('gallery.items.cleaning_office') },
    { webp: '/images/glass-cleaning-kuwait.webp', png: '/images/glass-cleaning-kuwait.png', alt: t('gallery.items.cleaning_glass') },
  ];

  return (
    <Layout variant="cleaning">
      <Seo title={t('seo.cleaning.title')} description={t('seo.cleaning.description')} />
      <HeroSection variant="cleaning" />
      <ServicesSection variant="cleaning" />
      <PriceCalculator initialType="cleaning" />
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
