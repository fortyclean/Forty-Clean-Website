import { Clock, Award, Users, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../../hooks/useReveal';

interface WhyUsSectionProps {
  variant?: 'landing' | 'cleaning' | 'pest';
}

const WhyUsSection = ({ variant = 'landing' }: WhyUsSectionProps) => {
  const { t } = useTranslation();
  const { sectionRef } = useReveal();

  const getFeatures = () => {
    // ... same as before
    const commonFeatures = [
      {
        icon: Clock,
        title: t('why_us.features.service_24_7.title'),
        description: t('why_us.features.service_24_7.desc'),
      },
      {
        icon: Award,
        title: t('why_us.features.guarantee_6_months.title'),
        description: t('why_us.features.guarantee_6_months.desc'),
      },
      {
        icon: Users,
        title: t('why_us.features.specialized_team.title'),
        description: t('why_us.features.specialized_team.desc'),
      },
      {
        icon: Shield,
        title: t('why_us.features.safe_pesticides.title'),
        description: t('why_us.features.safe_pesticides.desc'),
      },
    ];

    if (variant === 'cleaning') {
      return [
        {
          icon: Sparkles,
          title: t('why_us.features.modern_equipment.title'),
          description: t('why_us.features.modern_equipment.desc'),
        },
        {
          icon: CheckCircle,
          title: t('why_us.features.quality_guarantee.title'),
          description: t('why_us.features.quality_guarantee.desc'),
        },
        {
          icon: Users,
          title: t('why_us.features.professional_team.title'),
          description: t('why_us.features.professional_team.desc'),
        },
        {
          icon: Clock,
          title: t('why_us.features.punctual_timing.title'),
          description: t('why_us.features.punctual_timing.desc'),
        },
      ];
    } else if (variant === 'pest') {
      return [
        {
          icon: Shield,
          title: t('why_us.features.safe_pesticides.title'),
          description: t('why_us.features.safe_pesticides.desc'),
        },
        {
          icon: Award,
          title: t('why_us.features.guarantee_6_months.title'),
          description: t('why_us.features.guarantee_6_months.desc'),
        },
        {
          icon: Users,
          title: t('why_us.features.specialized_team.title'),
          description: t('why_us.features.specialized_team.desc'),
        },
        {
          icon: CheckCircle,
          title: t('why_us.features.free_visit.title'),
          description: t('why_us.features.free_visit.desc'),
        },
      ];
    }

    return commonFeatures;
  };

  const getTitle = () => {
    if (variant === 'landing') return t('why_us.title_landing');
    if (variant === 'cleaning') return t('why_us.title_cleaning');
    return t('why_us.title_pest');
  };

  const features = getFeatures();

  return (
    <section id="why-us" ref={sectionRef} className="section-padding bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="reveal h-1 w-16 bg-gradient-to-r from-blue-medium to-cyan-brand mx-auto mb-6 rounded-full"></div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-blue-dark mb-4">
            {getTitle()}
          </h2>
          <p className="reveal text-gray-medium text-lg max-w-2xl mx-auto" style={{ transitionDelay: '0.1s' }}>
            {t('why_us.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group reveal"
              style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-medium/10 to-cyan-brand/10 flex items-center justify-center mx-auto mb-5 group-hover:from-blue-medium group-hover:to-cyan-brand transition-all duration-300">
                <feature.icon className="w-8 h-8 text-blue-medium group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-blue-medium mb-3">{feature.title}</h3>
              <p className="text-gray-medium leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
