import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Offers = () => {
  const { t } = useTranslation();

  const offers = [
    {
      badge: t('offers.badges.hot'),
      badgeType: 'hot',
      category: t('offers.categories.cleaning'),
      title: t('offers.items.apt_cleaning.title'),
      description: t('offers.items.apt_cleaning.desc'),
      price: `90 ${t('calculator.currency')}`,
      priceUnit: t('offers.items.apt_cleaning.price_unit'),
      subtext: t('offers.items.apt_cleaning.subtext'),
      features: t('offers.items.apt_cleaning.features', { returnObjects: true }) as string[],
      whatsappText: t('offers.items.apt_cleaning.wa'),
      buttonText: t('offers.items.apt_cleaning.btn'),
      whatsappNumber: '51004910',
    },
    {
      badge: t('offers.badges.best'),
      badgeType: 'best',
      category: t('offers.categories.office'),
      title: t('offers.items.office_cleaning.title'),
      description: t('offers.items.office_cleaning.desc'),
      price: `100 ${t('calculator.currency')}`,
      priceUnit: t('offers.items.office_cleaning.price_unit'),
      subtext: t('offers.items.office_cleaning.subtext'),
      features: t('offers.items.office_cleaning.features', { returnObjects: true }) as string[],
      whatsappText: t('offers.items.office_cleaning.wa'),
      buttonText: t('offers.items.office_cleaning.btn'),
      whatsappNumber: '51004910',
    },
    {
      badge: t('offers.badges.starter'),
      badgeType: 'starter',
      category: t('offers.categories.pest'),
      title: t('offers.items.pest_control.title'),
      description: t('offers.items.pest_control.desc'),
      price: `25 ${t('calculator.currency')}`,
      priceUnit: t('offers.items.pest_control.price_unit'),
      subtext: t('offers.items.pest_control.subtext'),
      features: t('offers.items.pest_control.features', { returnObjects: true }) as string[],
      whatsappText: t('offers.items.pest_control.wa'),
      buttonText: t('offers.items.pest_control.btn'),
      whatsappNumber: '69988979',
    },
  ];

  return (
    <Layout variant="offers">
      <Helmet>
        <title>{t('seo.offers.title')}</title>
        <meta name="description" content={t('seo.offers.description')} />
      </Helmet>
      <section className="pt-32 pb-20 gradient-bg relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-bold mb-4 backdrop-blur-md animate-fadeInUp">
              {t('offers.badge_limited')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fadeInUp">{t('offers.title')}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fadeInUp font-medium" style={{ animationDelay: '0.2s' }}>
              {t('offers.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <div key={index} className="offer-card group animate-fadeInUp bg-white rounded-[2rem] p-8 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-100" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <div className="flex items-center justify-between mb-6">
                  <span className={`badge ${offer.badgeType === 'hot' ? 'badge-hot' : offer.badgeType === 'best' ? 'badge-best' : 'badge-starter'} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider`}>
                    {offer.badge}
                  </span>
                  <span className={`text-xs font-bold ${offer.badgeType === 'starter' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'} px-4 py-1.5 rounded-full`}>
                    {offer.category}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">{offer.title}</h2>
                <p className="text-gray-500 mb-6 leading-relaxed font-medium">{offer.description}</p>
                
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="price text-4xl font-black text-blue-600 mb-1">
                    {offer.price} <span className="text-sm font-bold text-gray-400">{offer.priceUnit}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold leading-relaxed">{offer.subtext}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {offer.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-gray-600 text-sm font-bold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <a
                  href={`https://wa.me/965${offer.whatsappNumber}?text=${encodeURIComponent(offer.whatsappText)}`}
                  className="gradient-btn w-full text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>{offer.buttonText}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
