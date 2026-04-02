import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReveal } from '../../hooks/useReveal';

interface ReviewItem {
  name: string;
  text: string;
  rating: number;
}

const ReviewsSection = () => {
  const { t, i18n } = useTranslation();
  const { sectionRef } = useReveal();
  const reviews = t('reviews.items', { returnObjects: true }) as ReviewItem[];

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 text-sm font-bold mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>{t('reviews.google_rating')}</span>
            <span className="ml-2 border-l border-yellow-200 pl-2 text-yellow-800">4.9/5</span>
          </div>

          <h2 className="reveal text-3xl md:text-5xl font-black text-blue-900 mb-4" style={{ transitionDelay: '0.05s' }}>
            {t('reviews.title')}
          </h2>
          <p className="reveal text-gray-500 text-lg max-w-2xl mx-auto font-medium" style={{ transitionDelay: '0.1s' }}>
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="reveal bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group hover:shadow-2xl transition-all duration-300"
              style={{ transitionDelay: `${0.12 * (index + 1)}s` }}
            >
              <div className="absolute top-8 right-8 text-blue-50 group-hover:text-blue-100 transition-colors">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 relative z-10 font-medium">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
                  {review.name.charAt(0)}
                </div>
                <div className={i18n.language === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="font-black text-blue-900">{review.name}</h4>
                  <p className="text-sm text-gray-400 font-bold">
                    {i18n.language === 'ar' ? 'عميل موثق' : 'Verified customer'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-16 text-center" style={{ transitionDelay: '0.2s' }}>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col items-center gap-2 group"
          >
            <span className="text-gray-400 text-sm font-bold group-hover:text-blue-600 transition-colors">
              {t('reviews.based_on')}
            </span>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-100 group-hover:border-blue-200 transition-all">
              <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-5" />
              <span className="font-bold text-blue-900">Maps</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
