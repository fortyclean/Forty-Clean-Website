import { Home, Building2, SprayCan, ShieldCheck, Bug, Rat, Droplets, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildWhatsAppMessage, siteConfig } from '../../config/site';
import { useReveal } from '../../hooks/useReveal';
import TrackedContactLink from '../TrackedContactLink';

interface ServicesSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

type ServiceCard = {
  icon: typeof Home;
  title: string;
  description: string;
  link: string;
  serviceType?: 'cleaning' | 'pest';
};

const ServicesSection = ({ variant = 'landing' }: ServicesSectionProps) => {
  const { t, i18n } = useTranslation();
  const { sectionRef } = useReveal();
  const lang = i18n.language;

  const getServices = (): ServiceCard[] => {
    // ... same as before
    if (variant === 'landing') {
      return [
        {
          icon: Home,
          title: t('services.items.home_cleaning.title'),
          description: t('services.items.home_cleaning.desc'),
          link: '#cleaning',
        },
        {
          icon: Bug,
          title: t('services.items.pest_control.title'),
          description: t('services.items.pest_control.desc'),
          link: '#pest',
        },
        {
          icon: Rat,
          title: t('services.items.rodent_control.title'),
          description: t('services.items.rodent_control.desc'),
          link: '#pest',
        },
        {
          icon: Building2,
          title: t('services.items.office_cleaning.title'),
          description: t('services.items.office_cleaning.desc'),
          link: '#cleaning',
        },
      ];
    } else if (variant === 'cleaning') {
      return [
        {
          icon: Home,
          title: t('services.items.home_cleaning.title'),
          description: t('services.items.home_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.home_cleaning.title'), intent: 'quote' })),
          serviceType: 'cleaning',
        },
        {
          icon: Building2,
          title: t('services.items.office_cleaning.title'),
          description: t('services.items.office_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.office_cleaning.title'), intent: 'quote' })),
          serviceType: 'cleaning',
        },
        {
          icon: SprayCan,
          title: t('services.items.building_cleaning.title'),
          description: t('services.items.building_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.building_cleaning.title'), intent: 'quote' })),
          serviceType: 'cleaning',
        },
        {
          icon: ShieldCheck,
          title: t('services.items.sterilization.title'),
          description: t('services.items.sterilization.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.sterilization.title'), intent: 'quote' })),
          serviceType: 'cleaning',
        },
      ];
    } else {
      return [
        {
          icon: Bug,
          title: t('services.items.pest_control.title'),
          description: t('services.items.pest_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.pest_control.title'), intent: 'quote' })),
          serviceType: 'pest',
        },
        {
          icon: Rat,
          title: t('services.items.rodent_control.title'),
          description: t('services.items.rodent_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.rodent_control.title'), intent: 'quote' })),
          serviceType: 'pest',
        },
        {
          icon: Droplets,
          title: t('services.items.termite_control.title'),
          description: t('services.items.termite_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.termite_control.title'), intent: 'quote' })),
          serviceType: 'pest',
        },
        {
          icon: ShieldCheck,
          title: t('services.items.prevention.title'),
          description: t('services.items.prevention.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, buildWhatsAppMessage({ language: lang, service: t('services.items.prevention.title'), intent: 'quote' })),
          serviceType: 'pest',
        },
      ];
    }
  };

  const getTitle = () => {
    if (variant === 'landing') return t('services.title_landing');
    if (variant === 'cleaning') return t('services.title_cleaning');
    return t('services.title_pest');
  };

  const getSubtitle = () => {
    if (variant === 'landing') return t('services.subtitle_landing');
    if (variant === 'cleaning') return t('services.subtitle_cleaning');
    return t('services.subtitle_pest');
  };

  const services = getServices();

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="reveal h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <h2 className="reveal text-4xl md:text-5xl font-black text-blue-900 dark:text-white mb-4">
            {getTitle()}
          </h2>
          <p
            className="reveal mx-auto max-w-2xl px-4 text-lg font-medium text-gray-500 dark:text-slate-300"
            style={{ transitionDelay: '0.1s' }}
          >
            {getSubtitle()}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="reveal bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-blue-50 dark:border-slate-700 group hover:-translate-y-2 duration-500"
              style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6 shadow-sm">
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-blue-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
              <p className="mb-8 font-medium leading-relaxed text-gray-500 dark:text-slate-300">{service.description}</p>
              {variant === 'landing' ? (
                <a
                  href={service.link}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm group-hover:gap-4 transition-all"
                >
                  <span>{t('services.cta')}</span>
                  <ArrowLeft className={`w-5 h-5 transition-transform ${i18n.language === 'ar' ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
                </a>
              ) : (
                <TrackedContactLink
                  href={service.link}
                  channel="whatsapp"
                  section={`services-${variant}`}
                  service={service.serviceType}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm group-hover:gap-4 transition-all"
                >
                  <span>{t('services.cta')}</span>
                  <ArrowLeft className={`w-5 h-5 transition-transform ${i18n.language === 'ar' ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
                </TrackedContactLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
