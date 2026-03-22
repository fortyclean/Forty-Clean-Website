import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../config/site';

interface FooterProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const Footer = ({ variant = 'landing' }: FooterProps) => {
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const getLogoText = () => {
    const base = i18n.language === 'ar' ? siteConfig.nameAr : siteConfig.name;
    if (variant === 'landing') return base;
    if (variant === 'cleaning') return `${base} - ${t('nav.cleaning')}`;
    return `${base} - ${t('nav.pest')}`;
  };

  const getDescription = () => {
    if (variant === 'landing') {
      return t('footer.description');
    } else if (variant === 'cleaning') {
      return t('about.cleaning_subtitle');
    } else {
      return t('about.pest_subtitle');
    }
  };

  const quickLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.cleaning'), href: '/cleaning' },
    { label: t('nav.pest'), href: '/pest' },
    { label: t('nav.offers'), href: '/offers' },
    { label: t('nav.blog'), href: '/blog' },
  ];

  const servicesLinks = [
    { label: t('services.items.home_cleaning.title'), href: '/cleaning' },
    { label: t('services.items.office_cleaning.title'), href: '/cleaning' },
    { label: t('services.items.pest_control.title'), href: '/pest' },
    { label: t('services.items.rodent_control.title'), href: '/pest' },
  ];

  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      if ((window as any).showLeads) (window as any).showLeads();
      setClickCount(0);
    }
  };

  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-3 mb-4 ${i18n.language === 'ar' ? 'flex-row' : 'flex-row'}`}>
              <img src="/images/forty-clean-logo.png" alt={getLogoText()} className="w-16 h-16 rounded-full" />
              <h3 className="text-2xl font-bold text-white">{getLogoText()}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {getDescription()}
            </p>
            <div className={`flex flex-wrap gap-3 ${i18n.language === 'ar' ? 'justify-start' : 'justify-start'}`}>
              <a href={`https://facebook.com/${siteConfig.socials.facebook}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'فيسبوك' : 'Facebook'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href={`https://instagram.com/${siteConfig.socials.instagram}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'انستجرام' : 'Instagram'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={`https://x.com/${siteConfig.socials.x}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'إكس (تويتر)' : 'X (Twitter)'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>
              </a>
              <a href={`https://www.tiktok.com/@${siteConfig.socials.tiktok}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'تيك توك' : 'TikTok'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href={`https://www.snapchat.com/add/${siteConfig.socials.snapchat}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'سناب شات' : 'Snapchat'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.5c-.5 0-.9.1-1.3.2-1.4.4-2.2 1.6-2.5 2.9-.1.4-.1.8-.1 1.2 0 .4.1.8.2 1.2.1.3.3.6.5.8.3.3.7.5 1.1.6.4.1.8.2 1.2.2.4 0 .8-.1 1.2-.2.4-.1.8-.3 1.1-.6.2-.2.4-.5.5-.8.1-.4.2-.8.2-1.2 0-.4 0-.8-.1-1.2-.3-1.3-1.1-2.5-2.5-2.9-.4-.1-.8-.2-1.3-.2zm0 1c.4 0 .7.1 1.1.2 1 .3 1.6 1.2 1.8 2.2 0 .3.1.6.1.9 0 .3 0 .6-.1.9-.1.2-.2.4-.3.6-.2.2-.5.4-.8.5-.3.1-.6.1-.9.1-.3 0-.6 0-.9-.1-.3-.1-.6-.3-.8-.5-.1-.2-.2-.4-.3-.6-.1-.3-.1-.6-.1-.9 0-.3 0-.6.1-.9.2-1 .8-1.9 1.8-2.2.4-.1.7-.2 1.1-.2zM6.5 10c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm11 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zM12 14c-2.5 0-4.5 1.5-5.5 3.5-.5 1-1 2.5-1 4h13c0-1.5-.5-3-1-4-1-2-3-3.5-5.5-3.5zm-4.4 6c.2-1 .6-2 1.2-2.8.8-1 2-1.7 3.2-1.7s2.4.7 3.2 1.7c.6.8 1 1.8 1.2 2.8H7.6z"/></svg>
              </a>
              <a href={`https://www.pinterest.com/${siteConfig.socials.pinterest}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'بينتريست' : 'Pinterest'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.524 2.17 1.701 2.17 2.041 0 3.611-2.152 3.611-5.259 0-2.751-1.977-4.672-4.797-4.672-3.267 0-5.183 2.451-5.183 4.981 0 1.003.387 2.08.87 2.681.094.117.108.219.08.331-.088.365-.283 1.152-.321 1.308-.05.205-.167.249-.384.149-1.431-.665-2.323-2.758-2.323-4.434 0-3.613 2.625-6.928 7.562-6.928 3.971 0 7.055 2.829 7.055 6.61 0 3.945-2.487 7.121-5.944 7.121-1.16 0-2.251-.603-2.624-1.277l-.715 2.723c-.259.995-.96 2.243-1.427 3.001 1.041.321 2.143.495 3.286.495 6.621 0 11.988-5.366 11.988-11.987C24.005 5.367 18.639 0 12.017 0z"/></svg>
              </a>
              <a href={`https://www.threads.net/${siteConfig.socials.threads}`} className="social-icon" target="_blank" rel="noopener noreferrer" title={i18n.language === 'ar' ? 'ثريدز' : 'Threads'}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.862 15.333c-.455.455-1.014.788-1.64.978-1.313.394-2.693.394-4.006 0-.626-.19-1.185-.523-1.64-.978-.455-.455-.788-1.014-.978-1.64-.394-1.313-.394-2.693 0-4.006.19-.626.523-1.185.978-1.64.455-.455 1.014-.788 1.64-.978 1.313-.394 2.693-.394 4.006 0 .626.19 1.185.523 1.64.978.455.455.788 1.014.978 1.64.394 1.313.394 2.693 0 4.006-.19.626-.523 1.185-.978 1.64zm-1.112-4.856c-.1-.33-.27-.63-.5-.86-.23-.23-.53-.4-.86-.5-.68-.2-1.39-.2-2.07 0-.33.1-.63.27-.86.5-.23.23-.4.53-.5.86-.2.68-.2 1.39 0 2.07.1.33.27.63.5.86.23.23.53.4.86.5.68.2 1.39.2 2.07 0 .33-.1.63-.27.86-.5.23-.23.4-.53.5-.86.2-.68.2-1.39 0-2.07z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-lg font-bold text-white mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="footer-link flex items-center gap-2">
                    <span>-</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-lg font-bold text-white mb-4">{t('footer.our_services')}</h4>
            <ul className="space-y-3">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="footer-link flex items-center gap-2">
                    <span>-</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-lg font-bold text-white mb-4">{t('footer.contact_info')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-brand flex-shrink-0 mt-1" />
                <span className="text-gray-400">
                  {i18n.language === 'ar' ? siteConfig.contact.address : siteConfig.contact.addressEn}
                </span>
              </li>
              <li>
                <a href={siteConfig.links.phone(siteConfig.contact.cleaningPhone)} className="flex items-center gap-3 text-gray-400 hover:text-cyan-brand transition-colors">
                  <Phone className="w-5 h-5 text-cyan-brand" />
                  <span>{siteConfig.contact.cleaningPhone} - {t('nav.cleaning')}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.links.phone(siteConfig.contact.pestPhone)} className="flex items-center gap-3 text-gray-400 hover:text-cyan-brand transition-colors">
                  <Phone className="w-5 h-5 text-cyan-brand" />
                  <span>{siteConfig.contact.pestPhone} - {t('nav.pest')}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.links.email(siteConfig.contact.email)} className="flex items-center gap-3 text-gray-400 hover:text-cyan-brand transition-colors">
                  <Mail className="w-5 h-5 text-cyan-brand" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-lg font-bold text-white mb-4">{t('footer.settings')}</h4>
            <button 
              onClick={toggleDarkMode}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all w-full mb-4"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
              <span className="font-bold">{isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}></div>
              <span>النظام يعمل بكفاءة</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p 
            className="text-gray-500 cursor-default select-none"
            onClick={handleSecretClick}
          >
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
