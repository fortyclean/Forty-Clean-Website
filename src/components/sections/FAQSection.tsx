import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveItem] = useState<number | null>(0);

  const faqs = t('faq.items', { returnObjects: true }) as FAQItem[];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"
          ></motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-blue-900 mb-4">{t('faq.title')}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-[2rem] border-2 transition-all overflow-hidden ${
                activeIndex === index 
                ? 'border-blue-600 bg-blue-50/30' 
                : 'border-gray-100 bg-white hover:border-blue-200'
              }`}
            >
              <button
                onClick={() => setActiveItem(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-right gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-600'
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className={`text-lg md:text-xl font-black transition-colors ${
                    activeIndex === index ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  activeIndex === index ? 'border-blue-600 bg-blue-600 text-white rotate-90' : 'border-gray-200 text-gray-400'
                }`}>
                  {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 pt-2 md:px-20">
                      <p className="text-gray-600 text-lg leading-relaxed font-medium border-r-4 border-blue-200 pr-6">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
