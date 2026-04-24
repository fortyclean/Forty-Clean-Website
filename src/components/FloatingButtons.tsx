import { Phone, MessageCircle, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildWhatsAppMessage, siteConfig } from '../config/site';
import TrackedContactLink from './TrackedContactLink';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine WhatsApp number based on page
  const isCleaningPage = location.pathname === '/cleaning';
  const whatsappNumber = isCleaningPage ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
  const whatsappText = buildWhatsAppMessage({
    language: i18n.language,
    service: isCleaningPage ? t('services.title_cleaning') : t('services.title_pest'),
    intent: 'general',
  });

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:bottom-6 md:right-6 md:gap-4">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-medium shadow-lg transition-all duration-300 hover:bg-blue-medium hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 md:h-12 md:w-12 animate-fadeIn"
          title="Scroll to Top"
        >
          <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* WhatsApp Button */}
      <TrackedContactLink
        href={siteConfig.links.whatsapp(whatsappNumber, whatsappText)}
        channel="whatsapp"
        section="floating-buttons"
        service={isCleaningPage ? 'cleaning' : 'pest'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-300 hover:scale-110 md:h-14 md:w-14"
        title="WhatsApp Us"
      >
        <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
      </TrackedContactLink>

      {/* Call Button */}
      <TrackedContactLink
        href={siteConfig.links.phone(whatsappNumber)}
        channel="phone"
        section="floating-buttons"
        service={isCleaningPage ? 'cleaning' : 'pest'}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-medium text-white shadow-lg transition-transform duration-300 hover:scale-110 md:h-14 md:w-14"
        title="Call Us"
      >
        <Phone className="h-6 w-6 md:h-7 md:w-7" />
      </TrackedContactLink>
    </div>
  );
};

export default FloatingButtons;
