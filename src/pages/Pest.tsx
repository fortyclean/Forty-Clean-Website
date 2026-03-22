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

const Pest = () => {
  const { t } = useTranslation();
  const galleryItems = [
    { webp: '/images/pest-extermination-service.webp', png: '/images/pest-extermination-service.png', alt: t('gallery.items.pest_control') },
    { webp: '/images/pest-control-kuwait.webp', png: '/images/pest-control-kuwait.png', alt: t('gallery.items.pest_all') },
    { webp: '/images/pest-control-services-kuwait.webp', png: '/images/pest-control-services-kuwait.png', alt: t('gallery.items.pest_services') },
  ];

  return (
    <Layout variant="pest">
      <Helmet>
        <title>{t('seo.pest.title')}</title>
        <meta name="description" content={t('seo.pest.description')} />
      </Helmet>
      <HeroSection variant="pest" />
      <ServicesSection variant="pest" />
      <PriceCalculator initialType="pest" />
      <GallerySection 
        title={t('gallery.title')} 
        subtitle={t('gallery.subtitle')} 
        items={galleryItems} 
      />
      <WhyUsSection variant="pest" />
      <StatsSection variant="pest" />
      <ContactSection variant="pest" />
    </Layout>
  );
};

export default Pest;
