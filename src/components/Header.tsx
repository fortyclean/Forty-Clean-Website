import { useState, useEffect } from 'react';
import { Phone, Menu, X, Globe, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const Header = ({ variant = 'landing' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { label: t('nav.home'), href: '/', isAnchor: false },
    { label: t('nav.cleaning'), href: '/cleaning', isAnchor: false },
    { label: t('nav.pest'), href: '/pest', isAnchor: false },
    { label: t('nav.offers'), href: '/offers', isAnchor: false },
    { label: t('nav.blog'), href: '/blog', isAnchor: false },
    { label: t('nav.contact'), href: '#contact', isAnchor: true },
  ];

  const getLogoText = () => {
    const base = i18n.language === 'ar' ? 'فورتي' : 'Forty';
    if (variant === 'landing') return base;
    if (variant === 'cleaning') return `${base} - ${t('nav.cleaning')}`;
    return `${base} - ${t('nav.pest')}`;
  };

  const getLogoColor = () => {
    if (isScrolled || location.pathname !== '/') return 'text-blue-dark';
    return 'text-white';
  };

  const handleNavClick = (href: string, isAnchor: boolean) => {
    setIsMobileMenuOpen(false);
    if (isAnchor) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`header ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/forty-clean-logo.png" 
              alt={getLogoText()} 
              className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white/20"
            />
            <span className={`text-2xl font-bold ${getLogoColor()} logo-text transition-colors duration-300`}>
              {getLogoText()}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, true)}
                  className="nav-link font-medium"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link font-medium ${location.pathname === link.href ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Call to Action Button */}
            <Link 
              to="/booking"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              احجز الآن
            </Link>
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                isScrolled || location.pathname !== '/' 
                ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
                : 'border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-bold">{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </nav>

          {/* Phone Button */}
          <a
            href="tel:69988979"
            className="hidden lg:flex gradient-btn text-white px-6 py-3 rounded-full items-center gap-2 font-semibold"
          >
            <Phone className="w-5 h-5" />
            <span>69988979</span>
          </a>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Language Switcher */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLanguage();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95 ${
                isScrolled || location.pathname !== '/' 
                ? 'border-blue-100 bg-blue-50/50 text-blue-700 shadow-sm' 
                : 'border-white/40 bg-white/10 text-white backdrop-blur-sm shadow-lg'
              }`}
              aria-label="Toggle Language"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-bold">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                isScrolled || location.pathname !== '/' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-white rounded-2xl shadow-xl mt-2 p-6 transition-all duration-300 ${isMobileMenuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              link.isAnchor ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, true)}
                  className="text-right text-gray-700 hover:text-blue-600 font-medium py-2"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-right text-gray-700 hover:text-blue-600 font-medium py-2 ${location.pathname === link.href ? 'text-blue-600 font-bold' : ''}`}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Mobile Menu Language Toggle */}
            <button 
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full text-right text-gray-700 font-medium py-3 border-t border-gray-50 mt-2"
            >
              <span className="text-blue-600 font-bold">{i18n.language === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
              <Globe className="w-5 h-5 text-blue-600" />
            </button>

            <a
              href="tel:69988979"
              className="gradient-btn text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 font-semibold mt-2"
            >
              <Phone className="w-5 h-5" />
              <span>69988979</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
