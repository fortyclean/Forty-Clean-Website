import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Moon, Phone, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../config/site';

interface FooterProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const socialLinks = [
  { key: 'facebook', label: { ar: 'فيسبوك', en: 'Facebook' }, href: `https://facebook.com/${siteConfig.socials.facebook}` },
  { key: 'instagram', label: { ar: 'إنستغرام', en: 'Instagram' }, href: `https://instagram.com/${siteConfig.socials.instagram}` },
  { key: 'x', label: { ar: 'إكس', en: 'X' }, href: `https://x.com/${siteConfig.socials.x}` },
  { key: 'tiktok', label: { ar: 'تيك توك', en: 'TikTok' }, href: `https://www.tiktok.com/@${siteConfig.socials.tiktok}` },
  { key: 'snapchat', label: { ar: 'سناب شات', en: 'Snapchat' }, href: `https://www.snapchat.com/add/${siteConfig.socials.snapchat}` },
  { key: 'pinterest', label: { ar: 'بنترست', en: 'Pinterest' }, href: `https://www.pinterest.com/${siteConfig.socials.pinterest}` },
  { key: 'threads', label: { ar: 'ثريدز', en: 'Threads' }, href: `https://www.threads.net/${siteConfig.socials.threads}` },
] as const;

const Footer = ({ variant = 'landing' }: FooterProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const getLogoText = () => {
    const base = isRTL ? siteConfig.nameAr : siteConfig.name;
    if (variant === 'landing') return base;
    if (variant === 'cleaning') return `${base} - ${t('nav.cleaning')}`;
    return `${base} - ${t('nav.pest')}`;
  };

  const getDescription = () => {
    if (variant === 'landing') return t('footer.description');
    if (variant === 'cleaning') return t('about.cleaning_subtitle');
    return t('about.pest_subtitle');
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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid gap-10 md:grid-cols-2 xl:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="mb-5 flex items-center gap-3">
              <img src="/images/forty-clean-logo.png" alt={getLogoText()} className="h-14 w-14 rounded-full ring-2 ring-white/10" />
              <div>
                <h3 className="text-2xl font-black text-white">{getLogoText()}</h3>
                <p className="text-sm font-bold text-cyan-200">
                  {isRTL ? 'حلول نظافة ذكية في الكويت' : 'Smart cleaning solutions in Kuwait'}
                </p>
              </div>
            </div>

            <p className="mb-6 max-w-md leading-7 text-slate-300">{getDescription()}</p>

            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={isRTL ? social.label.ar : social.label.en}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
                >
                  {isRTL ? social.label.ar : social.label.en}
                </a>
              ))}
            </div>
          </div>

          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="mb-4 text-lg font-bold text-white">{t('footer.quick_links')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="footer-link inline-flex items-center gap-2 text-slate-200 hover:text-white">
                    <span className="text-cyan-300">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="mb-4 text-lg font-bold text-white">{t('footer.our_services')}</h4>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="footer-link inline-flex items-center gap-2 text-slate-200 hover:text-white">
                    <span className="text-cyan-300">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="mb-4 text-lg font-bold text-white">{t('footer.contact_info')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-cyan-brand" />
                <span className="text-sm leading-6 text-slate-300">{isRTL ? siteConfig.contact.address : siteConfig.contact.addressEn}</span>
              </li>
              <li>
                <a href={siteConfig.links.phone(siteConfig.contact.cleaningPhone)} className="flex items-center gap-3 text-slate-300 transition-colors hover:text-cyan-brand">
                  <Phone className="h-5 w-5 text-cyan-brand" />
                  <span>{siteConfig.contact.cleaningPhone} - {t('nav.cleaning')}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.links.phone(siteConfig.contact.pestPhone)} className="flex items-center gap-3 text-slate-300 transition-colors hover:text-cyan-brand">
                  <Phone className="h-5 w-5 text-cyan-brand" />
                  <span>{siteConfig.contact.pestPhone} - {t('nav.pest')}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.links.email(siteConfig.contact.email)} className="flex items-center gap-3 text-slate-300 transition-colors hover:text-cyan-brand">
                  <Mail className="h-5 w-5 text-cyan-brand" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h4 className="mb-4 text-lg font-bold text-white">{t('footer.settings')}</h4>
            <button
              onClick={toggleTheme}
              className="mb-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-cyan-300" />}
                <span className="font-bold">{theme === 'dark' ? t('footer.light_mode') : t('footer.dark_mode')}</span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-bold text-cyan-200">
                {theme === 'dark' ? 'ON' : 'OFF'}
              </span>
            </button>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <span>{t('footer.system_status')}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="cursor-default select-none text-sm text-slate-400">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
