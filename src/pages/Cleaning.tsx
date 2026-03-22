import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import HeroSection from '../components/sections/HeroSection';
import GallerySection from '../components/sections/GallerySection';
import WhyUsSection from '../components/sections/WhyUsSection';
import StatsSection from '../components/sections/StatsSection';
import ContactSection from '../components/sections/ContactSection';
import ServicesSection from '../components/sections/ServicesSection';
import PriceCalculator from '../components/PriceCalculator';

const Cleaning = () => {
  const { t } = useTranslation();
  const galleryItems = [
    { webp: '/images/professional-cleaning-kuwait.webp', png: '/images/professional-cleaning-kuwait.png', alt: t('gallery.items.cleaning_home') },
    { webp: '/images/office-cleaning-service.webp', png: '/images/office-cleaning-service.png', alt: t('gallery.items.cleaning_office') },
    { webp: '/images/glass-cleaning-kuwait.webp', png: '/images/glass-cleaning-kuwait.png', alt: t('gallery.items.cleaning_glass') },
  ];

  return (
    <Layout variant="cleaning">
      <Helmet>
        <title>{t('seo.cleaning.title')}</title>
        <meta name="description" content={t('seo.cleaning.description')} />
      </Helmet>
      <HeroSection variant="cleaning" />
      <ServicesSection variant="cleaning" />
      <PriceCalculator initialType="cleaning" />
      <GallerySection 
        title={t('gallery.title')} 
        subtitle={t('gallery.subtitle')} 
        items={galleryItems} 
      />
      <WhyUsSection variant="cleaning" />
      <StatsSection variant="cleaning" />
      <ContactSection variant="cleaning" />
    </Layout>
  );
};

export default Cleaning;
