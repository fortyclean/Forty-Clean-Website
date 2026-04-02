import { siteConfig } from '../config/site';

type ServiceType = 'cleaning' | 'pest';

interface BookingDetailsInput {
  serviceType: ServiceType;
  details: {
    rooms: number;
    halls: number;
    bathrooms: number;
    kitchens: number;
    floors: number;
    area: number;
    pestType: string;
  };
  t: (key: string) => string;
}

interface BookingSubmissionInput extends BookingDetailsInput {
  selectedDate?: Date;
  selectedTime: string;
  isRTL: boolean;
  price: number;
  userInfo: {
    name: string;
    phone: string;
    address: string;
  };
  saveLead: (payload: {
    name: string;
    phone: string;
    service: ServiceType;
    price: number;
    details: string;
    source: 'booking_system';
  }) => Promise<{ trackingCode: string }>;
  setUser: (user: { id: string; name: string; phone: string; address?: string }) => void;
  currentUserId?: string;
  addToCart: (item: {
    id: string;
    service: ServiceType;
    price: number;
    details: { leadDetails: string; date?: string; time?: string };
  }) => void;
}

export const buildLeadDetails = ({ serviceType, details, t }: BookingDetailsInput) => {
  if (serviceType === 'pest') {
    return `${t('booking.whatsapp.details')}: ${t(`calculator.pest_types.${details.pestType}`)}, ${t('calculator.whatsapp_message.rooms')}: ${details.rooms}, ${t('calculator.whatsapp_message.halls')}: ${details.halls}, ${t('calculator.whatsapp_message.bathrooms')}: ${details.bathrooms}`;
  }

  return `${t('calculator.whatsapp_message.floors')}: ${details.floors}, ${t('calculator.whatsapp_message.area')}: ${details.area}${t('calculator.area_unit')}, ${t('calculator.whatsapp_message.kitchens')}: ${details.kitchens}, ${t('calculator.whatsapp_message.bathrooms')}: ${details.bathrooms}`;
};

export const formatBookingDate = ({
  selectedDate,
  isRTL,
}: {
  selectedDate?: Date;
  isRTL: boolean;
}) => {
  return selectedDate?.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const submitBooking = async ({
  serviceType,
  details,
  selectedDate,
  selectedTime,
  isRTL,
  price,
  userInfo,
  saveLead,
  setUser,
  currentUserId,
  addToCart,
  t,
}: BookingSubmissionInput) => {
  const leadDetails = buildLeadDetails({ serviceType, details, t });
  const formattedDate = formatBookingDate({ selectedDate, isRTL });

  setUser({
    id: currentUserId || crypto.randomUUID(),
    name: userInfo.name,
    phone: userInfo.phone,
    address: userInfo.address,
  });

  const savedLead = await saveLead({
    name: userInfo.name,
    phone: userInfo.phone,
    service: serviceType,
    price,
    details: `${leadDetails} | ${t('booking.whatsapp.appointment')}: ${formattedDate} ${t(`calculator.booking.times.${selectedTime}`)} | ${t('booking.whatsapp.address')}: ${userInfo.address}`,
    source: 'booking_system',
  });

  addToCart({
    id: crypto.randomUUID(),
    service: serviceType,
    price,
    details: { leadDetails, date: formattedDate, time: selectedTime },
  });

  const whatsappNumber = serviceType === 'cleaning'
    ? siteConfig.contact.cleaningPhone
    : siteConfig.contact.pestPhone;

  const whatsappText = `${t('booking.whatsapp.new_booking')}\n\n${t('booking.whatsapp.service')}: ${serviceType === 'cleaning' ? t('booking.whatsapp.cleaning') : t('booking.whatsapp.pest')}\n${t('booking.whatsapp.details')}: ${leadDetails}\n${t('booking.whatsapp.appointment')}: ${formattedDate} ${t(`calculator.booking.times.${selectedTime}`)}\n${t('booking.whatsapp.name')}: ${userInfo.name}\n${t('booking.whatsapp.phone')}: ${userInfo.phone}\n${t('booking.whatsapp.address')}: ${userInfo.address}\n${t('booking.whatsapp.price')}: ${price} ${t('calculator.currency')}\n${isRTL ? 'كود التتبع' : 'Tracking code'}: ${savedLead.trackingCode}`;

  window.open(siteConfig.links.whatsapp(whatsappNumber, whatsappText), '_blank');

  return savedLead.trackingCode;
};
