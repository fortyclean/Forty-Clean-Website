import { Home, Building2, SprayCan, ShieldCheck, Bug, Rat, Droplets, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { siteConfig } from '../../config/site';

interface ServicesSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const ServicesSection = ({ variant = 'landing' }: ServicesSectionProps) => {
  const { t, i18n } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const getServices = () => {
    // ... same as before
    if (variant === 'landing') {
      return [
        {
          icon: Home,
          title: t('services.items.home_cleaning.title'),
          description: t('services.items.home_cleaning.desc'),
          link: '#cleaning',
        },
        {
          icon: Bug,
          title: t('services.items.pest_control.title'),
          description: t('services.items.pest_control.desc'),
          link: '#pest',
        },
        {
          icon: Rat,
          title: t('services.items.rodent_control.title'),
          description: t('services.items.rodent_control.desc'),
          link: '#pest',
        },
        {
          icon: Building2,
          title: t('services.items.office_cleaning.title'),
          description: t('services.items.office_cleaning.desc'),
          link: '#cleaning',
        },
      ];
    } else if (variant === 'cleaning') {
      return [
        {
          icon: Home,
          title: t('services.items.home_cleaning.title'),
          description: t('services.items.home_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, t('contact.success')),
        },
        {
          icon: Building2,
          title: t('services.items.office_cleaning.title'),
          description: t('services.items.office_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, t('contact.success')),
        },
        {
          icon: SprayCan,
          title: t('services.items.building_cleaning.title'),
          description: t('services.items.building_cleaning.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, t('contact.success')),
        },
        {
          icon: ShieldCheck,
          title: t('services.items.sterilization.title'),
          description: t('services.items.sterilization.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.cleaningPhone, t('contact.success')),
        },
      ];
    } else {
      return [
        {
          icon: Bug,
          title: t('services.items.pest_control.title'),
          description: t('services.items.pest_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, t('contact.success')),
        },
        {
          icon: Rat,
          title: t('services.items.rodent_control.title'),
          description: t('services.items.rodent_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, t('contact.success')),
        },
        {
          icon: Droplets,
          title: t('services.items.termite_control.title'),
          description: t('services.items.termite_control.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, t('contact.success')),
        },
        {
          icon: ShieldCheck,
          title: t('services.items.prevention.title'),
          description: t('services.items.prevention.desc'),
          link: siteConfig.links.whatsapp(siteConfig.contact.pestPhone, t('contact.success')),
        },
      ];
    }
  };

  const getTitle = () => {
    if (variant === 'landing') return t('services.title_landing');
    if (variant === 'cleaning') return t('services.title_cleaning');
    return t('services.title_pest');
  };

  const getSubtitle = () => {
    if (variant === 'landing') return t('services.subtitle_landing');
    if (variant === 'cleaning') return t('services.subtitle_cleaning');
    return t('services.subtitle_pest');
  };

  const services = getServices();

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-blue-900 mb-4"
          >
            {getTitle()}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium px-4"
          >
            {getSubtitle()}
          </motion.p>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-blue-50 group hover:-translate-y-2 duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-6 shadow-sm">
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-blue-600 transition-colors">{service.title}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium">{service.description}</p>
              <a
                href={service.link}
                className="inline-flex items-center gap-2 text-blue-600 font-black text-sm group-hover:gap-4 transition-all"
              >
                <span>{t('services.cta')}</span>
                <ArrowLeft className={`w-5 h-5 transition-transform ${i18n.language === 'ar' ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
