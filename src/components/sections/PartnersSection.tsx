import { Building2, Factory, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PartnersSection = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const copy = isArabic
    ? {
        badge: 'شركاؤنا',
        title: 'جهات تشرفنا بخدمتها وثقت بفورتي',
        subtitle:
          'نعمل مع جهات تشغيلية وتجارية حقيقية داخل الكويت، ونعتز بالثقة التي منحتها لنا هذه الجهات في المتابعة وجودة التنفيذ.',
        items: [
          {
            title: 'مطعم عبير',
            subtitle: 'قطاع المطاعم والخدمة',
            note: 'تنسيق ومتابعة لخدمات النظافة بما يناسب بيئة العمل اليومية.',
            icon: UtensilsCrossed,
          },
          {
            title: 'الشركة الكويتية الأهلية للألمنيوم',
            subtitle: 'ميناء الشعيبة',
            note: 'خدمة لموقع تشغيلي وصناعي مع احتياج للالتزام والترتيب في التنفيذ.',
            icon: Factory,
          },
          {
            title: 'شركاء من قطاعات تشغيلية وتجارية',
            subtitle: 'مطاعم، مواقع عمل، ومقار تشغيل',
            note: 'ونواصل التوسع مع جهات تبحث عن خدمة سريعة وموثوقة داخل الكويت.',
            icon: Building2,
          },
        ],
      }
    : {
        badge: 'Our partners',
        title: 'Trusted by real organizations we are proud to serve',
        subtitle:
          'We work with real commercial and operational clients in Kuwait, and we value the trust they place in Forty for service quality and follow-up.',
        items: [
          {
            title: 'Abeer Restaurant',
            subtitle: 'Restaurant & service sector',
            note: 'Coordinated cleaning support that fits a fast-moving daily service environment.',
            icon: UtensilsCrossed,
          },
          {
            title: 'Kuwaiti National Ahlia Aluminum Company',
            subtitle: 'Shuaiba Port',
            note: 'Support for an operational industrial site that requires consistency and discipline in execution.',
            icon: Factory,
          },
          {
            title: 'Additional commercial & operational partners',
            subtitle: 'Restaurants, work sites, and operating facilities',
            note: 'We continue to grow with organizations looking for fast, reliable service in Kuwait.',
            icon: Building2,
          },
        ],
      };

  return (
    <section className="bg-white py-12 dark:bg-slate-900 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-200 md:text-sm">
            {copy.badge}
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-blue-950 dark:text-white md:text-5xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base font-bold leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
            {copy.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-3">
          {copy.items.map((item) => (
            <div
              key={item.title}
              className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-blue-800 dark:hover:bg-slate-950"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <item.icon className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white md:text-xl">{item.title}</h3>
                <p className="text-sm font-black text-blue-700 dark:text-blue-300">{item.subtitle}</p>
                <p className="text-sm font-bold leading-7 text-slate-500 dark:text-slate-400">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
