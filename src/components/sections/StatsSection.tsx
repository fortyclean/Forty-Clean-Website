import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface StatsSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const StatsSection = ({ variant = 'landing' }: StatsSectionProps) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getStats = () => {
    if (variant === 'landing') {
      return [
        { number: 500, suffix: '+', label: t('stats.happy_clients') },
        { number: 5, suffix: '+', label: t('stats.years_exp') },
        { number: 24, suffix: '/7', label: t('stats.service_24_7') },
      ];
    } else if (variant === 'cleaning') {
      return [
        { number: 300, suffix: '+', label: t('stats.clean_homes') },
        { number: 150, suffix: '+', label: t('stats.offices') },
        { number: 99, suffix: '%', label: t('stats.customer_satisfaction') },
      ];
    } else {
      return [
        { number: 1000, suffix: '+', label: t('stats.pest_operations') },
        { number: 6, suffix: ` ${t('stats.guarantee_months')}`, label: t('stats.guarantee') },
        { number: 100, suffix: '%', label: t('stats.effectiveness') },
      ];
    }
  };

  const stats = getStats();

  const AnimatedNumber = ({ value }: { value: number }) => {
    const spring = useSpring(0, { stiffness: 40, damping: 20 });
    const display = useTransform(spring, (current) => Math.floor(current));

    useEffect(() => {
      if (isInView) {
        spring.set(value);
      }
    }, [isInView, value, spring]);

    return <motion.span>{display}</motion.span>;
  };

  return (
    <section ref={ref} className="py-24 bg-blue-900 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-cyan-500/20 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative group text-center"
            >
              <div className="stat-number flex items-center justify-center gap-1 text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                <AnimatedNumber value={stat.number} />
                <span className="text-cyan-400">{stat.suffix}</span>
              </div>
              <div className="h-1.5 w-12 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
              <div className="stat-label text-blue-100/80 text-lg md:text-xl font-bold uppercase tracking-widest">
                {stat.label}
              </div>
              
              {/* Card Hover Effect */}
              <div className="absolute inset-0 -m-8 bg-white/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-95 group-hover:scale-100"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
