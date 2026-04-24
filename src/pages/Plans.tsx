import { useState } from 'react';
import { MessageCircle, Shield, Sparkles, Check, Star, Crown, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import TrackedContactLink from '../components/TrackedContactLink';
import { buildWhatsAppMessage, siteConfig } from '../config/site';

type PlanTab = 'pest' | 'cleaning' | 'combo';

const Plans = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState<PlanTab>('pest');
  const [billingYearly, setBillingYearly] = useState(true);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs: { id: PlanTab; label: string; icon: string }[] = [
    { id: 'pest',     label: t('plans.tab_pest'),     icon: '🛡️' },
    { id: 'cleaning', label: t('plans.tab_cleaning'), icon: '✨' },
    { id: 'combo',    label: t('plans.tab_combo'),    icon: '🔥' },
  ];

  // ── Pest plans ────────────────────────────────────────────────────────────
  const pestPlans = [
    {
      id: 'silver',
      icon: Shield,
      badge: t('plans.pest_silver_badge'),
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      name: t('plans.pest_silver_name'),
      sub: t('plans.pest_silver_sub'),
      tag: t('plans.pest_silver_tag'),
      priceMonthly: 15,
      priceYearly: 165,
      saving: 35,
      highlight: false,
      border: 'border-slate-200 dark:border-slate-700',
      btn: 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600',
      suitable: t('plans.pest_silver_suitable'),
      features: [
        t('plans.pest_silver_f1'), t('plans.pest_silver_f2'), t('plans.pest_silver_f3'),
        t('plans.pest_silver_f4'), t('plans.pest_silver_f5'), t('plans.pest_silver_f6'),
      ],
      waService: `${t('plans.pest_silver_name')} — ${t('plans.pest_silver_sub')}`,
    },
    {
      id: 'gold',
      icon: Star,
      badge: t('plans.pest_gold_badge'),
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      name: t('plans.pest_gold_name'),
      sub: t('plans.pest_gold_sub'),
      tag: t('plans.pest_gold_tag'),
      priceMonthly: 35,
      priceYearly: 385,
      saving: 40,
      highlight: true,
      border: 'border-blue-500 dark:border-blue-400',
      btn: 'gradient-btn text-white',
      suitable: t('plans.pest_gold_suitable'),
      features: [
        t('plans.pest_gold_f1'), t('plans.pest_gold_f2'), t('plans.pest_gold_f3'),
        t('plans.pest_gold_f4'), t('plans.pest_gold_f5'), t('plans.pest_gold_f6'),
        t('plans.pest_gold_f7'),
      ],
      waService: `${t('plans.pest_gold_name')} — ${t('plans.pest_gold_sub')}`,
    },
    {
      id: 'platinum',
      icon: Crown,
      badge: t('plans.pest_platinum_badge'),
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      name: t('plans.pest_platinum_name'),
      sub: t('plans.pest_platinum_sub'),
      tag: t('plans.pest_platinum_tag'),
      priceMonthly: 70,
      priceYearly: 770,
      saving: 45,
      highlight: false,
      border: 'border-purple-300 dark:border-purple-700',
      btn: 'bg-purple-700 hover:bg-purple-800 text-white',
      suitable: t('plans.pest_platinum_suitable'),
      features: [
        t('plans.pest_platinum_f1'), t('plans.pest_platinum_f2'), t('plans.pest_platinum_f3'),
        t('plans.pest_platinum_f4'), t('plans.pest_platinum_f5'), t('plans.pest_platinum_f6'),
        t('plans.pest_platinum_f7'), t('plans.pest_platinum_f8'),
      ],
      waService: `${t('plans.pest_platinum_name')} — ${t('plans.pest_platinum_sub')}`,
    },
  ];

  // ── Post-construction cleaning plans ─────────────────────────────────────
  const cleaningPlans = [
    {
      id: 'basic',
      icon: Sparkles,
      badge: t('plans.clean_basic_badge'),
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
      name: t('plans.clean_basic_name'),
      sub: t('plans.clean_basic_sub'),
      tag: t('plans.clean_basic_tag'),
      price: 90,
      priceNote: isAr ? 'يبدأ من' : 'Starting from',
      highlight: false,
      border: 'border-slate-200 dark:border-slate-700',
      btn: 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600',
      suitable: t('plans.clean_basic_suitable'),
      features: [
        t('plans.clean_basic_f1'), t('plans.clean_basic_f2'), t('plans.clean_basic_f3'),
        t('plans.clean_basic_f4'), t('plans.clean_basic_f5'),
      ],
      waService: `${t('plans.clean_basic_name')} — ${t('plans.clean_basic_sub')}`,
    },
    {
      id: 'premium',
      icon: Star,
      badge: t('plans.clean_premium_badge'),
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      name: t('plans.clean_premium_name'),
      sub: t('plans.clean_premium_sub'),
      tag: t('plans.clean_premium_tag'),
      price: 150,
      priceNote: isAr ? 'يبدأ من' : 'Starting from',
      highlight: true,
      border: 'border-blue-500 dark:border-blue-400',
      btn: 'gradient-btn text-white',
      suitable: t('plans.clean_premium_suitable'),
      features: [
        t('plans.clean_premium_f1'), t('plans.clean_premium_f2'), t('plans.clean_premium_f3'),
        t('plans.clean_premium_f4'), t('plans.clean_premium_f5'), t('plans.clean_premium_f6'),
      ],
      waService: `${t('plans.clean_premium_name')} — ${t('plans.clean_premium_sub')}`,
    },
  ];

  // ── Combo plans ───────────────────────────────────────────────────────────
  const comboPlans = [
    {
      id: 'family',
      icon: Zap,
      badge: t('plans.combo_family_badge'),
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
      name: t('plans.combo_family_name'),
      sub: t('plans.combo_family_sub'),
      tag: t('plans.combo_family_tag'),
      price: 110,
      saving: 30,
      highlight: true,
      border: 'border-orange-400 dark:border-orange-500',
      btn: 'bg-orange-500 hover:bg-orange-600 text-white',
      suitable: t('plans.combo_family_suitable'),
      features: [
        t('plans.combo_family_f1'), t('plans.combo_family_f2'), t('plans.combo_family_f3'),
        t('plans.combo_family_f4'), t('plans.combo_family_f5'),
      ],
      waService: `${t('plans.combo_family_name')} — ${t('plans.combo_family_sub')}`,
    },
    {
      id: 'royal',
      icon: Crown,
      badge: t('plans.combo_royal_badge'),
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
      name: t('plans.combo_royal_name'),
      sub: t('plans.combo_royal_sub'),
      tag: t('plans.combo_royal_tag'),
      price: 280,
      saving: 35,
      highlight: false,
      border: 'border-purple-300 dark:border-purple-700',
      btn: 'bg-purple-700 hover:bg-purple-800 text-white',
      suitable: t('plans.combo_royal_suitable'),
      features: [
        t('plans.combo_royal_f1'), t('plans.combo_royal_f2'), t('plans.combo_royal_f3'),
        t('plans.combo_royal_f4'), t('plans.combo_royal_f5'), t('plans.combo_royal_f6'),
      ],
      waService: `${t('plans.combo_royal_name')} — ${t('plans.combo_royal_sub')}`,
    },
  ];

  const activePlans =
    activeTab === 'pest' ? pestPlans :
    activeTab === 'cleaning' ? cleaningPlans :
    comboPlans;

  // ── Seasonal packages ─────────────────────────────────────────────────────
  const seasonal = [
    { emoji: '☀️', title: isAr ? 'حزمة الصيف' : 'Summer Shield',    desc: isAr ? 'مكافحة حشرات مكثفة + تنظيف مكيفات' : 'Intensive pest control + AC cleaning',          price: isAr ? 'تبدأ من 80 د.ك' : 'From 80 KWD', period: t('plans.seasonal_period_summer') },
    { emoji: '🌙', title: isAr ? 'حزمة رمضان' : 'Ramadan Ready',    desc: isAr ? 'نظافة عميقة + مكافحة + تجهيز ديوانية' : 'Deep clean + pest control + majlis prep',    price: isAr ? 'تبدأ من 90 د.ك' : 'From 90 KWD', period: t('plans.seasonal_period_ramadan') },
    { emoji: '✈️', title: isAr ? 'العودة من السفر' : 'Welcome Home', desc: isAr ? 'تنظيف شامل + تهوية + فحص حشرات' : 'Full clean + ventilation + pest inspection', price: isAr ? 'تبدأ من 70 د.ك' : 'From 70 KWD', period: t('plans.seasonal_period_travel') },
  ];

  return (
    <Layout variant="offers">
      <Seo
        title={t('plans.seo_title')}
        description={t('plans.seo_desc')}
        canonical="https://www.fortyclean.com/plans"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": isAr ? "باقات مكافحة الحشرات — فورتي الكويت" : "Pest Control Plans — Forty Kuwait",
            "itemListElement": [
              {
                "@type": "ListItem", "position": 1,
                "item": {
                  "@type": "Offer",
                  "name": isAr ? "SHIELD SILVER — الحماية الأساسية" : "SHIELD SILVER — Basic Protection",
                  "price": "165", "priceCurrency": "KWD",
                  "description": isAr ? "4 زيارات سنوية، ضمان سنوي، مناسب للشقق" : "4 annual visits, full guarantee, ideal for apartments",
                  "seller": { "@type": "LocalBusiness", "name": "شركة فورتي للتنظيف ومكافحة الحشرات" }
                }
              },
              {
                "@type": "ListItem", "position": 2,
                "item": {
                  "@type": "Offer",
                  "name": isAr ? "SHIELD GOLD — الحماية المتقدمة" : "SHIELD GOLD — Advanced Protection",
                  "price": "385", "priceCurrency": "KWD",
                  "description": isAr ? "6 زيارات سنوية، فحص الحديقة، مناسب للفلل" : "6 annual visits, garden inspection, ideal for villas",
                  "seller": { "@type": "LocalBusiness", "name": "شركة فورتي للتنظيف ومكافحة الحشرات" }
                }
              },
              {
                "@type": "ListItem", "position": 3,
                "item": {
                  "@type": "Offer",
                  "name": isAr ? "SHIELD PLATINUM — الحماية الشاملة VIP" : "SHIELD PLATINUM — Full VIP Protection",
                  "price": "770", "priceCurrency": "KWD",
                  "description": isAr ? "12 زيارة سنوية، مدير حساب مخصص، ضمان مدى الحياة" : "12 annual visits, dedicated account manager, lifetime guarantee",
                  "seller": { "@type": "LocalBusiness", "name": "شركة فورتي للتنظيف ومكافحة الحشرات" }
                }
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": isAr ? "الرئيسية" : "Home", "item": "https://www.fortyclean.com/" },
              { "@type": "ListItem", "position": 2, "name": isAr ? "الباقات والأسعار" : "Plans & Pricing", "item": "https://www.fortyclean.com/plans" }
            ]
          }
        ]}
      />

      {/* ── Hero ── */}
      <section className="gradient-bg relative overflow-hidden pb-16 pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute right-10 top-10 h-72 w-72 rounded-full border-2 border-white" />
          <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full border-2 border-white" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md">
            {t('plans.hero_badge')}
          </div>
          <h1 className="mb-4 text-4xl font-black text-white md:text-6xl">{t('plans.hero_title')}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-white/90 md:text-xl">{t('plans.hero_subtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[t('plans.trust_1'), t('plans.trust_2'), t('plans.trust_3'), t('plans.trust_4')].map((b) => (
              <span key={b} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Tabs + Toggle ── */}
      <section className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex rounded-2xl border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-900">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-600 hover:text-blue-600 dark:text-slate-400'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'pest' && (
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${!billingYearly ? 'text-blue-600' : 'text-slate-400'}`}>{t('plans.billing_monthly')}</span>
                <button
                  onClick={() => setBillingYearly(!billingYearly)}
                  className={`relative h-7 w-14 rounded-full transition-colors ${billingYearly ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${billingYearly ? (isAr ? 'left-1' : 'right-1') : (isAr ? 'right-1' : 'left-1')}`} />
                </button>
                <span className={`text-sm font-bold ${billingYearly ? 'text-blue-600' : 'text-slate-400'}`}>
                  {t('plans.billing_yearly')}{' '}
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {t('plans.billing_save')}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Plans Grid ── */}
      <section className="bg-gray-50 py-16 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className={`mx-auto grid gap-6 ${activePlans.length === 3 ? 'max-w-6xl lg:grid-cols-3' : 'max-w-4xl lg:grid-cols-2'}`}>
            {activePlans.map((plan) => {
              const Icon = plan.icon;

              // Price display logic
              let displayPrice: number;
              let priceLabel: string;
              let priceNote: string | undefined;

              if (activeTab === 'pest') {
                const p = plan as typeof pestPlans[0];
                displayPrice = billingYearly ? p.priceYearly : p.priceMonthly;
                priceLabel = billingYearly ? t('plans.price_yearly') : t('plans.price_monthly');
              } else {
                const p = plan as typeof cleaningPlans[0] | typeof comboPlans[0];
                displayPrice = p.price;
                priceLabel = isAr ? 'يبدأ من' : 'Starting from';
                priceNote = plan.suitable;
              }

              const waMsg = buildWhatsAppMessage({
                language: i18n.language,
                service: plan.waService,
                intent: 'offer',
                details: `${isAr ? 'السعر' : 'Price'}: ${displayPrice} ${isAr ? 'د.ك' : 'KWD'} — ${plan.suitable}`,
              });

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-[2rem] border-2 bg-white p-8 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 ${plan.border} ${plan.highlight ? 'ring-2 ring-blue-500/30 dark:ring-blue-400/20' : ''}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-blue-600 px-5 py-1.5 text-xs font-black text-white shadow-lg shadow-blue-600/30">
                        {t('plans.most_popular')}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${plan.badgeColor}`}>{plan.badge}</span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h2>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{plan.sub}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.tag}</p>
                  </div>

                  <div className="mb-6 rounded-2xl bg-gray-50 p-5 dark:bg-slate-800/60">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-blue-600 dark:text-blue-400">{displayPrice}</span>
                      <span className="mb-1 text-lg font-bold text-slate-500">{isAr ? 'د.ك' : 'KWD'}</span>
                      <span className="mb-1 text-sm text-slate-400">/ {priceLabel}</span>
                    </div>
                    {'saving' in plan && plan.saving && (
                      <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ {t('plans.saving_label', { pct: plan.saving })}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">{priceNote ?? plan.suitable}</p>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium leading-5 text-slate-600 dark:text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <TrackedContactLink
                    href={siteConfig.links.whatsapp(siteConfig.contact.primaryPhone, waMsg)}
                    channel="whatsapp"
                    section="plans"
                    service={activeTab === 'cleaning' ? 'cleaning' : 'pest'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black shadow-lg transition-all hover:scale-[1.02] ${plan.btn}`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {t('plans.subscribe_btn')}
                  </TrackedContactLink>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-slate-400 dark:text-slate-500">{t('plans.footer_note')}</p>
        </div>
      </section>

      {/* ── Seasonal Packages ── */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-3 text-3xl font-black text-blue-900 dark:text-white">{t('plans.seasonal_title')}</h2>
            <p className="mb-10 text-slate-500 dark:text-slate-400">{t('plans.seasonal_subtitle')}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {seasonal.map((pkg) => (
                <div key={pkg.title} className={`rounded-[1.5rem] border border-gray-100 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-800/50 ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className="mb-3 text-3xl">{pkg.emoji}</div>
                  <h3 className="mb-1 text-lg font-black text-slate-900 dark:text-white">{pkg.title}</h3>
                  <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{pkg.desc}</p>
                  <p className="text-base font-black text-blue-600 dark:text-blue-400">{pkg.price}</p>
                  <p className="text-xs text-slate-400">{pkg.period}</p>
                </div>
              ))}
            </div>
            <TrackedContactLink
              href={siteConfig.links.whatsapp(
                siteConfig.contact.primaryPhone,
                buildWhatsAppMessage({ language: i18n.language, service: isAr ? 'الحزم الموسمية' : 'Seasonal Packages', intent: 'quote' })
              )}
              channel="whatsapp"
              section="plans-seasonal"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white shadow-xl transition-all hover:bg-blue-700 hover:scale-[1.02]"
            >
              <MessageCircle className="h-5 w-5" />
              {t('plans.seasonal_cta')}
            </TrackedContactLink>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Plans;
