import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/sections/HeroSection';
import WhyUsSection from '../components/sections/WhyUsSection';
import ContactSection from '../components/sections/ContactSection';
import Layout from '../components/Layout';
import PriceCalculator from '../components/PriceCalculator';
import BeforeAfterSection from '../components/sections/BeforeAfterSection';
import CoverageAreasSection from '../components/sections/CoverageAreasSection';
import ReviewsSection from '../components/sections/ReviewsSection';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Layout variant="landing">
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
      </Helmet>
      <HeroSection variant="landing" />
      <WhyUsSection variant="landing" />
      <PriceCalculator initialType="cleaning" />
      <BeforeAfterSection />
      <CoverageAreasSection />
      <ReviewsSection />
      <ContactSection variant="landing" />
    </Layout>
  );
};

export default Home;
