import { Sparkles, Bug, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LandingCards = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    }
  };

  const cards = [
    {
      id: 'cleaning',
      icon: Sparkles,
      image: '/images/professional-cleaning-kuwait.webp',
      title: t('landing_cards.cleaning.title'),
      description: t('landing_cards.cleaning.desc'),
      features: [
        t('services.items.home_cleaning.title'),
        t('services.items.office_cleaning.title'),
        t('services.items.building_cleaning.title'),
        t('services.items.sterilization.title')
      ],
      color: 'from-blue-500 to-cyan-500',
      link: '/cleaning',
    },
    {
      id: 'pest',
      icon: Bug,
      image: '/images/pest-extermination-service.webp',
      title: t('landing_cards.pest.title'),
      description: t('landing_cards.pest.desc'),
      features: [
        t('services.items.pest_control.title'),
        t('services.items.rodent_control.title'),
        t('services.items.termite_control.title'),
        t('services.items.prevention.title')
      ],
      color: 'from-red-500 to-orange-500',
      link: '/pest',
    },
  ];

  return (
    <section id="services" className="section-padding bg-gray-light overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-medium to-cyan-brand mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-blue-dark mb-4"
          >
            {t('landing_cards.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-medium text-lg max-w-2xl mx-auto"
          >
            {t('landing_cards.subtitle')}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {cards.map((card) => (
            <motion.div key={card.id} variants={itemVariants}>
              <Link
                to={card.link}
                className="landing-card group overflow-hidden block h-full"
              >
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg transform group-hover:translate-y-[-5px] transition-transform duration-500">
                    <card.icon className="w-8 h-8 text-blue-medium" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="landing-card-content p-8">
                  <h3 className="text-2xl font-bold text-blue-dark mb-3 group-hover:text-blue-medium transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-medium mb-6 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.color}`}></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-2 text-blue-medium font-bold group-hover:gap-3 transition-all duration-300">
                      <span>{t('landing_cards.discover_more')}</span>
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-[360deg] transition-transform duration-700`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCards;
