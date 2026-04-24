import Layout from '../components/Layout';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import TrackedContactLink from '../components/TrackedContactLink';
import { buildWhatsAppMessage, siteConfig } from '../config/site';

const Offers = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const heroCopy = isArabic
    ? {
        eyebrow: 'عروض محدودة لفترة قصيرة',
        title: 'عروض فورتي الأكثر طلبًا',
        subtitle: 'باقات واضحة وسريعة للحجز، مع سعر مبدئي مناسب وخيار تواصل مباشر عبر واتساب لتأكيد التفاصيل فورًا.',
        trust: ['أسعار افتتاحية واضحة', 'تنسيق سريع عبر واتساب', 'مناسبة للمنازل والمكاتب'],
        cardHint: 'احجز العرض الآن ودع الفريق يؤكد التفاصيل المناسبة لحالتك مباشرة.',
      }
    : {
        eyebrow: 'Limited-time service deals',
        title: 'Forty’s Most Requested Offers',
        subtitle: 'Clear starter packages with direct WhatsApp follow-up so you can confirm the right details quickly.',
        trust: ['Clear starter pricing', 'Fast WhatsApp follow-up', 'Suitable for homes and offices'],
        cardHint: 'Book this offer now and our team will confirm the right details for your case directly.',
      };

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
      whatsappText: buildWhatsAppMessage({
        language: i18n.language,
        service: t('offers.items.apt_cleaning.title'),
        intent: 'offer',
        details: i18n.language === 'ar' ? `السعر المعلن: 90 ${t('calculator.currency')}` : `Listed price: 90 ${t('calculator.currency')}`,
      }),
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
      whatsappText: buildWhatsAppMessage({
        language: i18n.language,
        service: t('offers.items.office_cleaning.title'),
        intent: 'offer',
        details: i18n.language === 'ar' ? `السعر المعلن: 100 ${t('calculator.currency')}` : `Listed price: 100 ${t('calculator.currency')}`,
      }),
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
      whatsappText: buildWhatsAppMessage({
        language: i18n.language,
        service: t('offers.items.pest_control.title'),
        intent: 'offer',
        details: i18n.language === 'ar' ? `السعر المعلن: 25 ${t('calculator.currency')}` : `Listed price: 25 ${t('calculator.currency')}`,
      }),
      buttonText: t('offers.items.pest_control.btn'),
      whatsappNumber: '69988979',
    },
  ];

  return (
    <Layout variant="offers">
      <Seo
        title={t('seo.offers.title')}
        description={t('seo.offers.description')}
        canonical="https://www.fortyclean.com/offers"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "خدمات التنظيف ومكافحة الحشرات",
            "name": "عروض فورتي الحصرية",
            "provider": {
              "@type": "LocalBusiness",
              "name": "شركة فورتي للتنظيف ومكافحة الحشرات",
              "url": "https://www.fortyclean.com",
              "telephone": "+96569988979"
            },
            "areaServed": { "@type": "Country", "name": "الكويت" },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "عروض فورتي",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "name": "تنظيف الشقق الفارغة والجديدة",
                  "price": "90",
                  "priceCurrency": "KWD",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "تنظيف المكاتب - 8 زيارات شهرياً",
                  "price": "100",
                  "priceCurrency": "KWD",
                  "availability": "https://schema.org/InStock"
                },
                {
                  "@type": "Offer",
                  "name": "مكافحة الحشرات",
                  "price": "25",
                  "priceCurrency": "KWD",
                  "availability": "https://schema.org/InStock"
                }
              ]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://www.fortyclean.com/" },
              { "@type": "ListItem", "position": 2, "name": "العروض", "item": "https://www.fortyclean.com/offers" }
            ]
          }
        ]}
      />
      <section className="gradient-bg relative overflow-hidden pb-20 pt-32">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-white backdrop-blur-md animate-fadeInUp">
              {heroCopy.eyebrow}
            </div>
            <h1 className="mb-6 animate-fadeInUp text-4xl font-black text-white md:text-6xl">{heroCopy.title}</h1>
            <p className="mx-auto max-w-2xl animate-fadeInUp text-xl font-medium text-white/90" style={{ animationDelay: '0.2s' }}>
              {heroCopy.subtitle}
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-center">
              {heroCopy.trust.map((item) => (
                <div key={item} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white/95 backdrop-blur-md">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="offer-card group animate-fadeInUp rounded-[2rem] border border-gray-100 bg-white p-8 shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 dark:border-slate-800 dark:bg-slate-900"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className={`badge ${offer.badgeType === 'hot' ? 'badge-hot' : offer.badgeType === 'best' ? 'badge-best' : 'badge-starter'} rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider`}>
                    {offer.badge}
                  </span>
                  <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${offer.badgeType === 'starter' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'}`}>
                    {offer.category}
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-black text-blue-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300">
                  {offer.title}
                </h2>
                <p className="mb-6 font-medium leading-relaxed text-gray-500 dark:text-slate-400">{offer.description}</p>

                <div className="mb-6 rounded-2xl bg-gray-50 p-6 dark:bg-slate-800">
                  <div className="price mb-1 text-4xl font-black text-blue-600">
                    {offer.price} <span className="text-sm font-bold text-gray-400 dark:text-slate-500">{offer.priceUnit}</span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed text-gray-400 dark:text-slate-500">{offer.subtext}</p>
                </div>

                <div className="mb-8 space-y-4">
                  {offer.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
                        <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-300" />
                      </div>
                      <span className="text-sm font-bold leading-relaxed text-gray-600 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="mb-5 text-sm font-bold leading-relaxed text-gray-500 dark:text-slate-400">
                  {heroCopy.cardHint}
                </p>

                <TrackedContactLink
                  href={siteConfig.links.whatsapp(offer.whatsappNumber, offer.whatsappText)}
                  channel="whatsapp"
                  section="offers"
                  service={offer.whatsappNumber === '51004910' ? 'cleaning' : 'pest'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gradient-btn flex w-full items-center justify-center gap-3 rounded-2xl py-4 font-black text-white shadow-xl transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>{offer.buttonText}</span>
                </TrackedContactLink>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 text-slate-50 dark:text-slate-950">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" />
          </svg>
        </div>
      </section>
    </Layout>
  );
};

export default Offers;
