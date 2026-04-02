import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, ShieldCheck, Star } from 'lucide-react';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import HeroSection from '../components/sections/HeroSection';
import WhyUsSection from '../components/sections/WhyUsSection';

const PriceCalculator = lazy(() => import('../components/PriceCalculator'));
const OrderTracking = lazy(() => import('../components/OrderTracking'));
const BeforeAfterSection = lazy(() => import('../components/sections/BeforeAfterSection'));
const CoverageAreasSection = lazy(() => import('../components/sections/CoverageAreasSection'));
const ReviewsSection = lazy(() => import('../components/sections/ReviewsSection'));
const FAQSection = lazy(() => import('../components/sections/FAQSection'));
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

const socialProofProfiles = ['NA', 'SA', 'MK', 'FA'];

const SectionLoader = () => (
  <div className="flex justify-center py-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
  </div>
);

const SectionCardLoader = ({ minHeight = 320 }: { minHeight?: number }) => (
  <div className="px-4 py-8">
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-gray-100 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-900/80" style={{ minHeight }}>
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const trustLabels = isRTL
    ? {
        licensed: 'مرخص ومؤمن',
        rating: 'تقييم 4.9 على جوجل',
        availability: 'خدمة على مدار الساعة',
        certified: 'معايير جودة معتمدة',
        socialProof: '+1,500 عميل سعيد في الكويت',
      }
    : {
        licensed: 'Licensed & Insured',
        rating: '4.9 Google Rating',
        availability: '24/7 Availability',
        certified: 'ISO Certified',
        socialProof: '+1,500 happy clients in Kuwait',
      };

  return (
    <Layout variant="landing">
      <Seo title={t('seo.home.title')} description={t('seo.home.description')} />

      <HeroSection variant="landing" />

      <div className="overflow-hidden border-y border-gray-100 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-75 transition-all duration-500 hover:opacity-100 md:gap-20 dark:opacity-100">
            <div className="flex items-center gap-3 text-xl font-black text-blue-900 dark:text-slate-100">
              <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              {trustLabels.licensed}
            </div>
            <div className="flex items-center gap-3 text-xl font-black text-blue-900 dark:text-slate-100">
              <Star className="h-8 w-8 fill-yellow-500 text-yellow-500" />
              {trustLabels.rating}
            </div>
            <div className="flex items-center gap-3 text-xl font-black text-blue-900 dark:text-slate-100">
              <Clock className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
              {trustLabels.availability}
            </div>
            <div className="flex items-center gap-3 text-xl font-black text-blue-900 dark:text-slate-100">
              <Check className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              {trustLabels.certified}
            </div>
          </div>
        </div>
      </div>

      <WhyUsSection variant="landing" />

      <section className="relative overflow-hidden bg-blue-900 py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-400 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-400 blur-[120px]" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">{t('contact.title')}</h2>
            <p className="text-xl font-bold text-blue-100 md:text-2xl dark:text-slate-100">
              {isRTL
                ? 'خطوات بسيطة تفصلك عن الحصول على خدمة النظافة أو مكافحة الحشرات المناسبة في الكويت.'
                : 'Simple steps separate you from getting the right cleaning or pest control service in Kuwait.'}
            </p>
            <div className="flex flex-col items-center justify-center gap-6 pt-8 md:flex-row">
              <Link
                to="/booking"
                className="group flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white px-12 py-8 text-2xl font-black text-blue-900 shadow-2xl transition-all hover:bg-blue-50 dark:bg-slate-100 dark:hover:bg-white md:w-auto"
              >
                {t('hero.cta_booking')}
                {isRTL ? (
                  <ArrowLeft className="h-8 w-8 transition-transform group-hover:-translate-x-2" />
                ) : (
                  <ArrowLeft className="h-8 w-8 rotate-180 transition-transform group-hover:translate-x-2" />
                )}
              </Link>
              <div className="flex items-center gap-4 font-bold text-white">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {socialProofProfiles.map((profile) => (
                    <div
                      key={profile}
                      className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-900 bg-gradient-to-br from-blue-200 via-white to-emerald-200 text-sm font-black text-blue-900 shadow-lg"
                    >
                      {profile}
                    </div>
                  ))}
                </div>
                <span className="text-lg">{trustLabels.socialProof}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<SectionCardLoader minHeight={420} />}>
        <PriceCalculator initialType="cleaning" />
      </Suspense>
      <Suspense fallback={<SectionCardLoader minHeight={360} />}>
        <OrderTracking />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <BeforeAfterSection />
        <CoverageAreasSection />
        <ReviewsSection />
        <FAQSection />
      </Suspense>
      <Suspense fallback={<SectionCardLoader minHeight={520} />}>
        <ContactSection variant="landing" />
      </Suspense>
    </Layout>
  );
};

export default Home;
