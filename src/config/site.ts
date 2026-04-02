export const siteConfig = {
  name: 'Forty',
  nameAr: 'فورتي',
  contact: {
    primaryPhone: '69988979',
    cleaningPhone: '51004910',
    pestPhone: '69988979',
    email: 'forty@fortyclean.com',
    address: 'المرقاب - قطعة 1 - شارع الوزان - برج العدالة - الدور الخامس - مكتب رقم 1',
    addressEn: 'Al-Mirqab - Block 1 - Al-Wazzan St - Al-Adala Tower - 5th Floor - Office 1',
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
    phone: (phone: string) => `tel:${phone}`,
    email: (email: string) => `mailto:${email}`,
  },
};
