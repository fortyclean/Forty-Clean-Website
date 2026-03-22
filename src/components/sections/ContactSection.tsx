import { useState, useEffect } from 'react';
import { Phone, MapPin, Mail, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../../hooks/useReveal';
import { siteConfig } from '../../config/site';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLeads } from '../../hooks/useLeads';

// Kuwait Phone Regex: 8 digits, starts with 2, 5, 6, or 9
const kuwaitPhoneRegex = /^[2569]\d{7}$/;

const contactSchema = z.object({
  name: z.string().min(2, { message: 'name_min' }),
  phone: z.string().regex(kuwaitPhoneRegex, { message: 'invalid_phone' }),
  service: z.string().min(1, { message: 'select_service' }),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const ContactSection = ({ variant = 'landing' }: ContactSectionProps) => {
  const { sectionRef } = useReveal();
  const { t } = useTranslation();
  const { saveLead } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      service: '',
      message: '',
    },
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('contact_form_draft');
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      Object.keys(draft).forEach((key) => {
        setValue(key as keyof ContactFormData, draft[key]);
      });
    }
  }, [setValue]);

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Construct WhatsApp Message
    const serviceLabel = getServices().find(s => s.value === data.service)?.label || data.service;
    const whatsappText = `${t('contact.whatsapp_message.title')}\n\n*${t('contact.whatsapp_message.name')}* ${data.name}\n*${t('contact.whatsapp_message.phone')}* ${data.phone}\n*${t('contact.whatsapp_message.service')}* ${serviceLabel}\n*${t('contact.whatsapp_message.message')}* ${data.message || t('contact.whatsapp_message.no_message')}`;
    
    // Save to backup lead capture using hook
    saveLead({
      name: data.name,
      phone: data.phone,
      service: data.service,
      details: data.message,
      source: 'contact_form'
    });
    
    localStorage.removeItem('contact_form_draft');

    // Trigger Google Conversion Tracking if available
    if (typeof (window as any).gtag_report_conversion === 'function') {
      (window as any).gtag_report_conversion();
    }
    
    // Determine WhatsApp Number based on service
    const isCleaningService = data.service === 'cleaning' || 
                             data.service === 'home' || 
                             data.service === 'office' || 
                             data.service === 'building' || 
                             data.service === 'sterilization' ||
                             variant === 'cleaning';
    
    const whatsappNumber = isCleaningService ? siteConfig.contact.cleaningPhone : siteConfig.contact.pestPhone;
    
    // Create WhatsApp Link
    const whatsappUrl = siteConfig.links.whatsapp(whatsappNumber, whatsappText);
    
    // Redirect to WhatsApp
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(t('contact.success'));
      
      // Open WhatsApp after a brief delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        reset();
        setSubmitMessage('');
      }, 2000);
    }, 1000);
  };

  const onFieldChange = () => {
    // Save draft to localStorage
    const currentValues = {
      name: (document.getElementsByName('name')[0] as HTMLInputElement).value,
      phone: (document.getElementsByName('phone')[0] as HTMLInputElement).value,
      service: (document.getElementsByName('service')[0] as HTMLSelectElement).value,
      message: (document.getElementsByName('message')[0] as HTMLTextAreaElement).value,
    };
    localStorage.setItem('contact_form_draft', JSON.stringify(currentValues));
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
    } else if (variant === 'pest') {
      return [
        { value: '', label: t('contact.service_placeholder') },
        { value: 'insects', label: t('services.items.pest_control.title') },
        { value: 'rodents', label: t('services.items.rodent_control.title') },
        { value: 'termites', label: t('services.items.termite_control.title') },
        { value: 'prevention', label: t('services.items.prevention.title') },
      ];
    } else {
      return [
        { value: '', label: t('contact.service_placeholder') },
        { value: 'cleaning', label: t('nav.cleaning') },
        { value: 'pest', label: t('nav.pest') },
      ];
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section-padding bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="reveal w-16 h-1 bg-gradient-to-r from-blue-medium to-cyan-brand mx-auto mb-6 rounded-full"></div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-blue-dark mb-4" style={{ animationDelay: '0.1s' }}>
            {t('contact.title')}
          </h2>
          <p className="reveal text-gray-medium text-lg max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="reveal" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSubmit(onSubmit)} onChange={onFieldChange} className="bg-gray-light rounded-3xl p-8">
              <div className="space-y-6">
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder={t('contact.name')}
                    className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t(`contact.errors.${errors.name.message}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder={t('contact.phone')}
                    className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{t(`contact.errors.${errors.phone.message}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <select
                    {...register('service')}
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
                      <span>{t(`contact.errors.${errors.service.message}`)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <textarea
                    {...register('message')}
                    placeholder={t('contact.message')}
                    rows={4}
                    className="form-input resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-btn w-full text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
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
                  <div className="text-center text-green-600 font-medium animate-fadeIn">
                    {submitMessage}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="reveal space-y-6" style={{ animationDelay: '0.4s' }}>
            <a href="tel:69988979" className="contact-card group">
              <div className="contact-icon">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark mb-1">{t('contact.info.phone')}</h4>
                <p className="text-gray-medium group-hover:text-blue-medium transition-colors">69988979</p>
              </div>
            </a>

            <div className="contact-card">
              <div className="contact-icon">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark mb-1">{t('contact.info.address')}</h4>
                <p className="text-gray-medium">{t('footer.address')}</p>
              </div>
            </div>

            <a href="https://wa.me/96569988979" className="contact-card group">
              <div className="contact-icon" style={{ background: '#25d366' }}>
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark mb-1">{t('contact.info.whatsapp')}</h4>
                <p className="text-gray-medium group-hover:text-blue-medium transition-colors">96569988979</p>
              </div>
            </a>

            <a href="mailto:forty@fortyclean.com" className="contact-card group">
              <div className="contact-icon">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-dark mb-1">{t('contact.info.email')}</h4>
                <p className="text-gray-medium group-hover:text-blue-medium transition-colors">forty@fortyclean.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
