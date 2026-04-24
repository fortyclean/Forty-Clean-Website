type SiteLanguage = 'ar' | 'en';

type WhatsAppMessageInput = {
  language?: string;
  service?: string;
  intent?: 'general' | 'quote' | 'booking' | 'offer';
  details?: string;
};

const resolveLanguage = (language?: string): SiteLanguage => (language === 'en' ? 'en' : 'ar');

export const buildWhatsAppMessage = ({
  language,
  service,
  intent = 'general',
  details,
}: WhatsAppMessageInput) => {
  const lang = resolveLanguage(language);

  const serviceLine = service
    ? lang === 'ar'
      ? `الخدمة المطلوبة: ${service}`
      : `Requested service: ${service}`
    : lang === 'ar'
      ? 'الخدمة المطلوبة: أحتاج إلى ترشيح الخدمة الأنسب'
      : 'Requested service: I need help choosing the most suitable service';

  const intentLine =
    lang === 'ar'
      ? {
          general: 'أرغب في معرفة التفاصيل المتاحة وطريقة التنفيذ المناسبة.',
          quote: 'أرغب في الحصول على عرض سعر مناسب ومعرفة أقرب موعد متاح.',
          booking: 'أرغب في تأكيد الحجز وترتيب الموعد المناسب في أقرب وقت.',
          offer: 'أرغب في الاستفادة من العرض ومعرفة التفاصيل الكاملة قبل التأكيد.',
        }[intent]
      : {
          general: 'I would like to know the available details and the recommended service process.',
          quote: 'I would like to receive pricing and know the nearest available appointment.',
          booking: 'I would like to confirm the booking and arrange the most suitable appointment.',
          offer: 'I would like to claim the offer and receive the full details before confirming.',
        }[intent];

  const intro = lang === 'ar' ? 'مرحبًا فريق فورتي،' : 'Hello Forty team,';
  const closing =
    lang === 'ar'
      ? 'أرجو التكرم بالتواصل معي بالتفاصيل المناسبة. شكرًا لكم.'
      : 'Please contact me with the suitable details. Thank you.';

  const lines = [
    intro,
    '',
    serviceLine,
    intentLine,
    details ? (lang === 'ar' ? `تفاصيل إضافية: ${details}` : `Additional details: ${details}`) : '',
    '',
    closing,
  ].filter(Boolean);

  return lines.join('\n');
};

export const siteConfig = {
  name: 'Forty',
  nameAr: 'فورتي',
  legalNameAr: 'شركة فورتي خدمات التنظيف العامه للمباني ذ.م.م',
  crNumber: '384145',
  licenseNumber: '2018/2912',
  establishedYear: '2018',
  contact: {
    primaryPhone: '69988979',
    cleaningPhone: '69988979',
    pestPhone: '69988979',
    email: 'forty@fortyclean.com',
    address: 'العاصمة - المرقاب - قطعة 15 - شارع الوزان - مبنى بيت التمويل الكويتي - الدور الخامس - مكتب رقم 1',
    addressEn: 'Capital - Al-Mirqab - Block 15 - Al-Wazzan St - KFH Building - 5th Floor - Office 1',
  },
  socials: {
    facebook: 'FortyClean.kw',
    instagram: 'fortyclean_kw',
    x: 'CleanForty',
    threads: 'fortyclean_kw',
    snapchat: 'forty.kw',
    linkedin: 'fortyclean',
    pinterest: 'forty0854',
    tiktok: 'forty.kw',
  },
  links: {
    whatsapp: (phone: string, text: string) => `https://wa.me/965${phone}?text=${encodeURIComponent(text)}`,
    whatsappDirect: (phone: string, text: string) => `https://wa.me/965${phone}?text=${encodeURIComponent(text)}`,
    phone: (phone: string) => `tel:${phone}`,
    email: (email: string) => `mailto:${email}`,
  },
};
