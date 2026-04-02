import { useEffect, useState } from 'react';
import { Clock, Globe, Menu, Moon, Phone, Sun, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const Header = ({ variant = 'landing' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(nextLanguage);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
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

  const handleNavClick = (href: string, isAnchor: boolean) => {
    setIsMobileMenuOpen(false);

    if (!isAnchor) {
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isSolidHeader = isScrolled || location.pathname !== '/';
  const controlClasses = isSolidHeader
    ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
    : 'border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm';

  const logoColor = isSolidHeader ? 'text-blue-900 dark:text-white' : 'text-white';

  return (
    <header className={`header ${isSolidHeader ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/forty-clean-logo.png"
              alt={getLogoText()}
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover shadow-lg"
            />
            <span className={`logo-text text-2xl font-bold transition-colors duration-300 ${logoColor}`}>
              {getLogoText()}
            </span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button key={link.href} onClick={() => handleNavClick(link.href, true)} className="nav-link font-medium">
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
            )}

            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${controlClasses}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
              <span className="text-sm font-bold">{theme === 'dark' ? t('footer.light_mode') : t('footer.dark_mode')}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${controlClasses}`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-bold">{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <Link
              to="/booking"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-black text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 dark:shadow-blue-950/40"
            >
              <Clock className="h-4 w-4" />
              {t('calculator.book_now')}
            </Link>
          </nav>

          <a href="tel:69988979" className="gradient-btn hidden items-center gap-2 rounded-full px-6 py-3 font-semibold text-white lg:flex">
            <Phone className="h-5 w-5" />
            <span>69988979</span>
          </a>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={(event) => {
                event.stopPropagation();
                toggleTheme();
              }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all active:scale-95 ${controlClasses}`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                toggleLanguage();
              }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all active:scale-95 ${controlClasses}`}
              aria-label="Toggle Language"
            >
              <Globe className="h-5 w-5" />
              <span className="text-sm font-bold">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-xl p-2.5 transition-all active:scale-95 ${
                isSolidHeader
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'border border-white/20 bg-white/10 text-white backdrop-blur-sm'
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div
          className={`mt-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:hidden ${
            isMobileMenuOpen ? 'block opacity-100' : 'hidden opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) =>
              link.isAnchor ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, true)}
                  className="py-2 text-right font-medium text-gray-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 text-right font-medium text-gray-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400 ${
                    location.pathname === link.href ? 'font-bold text-blue-600 dark:text-blue-400' : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="mt-2 grid grid-cols-2 gap-3 border-t border-gray-50 pt-3 dark:border-slate-800">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 font-bold text-gray-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
                <span>{theme === 'dark' ? t('footer.light_mode') : t('footer.dark_mode')}</span>
              </button>

              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 px-4 py-3 font-bold text-gray-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>

            <a href="tel:69988979" className="gradient-btn mt-2 flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white">
              <Phone className="h-5 w-5" />
              <span>69988979</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
