import { Calculator, Check, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import PriceCalculator from '../components/PriceCalculator';
import Seo from '../components/Seo';

const Pricing = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const copy = isArabic
    ? {
        title: 'حاسبة الأسعار التقديرية',
        subtitle:
          'احصل على تصور أولي واضح للسعر قبل الاتصال أو واتساب، ثم أكمل الطلب مباشرة من نفس الصفحة إذا كان التقدير مناسبًا لك.',
        badge: 'تقدير أولي سريع قبل التواصل',
        seoTitle: 'حاسبة الأسعار التقديرية | فورتي',
        seoDescription: 'احسب السعر التقديري لخدمات التنظيف ومكافحة الحشرات في الكويت عبر حاسبة فورتي السريعة.',
        cards: [
          {
            icon: Calculator,
            title: 'تقدير سريع وواضح',
            text: 'أدخل تفاصيل الخدمة لتحصل على سعر تقديري مباشر يساعدك على اتخاذ القرار بسرعة.',
          },
          {
            icon: Clock,
            title: 'مناسبة قبل التواصل',
            text: 'مفيدة لمن يريد مقارنة أولية أو معرفة التكلفة التقريبية قبل الاتصال بالفريق.',
          },
          {
            icon: ShieldCheck,
            title: 'استكمال الطلب مباشرة',
            text: 'بعد ظهور التقدير يمكنك الإرسال عبر واتساب أو متابعة الطلب بالتفاصيل الكاملة فورًا.',
          },
        ],
        badges: ['تنظيف منازل ومكاتب', 'مكافحة حشرات', 'سعر تقديري مباشر'],
      }
    : {
        title: 'Estimated Pricing Calculator',
        subtitle:
          'Get a clear initial price estimate before calling or opening WhatsApp, then continue the request directly from the same page if it suits you.',
        badge: 'Quick estimate before contact',
        seoTitle: 'Estimated Pricing Calculator | Forty',
        seoDescription: 'Estimate pricing for cleaning and pest control services in Kuwait with Forty’s quick calculator.',
        cards: [
          {
            icon: Calculator,
            title: 'Fast, clear estimate',
            text: 'Enter the service details and receive an instant estimate that helps you decide faster.',
          },
          {
            icon: Clock,
            title: 'Useful before contacting',
            text: 'Ideal for visitors who want an initial cost range before calling or chatting with the team.',
          },
          {
            icon: ShieldCheck,
            title: 'Continue instantly',
            text: 'Once you see the estimate, you can move straight to WhatsApp or complete the request in full.',
          },
        ],
        badges: ['Home & office cleaning', 'Pest control', 'Instant estimate'],
      };

  return (
    <Layout variant="pricing">
      <Seo
        title={copy.seoTitle}
        description={copy.seoDescription}
        canonical="https://www.fortyclean.com/pricing"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": copy.seoTitle,
            "description": copy.seoDescription,
            "mainEntity": {
              "@type": "Service",
              "name": "Cleaning and Pest Control Estimation Calculator",
              "provider": {
                "@type": "LocalBusiness",
                "name": "شركة فورتي للتنظيف ومكافحة الحشرات"
              }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://www.fortyclean.com/" },
              { "@type": "ListItem", "position": 2, "name": "حاسبة الأسعار", "item": "https://www.fortyclean.com/pricing" }
            ]
          }
        ]}
      />

      <div className="bg-gray-50 pb-16 pt-28 dark:bg-slate-950 md:pb-20 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-200 md:text-sm">
                <Sparkles className="h-4 w-4" />
                {copy.badge}
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight text-blue-950 dark:text-white md:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-4 text-lg font-bold leading-8 text-slate-600 dark:text-slate-300 md:text-2xl">
                {copy.subtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{card.title}</h2>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-500 dark:text-slate-400">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {copy.badges.map((badge) => (
                <div
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PriceCalculator initialType="cleaning" />
    </Layout>
  );
};

export default Pricing;
