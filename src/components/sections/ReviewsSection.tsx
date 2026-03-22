import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ReviewsSection = () => {
  const { t, i18n } = useTranslation();

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const reviews = t('reviews.items', { returnObjects: true }) as any[];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 text-yellow-700 text-sm font-bold mb-6"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>{t('reviews.google_rating')}</span>
            <span className="ml-2 border-l border-yellow-200 pl-2 text-yellow-800">4.9/5</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black text-blue-900 mb-4">{t('reviews.title')}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Reviews Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group hover:shadow-2xl transition-all duration-300"
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
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {review.name.charAt(0)}
                </div>
                <div className={`${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-black text-blue-900">{review.name}</h4>
                  <p className="text-sm text-gray-400">عميل موثق</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
