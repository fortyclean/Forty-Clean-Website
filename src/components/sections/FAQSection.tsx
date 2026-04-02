import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveItem] = useState<number | null>(0);
  const { sectionRef } = useReveal();

  const faqs = t('faq.items', { returnObjects: true }) as FAQItem[];

  return (
    <section ref={sectionRef} className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="reveal h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>
          <h2 className="reveal text-3xl md:text-5xl font-black text-blue-900 dark:text-white mb-4">{t('faq.title')}</h2>
          <p className="reveal text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium" style={{ transitionDelay: '0.1s' }}>
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`reveal rounded-[2rem] border-2 transition-all overflow-hidden ${
                activeIndex === index 
                ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20' 
                : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
              style={{ transitionDelay: `${0.08 * (index + 1)}s` }}
            >
              <button
                onClick={() => setActiveItem(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-right gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400'
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className={`text-lg md:text-xl font-black transition-colors ${
                    activeIndex === index ? 'text-blue-900 dark:text-blue-400' : 'text-gray-700 dark:text-slate-300'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  activeIndex === index ? 'border-blue-600 bg-blue-600 text-white rotate-90' : 'border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500'
                }`}>
                  {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-8 pb-8 pt-2 md:px-20">
                    <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed font-medium border-r-4 border-blue-200 dark:border-blue-900 pr-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
