import { useState, useRef } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface BeforeAfterItem {
  before: string;
  after: string;
  title: string;
  description: string;
}

const BeforeAfterSection = () => {
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeItem, setActiveItem] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const items: BeforeAfterItem[] = [
    {
      before: '/images/office-cleaning-service.webp',
      after: '/images/home-cleaning-kuwait.webp',
      title: t('before_after.cleaning.title'),
      description: t('before_after.cleaning.desc'),
    },
    {
      before: '/images/pest-extermination-service.webp',
      after: '/images/pest-control-kuwait.webp',
      title: t('before_after.pest.title'),
      description: t('before_after.pest.desc'),
    }
  ];

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const position = ((x - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, position)));
    }
  };

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
          <h2 className="text-3xl md:text-5xl font-black text-blue-900 mb-4">{t('before_after.title')}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
            {t('before_after.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-4 space-y-4">
            {items.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveItem(index)}
                className={`block w-full text-right p-6 rounded-[2rem] transition-all border-2 ${
                  activeItem === index 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105 z-10' 
                  : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                }`}
              >
                <h3 className="text-xl font-black mb-2">{item.title}</h3>
                <p className={`text-sm font-medium ${activeItem === index ? 'text-blue-100' : 'text-gray-400'}`}>
                  {item.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Slider Container */}
          <div className="lg:col-span-8">
            <motion.div 
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl cursor-col-resize select-none border-[6px] md:border-[12px] border-white bg-gray-100"
              onMouseMove={(e) => e.buttons === 1 && handleInteraction(e)}
              onTouchMove={handleInteraction}
              onClick={handleInteraction}
            >
              {/* After Image */}
              <img 
                src={items[activeItem].after} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Before Image (Clipped) */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src={items[activeItem].before} 
                  alt="Before" 
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                />
              </div>

              {/* Slider Handle */}
              <motion.div 
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-blue-600 border-4 border-blue-50">
                  <div className="flex gap-1 animate-pulse">
                    <MoveLeft className="w-4 h-4" />
                    <MoveRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* Labels */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-blue-900 text-sm font-black z-20 shadow-lg border border-white/20">
                {t('before_after.after')}
              </div>
              <div className="absolute top-6 right-6 bg-blue-900/90 backdrop-blur-md px-5 py-2 rounded-2xl text-white text-sm font-black z-20 shadow-lg border border-white/10">
                {t('before_after.before')}
              </div>

              {/* Tooltip hint */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-[10px] px-4 py-1.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                اسحب المقبض للمقارنة
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
