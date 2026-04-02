import { Phone, ArrowLeft, Sparkles, Bug, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import { siteConfig } from '../../config/site';

interface HeroSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const HeroSection = ({ variant = 'landing' }: HeroSectionProps) => {
  const { sectionRef } = useReveal();
  const { t, i18n } = useTranslation();

  const getContent = () => {
    if (variant === 'landing') {
      return {
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        buttons: [
          { label: t('hero.cta_booking'), href: '/booking', icon: Clock, primary: true, isExternal: false },
          { label: t('hero.cta_whatsapp'), href: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, ''), icon: Phone, primary: false, isExternal: true },
        ],
      };
    }

    if (variant === 'cleaning') {
      const phone = siteConfig.contact.cleaningPhone;
      return {
        title: t('services.title_cleaning'),
        subtitle: t('services.subtitle_cleaning'),
        buttons: [
          { label: t('contact.submit'), href: siteConfig.links.whatsapp(phone, t('contact.success')), icon: Phone, primary: true, isExternal: true },
          { label: t('contact.info.phone'), href: siteConfig.links.phone(phone), icon: Phone, primary: false, isExternal: true },
        ],
      };
    }

    const phone = siteConfig.contact.pestPhone;
    return {
      title: t('services.title_pest'),
      subtitle: t('services.subtitle_pest'),
      buttons: [
        { label: t('contact.submit'), href: siteConfig.links.whatsapp(phone, t('contact.success')), icon: Phone, primary: true, isExternal: true },
        { label: t('contact.info.phone'), href: siteConfig.links.phone(phone), icon: Phone, primary: false, isExternal: true },
      ],
    };
  };

  const getVisual = () => {
    if (variant === 'landing') {
      return (
        <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
          <Link to="/cleaning" className="group relative z-20">
            <div className="h-64 w-64 overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105 dark:border-slate-700 md:h-72 md:w-72">
              <img src="/images/home-cleaning-kuwait.webp" alt={t('nav.cleaning')} className="h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
            </div>
            <div className="pointer-events-none absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
              <Sparkles className="h-6 w-6 text-white dark:text-cyan-200" />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-900 shadow-sm dark:bg-slate-950/90 dark:text-slate-100">
              {t('nav.cleaning')}
            </div>
          </Link>

          <Link to="/pest" className="group relative z-20 md:mt-12">
            <div className="h-64 w-64 overflow-hidden rounded-3xl border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105 dark:border-slate-700 md:h-72 md:w-72">
              <img src="/images/pest-control-kuwait.webp" alt={t('nav.pest')} className="h-full w-full object-cover" loading="lazy" fetchPriority="low" decoding="async" />
            </div>
            <div className="pointer-events-none absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/20 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
              <Bug className="h-6 w-6 text-white dark:text-cyan-200" />
            </div>
            <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-red-600 shadow-sm dark:bg-slate-950/90 dark:text-red-300">
              {t('nav.pest')}
            </div>
          </Link>

          <div className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full bg-white/10 blur-3xl dark:bg-blue-400/10" />
        </div>
      );
    }

    const imgSrc = variant === 'cleaning' ? '/images/office-cleaning-service.webp' : '/images/pest-control-kuwait.webp';
    const Icon = variant === 'cleaning' ? Sparkles : Bug;

    return (
      <div className="relative z-10">
        <div className="h-80 w-80 overflow-hidden rounded-full border-8 border-white/20 text-[0] shadow-2xl dark:border-slate-700 md:h-96 md:w-96">
          <img src={imgSrc} alt={t(`nav.${variant}`)} className="h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" />
        </div>
        <div className="pointer-events-none absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
          <Icon className="h-12 w-12 text-white dark:text-cyan-200" />
        </div>
      </div>
    );
  };

  const content = getContent();

  return (
    <section id="hero" ref={sectionRef} className="gradient-bg relative flex min-h-screen items-center overflow-hidden pt-28 md:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/30 dark:to-slate-950/10" />
      <div className="pointer-events-none absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute right-20 top-20 h-64 w-64 rounded-full border-2 border-white dark:border-blue-200/30" />
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full border-2 border-white dark:border-cyan-200/20" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'} relative z-10 order-2 lg:order-1`}>
            <h1 className="reveal mb-6 text-4xl font-black leading-tight text-white drop-shadow-[0_4px_18px_rgba(15,23,42,0.35)] dark:text-slate-50 md:text-5xl lg:text-7xl">
              {content.title}
            </h1>
            <p className="reveal mb-10 text-xl font-bold leading-relaxed text-white/95 drop-shadow-[0_3px_12px_rgba(15,23,42,0.24)] dark:text-slate-100 md:text-2xl" style={{ animationDelay: '0.2s' }}>
              {content.subtitle}
            </p>
            <div className="reveal flex flex-wrap gap-6" style={{ animationDelay: '0.4s' }}>
              {content.buttons.map((button, index) =>
                button.isExternal ? (
                  <a
                    key={index}
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${button.primary ? 'btn-white scale-110 shadow-2xl dark:shadow-slate-950/40' : 'btn-secondary'} group rounded-2xl px-8 py-5 text-xl font-black transition-all`}
                  >
                    <button.icon className="h-6 w-6" />
                    <span>{button.label}</span>
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={button.href}
                    className={`${button.primary ? 'btn-white scale-110 shadow-2xl dark:shadow-slate-950/40' : 'btn-secondary'} group rounded-2xl px-8 py-5 text-xl font-black transition-all`}
                  >
                    <button.icon className="h-6 w-6" />
                    <span>{button.label}</span>
                    {variant === 'landing' ? (
                      <ArrowLeft className={`h-6 w-6 transition-transform ${i18n.language === 'ar' ? 'group-hover:-translate-x-2' : 'rotate-180 group-hover:translate-x-2'}`} />
                    ) : null}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="reveal order-1 flex justify-center lg:order-2" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 scale-150 rounded-full bg-white/20 blur-3xl dark:bg-blue-400/10" />
              {getVisual()}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-slate-50 dark:fill-slate-900" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
