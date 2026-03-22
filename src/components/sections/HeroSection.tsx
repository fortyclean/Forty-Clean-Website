import { Phone, ArrowLeft, Sparkles, Bug } from 'lucide-react';
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
          { label: t('hero.cta_cleaning'), href: '/cleaning', icon: Sparkles, primary: true, isExternal: false },
          { label: t('hero.cta_pest'), href: '/pest', icon: Bug, primary: false, isExternal: false },
        ],
      };
    } else if (variant === 'cleaning') {
      const phone = siteConfig.contact.cleaningPhone;
      return {
        title: t('services.title_cleaning'),
        subtitle: t('services.subtitle_cleaning'),
        buttons: [
          { label: t('contact.submit'), href: siteConfig.links.whatsapp(phone, t('contact.success')), icon: Phone, primary: true, isExternal: true },
          { label: t('contact.info.phone'), href: siteConfig.links.phone(phone), icon: Phone, primary: false, isExternal: true },
        ],
      };
    } else {
      const phone = siteConfig.contact.pestPhone;
      return {
        title: t('services.title_pest'),
        subtitle: t('services.subtitle_pest'),
        buttons: [
          { label: t('contact.submit'), href: siteConfig.links.whatsapp(phone, t('contact.success')), icon: Phone, primary: true, isExternal: true },
          { label: t('contact.info.phone'), href: siteConfig.links.phone(phone), icon: Phone, primary: false, isExternal: true },
        ],
      };
    }
  };

  const getVisual = () => {
    if (variant === 'landing') {
      return (
        <div className="relative flex flex-col md:flex-row items-center gap-6 z-10">
          <Link to="/cleaning" className="relative group z-20">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl animate-float transition-transform group-hover:scale-105 cursor-pointer">
              <img src="/images/home-cleaning-kuwait.webp" alt={t('nav.cleaning')} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center shadow-lg pointer-events-none">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-blue-900 text-xs font-bold shadow-sm pointer-events-none">
              {t('nav.cleaning')}
            </div>
          </Link>
          
          <Link to="/pest" className="relative group md:mt-12 z-20">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl animate-float transition-transform group-hover:scale-105 cursor-pointer" style={{ animationDelay: '0.7s' }}>
              <img src="/images/pest-control-kuwait.webp" alt={t('nav.pest')} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center shadow-lg pointer-events-none">
              <Bug className="w-6 h-6 text-white" />
            </div>
            <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-red-600 text-xs font-bold shadow-sm pointer-events-none">
              {t('nav.pest')}
            </div>
          </Link>
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-150 -z-10 pointer-events-none"></div>
        </div>
      );
    }
    const imgSrc = variant === 'cleaning' ? '/images/office-cleaning-service.webp' : '/images/pest-control-kuwait.webp';
    const Icon = variant === 'cleaning' ? Sparkles : Bug;
    return (
      <div className="relative z-10">
        <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white/20 shadow-2xl animate-float">
          <img src={imgSrc} alt={t(`nav.${variant}`)} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center animate-float shadow-lg pointer-events-none">
          <Icon className="w-12 h-12 text-white" />
        </div>
      </div>
    );
  };

  const content = getContent();

  return (
    <section id="hero" ref={sectionRef} className="min-h-screen gradient-bg flex items-center pt-28 md:pt-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border-2 border-white"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full border-2 border-white"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'} order-2 lg:order-1 relative z-10`}>
            <h1 className="reveal text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {content.title}
            </h1>
            <p className="reveal text-xl text-white/90 mb-8 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              {content.subtitle}
            </p>
            <div className="reveal flex flex-wrap gap-4" style={{ animationDelay: '0.4s' }}>
              {content.buttons.map((button, index) => (
                button.isExternal ? (
                  <a key={index} href={button.href} target="_blank" rel="noopener noreferrer" className={`${button.primary ? 'btn-white' : 'btn-secondary'} group`}>
                    <button.icon className="w-5 h-5" />
                    <span>{button.label}</span>
                  </a>
                ) : (
                  <Link key={index} to={button.href} className={`${button.primary ? 'btn-white' : 'btn-secondary'} group`}>
                    <button.icon className="w-5 h-5" />
                    <span>{button.label}</span>
                    {variant === 'landing' && <ArrowLeft className={`w-5 h-5 transition-transform ${i18n.language === 'ar' ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />}
                  </Link>
                )
              ))}
            </div>
          </div>
          <div className="reveal flex justify-center order-1 lg:order-2" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 pointer-events-none"></div>
              {getVisual()}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
