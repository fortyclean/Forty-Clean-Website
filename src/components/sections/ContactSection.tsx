import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../../hooks/useReveal';
import { buildWhatsAppMessage, siteConfig } from '../../config/site';
import { useLeads } from '../../hooks/useLeads';
import { saveContactInteraction } from '../../lib/firebase';
import TrackedContactLink from '../TrackedContactLink';

const kuwaitPhoneRegex = /^[2569]\d{7}$/;

type ContactFormData = {
  name: string;
  phone: string;
  service: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactFormData, 'name_min' | 'invalid_phone' | 'select_service'>>;

interface ContactSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const ContactSection = ({ variant = 'landing' }: ContactSectionProps) => {
  const { sectionRef } = useReveal();
  const { t, i18n } = useTranslation();
  const { saveLead } = useLeads({ subscribe: false });
  const [formData, setFormData] = useState<ContactFormData>(() => {
    if (typeof window === 'undefined') {
      return { name: '', phone: '', service: '', message: '' };
    }

    const savedDraft = localStorage.getItem('contact_form_draft');
    if (!savedDraft) {
      return { name: '', phone: '', service: '', message: '' };
    }

    try {
      const draft = JSON.parse(savedDraft) as Partial<ContactFormData>;
      return {
        name: draft.name ?? '',
        phone: draft.phone ?? '',
        service: draft.service ?? '',
        message: draft.message ?? '',
      };
    } catch {
      return { name: '', phone: '', service: '', message: '' };
    }
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const infoWhatsappPhone =
    variant === 'cleaning'
      ? siteConfig.contact.cleaningPhone
      : variant === 'pest'
        ? siteConfig.contact.pestPhone
        : siteConfig.contact.primaryPhone;

  useEffect(() => {
    localStorage.setItem(
      'contact_form_draft',
      JSON.stringify({
        name: formData.name || '',
        phone: formData.phone || '',
        service: formData.service || '',
        message: formData.message || '',
      })
    );
  }, [formData]);

  const validateForm = () => {
    const nextErrors: ContactErrors = {};

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'name_min';
    }

    if (!kuwaitPhoneRegex.test(formData.phone.trim())) {
      nextErrors.phone = 'invalid_phone';
    }

    if (!formData.service.trim()) {
      nextErrors.service = 'select_service';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const serviceLabel = getServices().find((service) => service.value === formData.service)?.label || formData.service;
    let whatsappText = [
      buildWhatsAppMessage({
        language: i18n.language,
        service: serviceLabel,
        intent: 'general',
        details: formData.message || t('contact.whatsapp_message.no_message'),
      }),
      '',
      `*${t('contact.whatsapp_message.name')}:* ${formData.name.trim()}`,
      `*${t('contact.whatsapp_message.phone')}:* ${formData.phone.trim()}`,
    ].join('\n');
    const leadDetails = [
      `${t('contact.whatsapp_message.service')} ${serviceLabel}`,
      `${t('contact.whatsapp_message.message')} ${formData.message || t('contact.whatsapp_message.no_message')}`,
    ].join(' | ');

    const savedLead = await saveLead({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      details: leadDetails,
      source: 'contact_form',
    });
    whatsappText += `\n*${i18n.language === 'ar' ? 'رقم الطلب' : 'Order reference'}:* ${savedLead.trackingCode}`;

    localStorage.removeItem('contact_form_draft');

    const conversionReporter = (window as Window & { gtag_report_conversion?: () => void }).gtag_report_conversion;
    if (typeof conversionReporter === 'function') {
      conversionReporter();
    }

    const isCleaningService =
      formData.service === 'cleaning' ||
      formData.service === 'home' ||
      formData.service === 'office' ||
      formData.service === 'building' ||
      formData.service === 'sterilization' ||
      variant === 'cleaning';

    const whatsappNumber = isCleaningService ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
    const whatsappUrl = siteConfig.links.whatsapp(whatsappNumber, whatsappText);

    void saveContactInteraction({
      type: 'whatsapp',
      page: window.location.pathname,
      section: 'contact-form',
      language: i18n.language === 'en' ? 'en' : 'ar',
      deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      service: isCleaningService ? 'cleaning' : 'pest',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(t('contact.success'));

      setTimeout(() => {
        window.location.assign(whatsappUrl);
        setFormData({
          name: '',
          phone: '',
          service: '',
          message: '',
        });
        setErrors({});
        setSubmitMessage('');
      }, 2000);
    }, 1000);
  };

  const getServices = () => {
    if (variant === 'cleaning') {
      return [
        { value: '', label: t('contact.service_placeholder') },
        { value: 'home', label: t('services.items.home_cleaning.title') },
        { value: 'office', label: t('services.items.office_cleaning.title') },
        { value: 'building', label: t('services.items.building_cleaning.title') },
        { value: 'sterilization', label: t('services.items.sterilization.title') },
      ];
    }
    if (variant === 'pest') {
      return [
        { value: '', label: t('contact.service_placeholder') },
        { value: 'insects', label: t('services.items.pest_control.title') },
        { value: 'rodents', label: t('services.items.rodent_control.title') },
        { value: 'termites', label: t('services.items.termite_control.title') },
        { value: 'prevention', label: t('services.items.prevention.title') },
      ];
    }
    return [
      { value: '', label: t('contact.service_placeholder') },
      { value: 'cleaning', label: t('nav.cleaning') },
      { value: 'pest', label: t('nav.pest') },
    ];
  };

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="reveal w-16 h-1 bg-gradient-to-r from-blue-medium to-cyan-brand mx-auto mb-6 rounded-full"></div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-blue-dark dark:text-white mb-4" style={{ animationDelay: '0.1s' }}>
            {t('contact.title')}
          </h2>
          <p className="reveal mx-auto max-w-2xl text-lg text-gray-medium dark:text-slate-300" style={{ animationDelay: '0.2s' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="reveal" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={onSubmit} className="bg-gray-light dark:bg-slate-800 rounded-3xl p-8 border border-transparent dark:border-slate-700">
              <div className="space-y-6">
                <div>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData((current) => ({ ...current, name }));
                      if (errors.name) {
                        setErrors((current) => ({ ...current, name: undefined }));
                      }
                    }}
                    placeholder={t('contact.name')}
                    className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t(`contact.errors.${errors.name}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const phone = e.target.value;
                      setFormData((current) => ({ ...current, phone }));
                      if (errors.phone) {
                        setErrors((current) => ({ ...current, phone: undefined }));
                      }
                    }}
                    placeholder={t('contact.phone')}
                    className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t(`contact.errors.${errors.phone}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={(e) => {
                      const service = e.target.value;
                      setFormData((current) => ({ ...current, service }));
                      if (errors.service) {
                        setErrors((current) => ({ ...current, service: undefined }));
                      }
                    }}
                    className={`form-input ${errors.service ? 'border-red-500' : ''}`}
                  >
                    {getServices().map((service, index) => (
                      <option key={index} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t(`contact.errors.${errors.service}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      const message = e.target.value;
                      setFormData((current) => ({ ...current, message }));
                    }}
                    placeholder={t('contact.message')}
                    rows={4}
                    className="form-input resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-btn flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>{t('contact.submitting')}</span>
                  ) : (
                    <>
                      <span>{t('contact.submit')}</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
                {submitMessage && (
                  <div className="animate-fadeIn text-center font-medium text-green-600 dark:text-emerald-300">
                    {submitMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="reveal space-y-6" style={{ animationDelay: '0.4s' }}>
            <TrackedContactLink
              href={siteConfig.links.phone(siteConfig.contact.primaryPhone)}
              channel="phone"
              section="contact-card"
              className="contact-card group"
            >
              <div className="contact-icon">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark dark:text-white mb-1">{t('contact.info.phone')}</h4>
                <p className="text-gray-medium transition-colors group-hover:text-blue-medium dark:text-slate-300 dark:group-hover:text-blue-400">{siteConfig.contact.primaryPhone}</p>
              </div>
            </TrackedContactLink>

            <div className="contact-card">
              <div className="contact-icon">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark dark:text-white mb-1">{t('contact.info.address')}</h4>
                <p className="text-gray-medium dark:text-slate-300">{t('footer.address')}</p>
              </div>
            </div>

            <TrackedContactLink
              href={siteConfig.links.whatsapp(
                infoWhatsappPhone,
                buildWhatsAppMessage({
                  language: i18n.language,
                  service: variant === 'cleaning' ? t('services.title_cleaning') : variant === 'pest' ? t('services.title_pest') : t('contact.title'),
                  intent: 'general',
                })
              )}
              channel="whatsapp"
              section="contact-card"
              service={variant === 'pest' ? 'pest' : 'cleaning'}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group"
            >
              <div className="contact-icon" style={{ background: '#25d366' }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark dark:text-white mb-1">{t('contact.info.whatsapp')}</h4>
                <p className="text-gray-medium transition-colors group-hover:text-blue-medium dark:text-slate-300 dark:group-hover:text-blue-400">965{infoWhatsappPhone}</p>
              </div>
            </TrackedContactLink>

            <a href="mailto:forty@fortyclean.com" className="contact-card group">
              <div className="contact-icon">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark dark:text-white mb-1">{t('contact.info.email')}</h4>
                <p className="text-gray-medium transition-colors group-hover:text-blue-medium dark:text-slate-300 dark:group-hover:text-blue-400">forty@fortyclean.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
