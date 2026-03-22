import { Phone, MessageCircle, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../config/site';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

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
  const whatsappText = t('contact.success');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-white text-blue-medium rounded-full shadow-lg flex items-center justify-center hover:bg-blue-medium hover:text-white transition-all duration-300 animate-fadeIn"
          title="Scroll to Top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Button */}
      <a
        href={siteConfig.links.whatsapp(whatsappNumber, whatsappText)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25d366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        title="WhatsApp Us"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Call Button */}
      <a
        href={siteConfig.links.phone(whatsappNumber)}
        className="w-14 h-14 bg-blue-medium text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
        title="Call Us"
      >
        <Phone className="w-7 h-7" />
      </a>
    </div>
  );
};

export default FloatingButtons;
