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
import FAQSection from '../components/sections/FAQSection';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, Clock, ArrowLeft, Check } from 'lucide-react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Layout variant="landing">
      <Helmet>
        <title>{t('seo.home.title')}</title>
        <meta name="description" content={t('seo.home.description')} />
      </Helmet>
      
      <HeroSection variant="landing" />

      {/* Trust Signals Banner */}
      <div className="bg-white border-y border-gray-100 py-10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3 font-black text-xl text-blue-900">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              LICENSED & INSURED
            </div>
            <div className="flex items-center gap-3 font-black text-xl text-blue-900">
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              4.9 GOOGLE RATING
            </div>
            <div className="flex items-center gap-3 font-black text-xl text-blue-900">
              <Clock className="w-8 h-8 text-emerald-500" />
              24/7 AVAILABILITY
            </div>
            <div className="flex items-center gap-3 font-black text-xl text-blue-900">
              <Check className="w-8 h-8 text-blue-600" />
              ISO CERTIFIED
            </div>
          </div>
        </div>
      </div>

      <WhyUsSection variant="landing" />

      {/* High Conversion CTA Section */}
      <section className="py-24 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              جاهز للحصول على منزل نظيف وبيئة آمنة؟
            </h2>
            <p className="text-blue-100 text-xl md:text-2xl font-bold opacity-80">
              استخدم نظام الحجز الذكي الخاص بنا واحصل على تأكيد فوري في أقل من دقيقة
            </p>
            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <Link 
                to="/booking"
                className="w-full md:w-auto bg-white text-blue-900 px-12 py-8 rounded-[2rem] text-2xl font-black shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group"
              >
                احجز موعدك الآن
                {isRTL ? <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" /> : <ArrowLeft className="w-8 h-8 group-hover:translate-x-2 transition-transform rotate-180" />}
              </Link>
              <div className="flex items-center gap-4 text-white font-bold">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-900 bg-gray-200 overflow-hidden shadow-lg">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                </div>
                <span className="text-lg">+1,500 عميل سعيد في الكويت</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PriceCalculator initialType="cleaning" />
      <BeforeAfterSection />
      <CoverageAreasSection />
      <ReviewsSection />
      <FAQSection />
      <ContactSection variant="landing" />
    </Layout>
  );
};

export default Home;
