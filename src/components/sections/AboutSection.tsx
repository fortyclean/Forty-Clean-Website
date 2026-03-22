import { CheckCircle, Award, Shield, Star, Users, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface AboutSectionProps {
  variant?: 'cleaning' | 'pest';
}

const AboutSection = ({ variant = 'cleaning' }: AboutSectionProps) => {
  const { t } = useTranslation();

  const getContent = () => {
    if (variant === 'cleaning') {
      return {
        title: t('about.title'),
        subtitle: t('about.cleaning_subtitle'),
        description: t('about.cleaning_description'),
        features: t('about.features.cleaning', { returnObjects: true }) as string[],
        icon: Shield,
        accentColor: 'blue',
      };
    } else {
      return {
        title: t('about.title'),
        subtitle: t('about.pest_subtitle'),
        description: t('about.pest_description'),
        features: t('about.features.pest', { returnObjects: true }) as string[],
        icon: Award,
        accentColor: 'red',
      };
    }
  };

  const content = getContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    }
  };

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image with decorative border */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img 
                src={variant === 'cleaning' ? '/images/home-cleaning-kuwait.webp' : '/images/pest-control-kuwait.webp'} 
                alt={t(`nav.${variant}`)} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            </div>

            {/* Floating Experience Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-blue-50 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-black text-blue-900">+5</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('about.years_exp')}</div>
              </div>
            </motion.div>

            {/* Floating Trust Card */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-blue-50 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-white">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-black text-blue-900">+500</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('about.happy_clients')}</div>
              </div>
            </motion.div>

            {/* Background Decorations */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50 -z-10"></div>
          </motion.div>

          {/* Content Side */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 uppercase tracking-widest">
                <Star className="w-4 h-4 fill-current" />
                {t('about.title')}
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-blue-900 leading-tight mb-6">
                {content.subtitle}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed font-medium">
                {content.description}
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-blue-900 font-bold text-sm">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <a 
                href="#contact" 
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl active:scale-95"
              >
                <span>{t('contact.title')}</span>
                <CheckCircle className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
