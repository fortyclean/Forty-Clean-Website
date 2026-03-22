import { MapPin, CheckCircle, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const CoverageAreasSection = () => {
  const { t } = useTranslation();

  const areas = [
    { name: t('coverage.areas.asima.name'), sub: t('coverage.areas.asima.sub') },
    { name: t('coverage.areas.hawalli.name'), sub: t('coverage.areas.hawalli.sub') },
    { name: t('coverage.areas.farwaniya.name'), sub: t('coverage.areas.farwaniya.sub') },
    { name: t('coverage.areas.ahmadi.name'), sub: t('coverage.areas.ahmadi.sub') },
    { name: t('coverage.areas.mubarak.name'), sub: t('coverage.areas.mubarak.sub') },
    { name: t('coverage.areas.jahra.name'), sub: t('coverage.areas.jahra.sub') },
  ];

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
    }
  };

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
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
            {t('coverage.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            {t('coverage.subtitle')}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {areas.map((area, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-blue-50/50 group hover:-translate-y-2 duration-500"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-200">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-blue-900 group-hover:text-blue-600 transition-colors duration-300">{area.name}</h3>
              </div>
              <p className="text-gray-500 text-base leading-relaxed mb-8 font-medium">
                {area.sub}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('coverage.available')}</span>
                </div>
                <Navigation className="w-5 h-5 text-blue-200 group-hover:text-blue-600 group-hover:rotate-12 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-gradient-to-br from-blue-900 to-blue-800 rounded-[3rem] p-12 text-center text-white shadow-2xl overflow-hidden relative group"
        >
          {/* Abstract background shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-6">{t('coverage.not_listed_title')}</h3>
            <p className="text-blue-100/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              {t('coverage.not_listed_desc')}
            </p>
            <a 
              href="tel:69988979" 
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-12 py-5 rounded-[2rem] font-black hover:bg-cyan-brand hover:text-white transition-all shadow-xl hover:shadow-cyan-400/20 active:scale-95 duration-300"
            >
              <MapPin className="w-6 h-6" />
              <span>{t('coverage.inquire')}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoverageAreasSection;
