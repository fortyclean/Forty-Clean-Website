import { useTranslation } from 'react-i18next';
import { useReveal } from '../../hooks/useReveal';

interface StatsSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const StatsSection = ({ variant = 'landing' }: StatsSectionProps) => {
  const { t } = useTranslation();
  const { sectionRef } = useReveal();

  const getStats = () => {
    if (variant === 'landing') {
      return [
        { number: 500, suffix: '+', label: t('stats.happy_clients') },
        { number: 5, suffix: '+', label: t('stats.years_exp') },
        { number: 24, suffix: '/7', label: t('stats.service_24_7') },
      ];
    }

    if (variant === 'cleaning') {
      return [
        { number: 300, suffix: '+', label: t('stats.clean_homes') },
        { number: 150, suffix: '+', label: t('stats.offices') },
        { number: 99, suffix: '%', label: t('stats.customer_satisfaction') },
      ];
    }

    return [
      { number: 1000, suffix: '+', label: t('stats.pest_operations') },
      { number: 6, suffix: ` ${t('stats.guarantee_months')}`, label: t('stats.guarantee') },
      { number: 100, suffix: '%', label: t('stats.effectiveness') },
    ];
  };

  const stats = getStats();

  return (
    <section ref={sectionRef} className="py-24 bg-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-cyan-500/20 blur-3xl animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="reveal relative group text-center"
              style={{ transitionDelay: `${0.15 * (index + 1)}s` }}
            >
              <div className="stat-number flex items-center justify-center gap-1 text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                <span>{stat.number}</span>
                <span className="text-cyan-400">{stat.suffix}</span>
              </div>
              <div className="h-1.5 w-12 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
              <div className="stat-label text-lg font-bold uppercase tracking-widest text-blue-50 md:text-xl dark:text-slate-100">
                {stat.label}
              </div>
              <div className="absolute inset-0 -m-8 bg-white/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm scale-95 group-hover:scale-100"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
