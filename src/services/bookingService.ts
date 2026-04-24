type BookingDetails = {
  rooms: number;
  halls: number;
  bathrooms: number;
  kitchens: number;
  floors: number;
  area: number;
  pestType: string;
};

type BookingUserInfo = {
  name: string;
  phone: string;
  address: string;
};

type SaveLeadInput = {
  name: string;
  phone: string;
  price: number;
  service: 'cleaning' | 'pest';
  details: string;
  source: 'booking_system';
};

type SubmitBookingInput = {
  serviceType: 'cleaning' | 'pest';
  details: BookingDetails;
  selectedDate?: Date;
  selectedTime: string;
  isRTL: boolean;
  price: number;
  userInfo: BookingUserInfo;
  saveLead: (input: SaveLeadInput) => Promise<{ id: string; trackingCode: string }>;
  setUser: (user: { id: string; name: string; phone: string; address?: string } | null) => void;
  currentUserId?: string;
  addToCart: (item: {
    id: string;
    service: 'cleaning' | 'pest';
    price: number;
    details: {
      leadDetails: string;
      date?: string;
      time?: string;
    };
  }) => void;
  t: (key: string) => string;
};

const buildBookingDetails = ({
  serviceType,
  details,
  selectedDate,
  selectedTime,
  isRTL,
  t,
}: Pick<SubmitBookingInput, 'serviceType' | 'details' | 'selectedDate' | 'selectedTime' | 'isRTL' | 't'>) => {
  const bookingDate = selectedDate
    ? selectedDate.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  if (serviceType === 'cleaning') {
    const summary = isRTL
      ? `تنظيف شامل: ${details.floors} أدوار، مساحة تقريبية ${details.area} م2، ${details.kitchens} مطابخ، ${details.bathrooms} حمامات.`
      : `Full cleaning: ${details.floors} floors, approx. area ${details.area} m2, ${details.kitchens} kitchens, ${details.bathrooms} bathrooms.`;

    return [summary, bookingDate ? `${t('booking.whatsapp.selected_time')}: ${bookingDate}` : '', selectedTime ? `${t('booking.whatsapp.at_time')} ${t(`calculator.booking.times.${selectedTime}`)}` : '']
      .filter(Boolean)
      .join('\n');
  }

  const pestLabel = t(`calculator.pest_types.${details.pestType}`);
  const summary = isRTL
    ? `مكافحة حشرات (${pestLabel}): ${details.rooms} غرف، ${details.halls} صالات، ${details.kitchens} مطابخ، ${details.bathrooms} حمامات.`
    : `Pest control (${pestLabel}): ${details.rooms} rooms, ${details.halls} halls, ${details.kitchens} kitchens, ${details.bathrooms} bathrooms.`;

  return [summary, bookingDate ? `${t('booking.whatsapp.selected_time')}: ${bookingDate}` : '', selectedTime ? `${t('booking.whatsapp.at_time')} ${t(`calculator.booking.times.${selectedTime}`)}` : '']
    .filter(Boolean)
    .join('\n');
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
}: SubmitBookingInput) => {
  const leadDetails = buildBookingDetails({
    serviceType,
    details,
    selectedDate,
    selectedTime,
    isRTL,
    t,
  });

  const savedLead = await saveLead({
    name: userInfo.name.trim(),
    phone: userInfo.phone.trim(),
    price,
    service: serviceType,
    details: `${leadDetails}\n${isRTL ? 'العنوان' : 'Address'}: ${userInfo.address.trim()}`,
    source: 'booking_system',
  });

  setUser({
    id: currentUserId || savedLead.trackingCode,
    name: userInfo.name.trim(),
    phone: userInfo.phone.trim(),
    address: userInfo.address.trim(),
  });

  addToCart({
    id: savedLead.trackingCode,
    service: serviceType,
    price,
    details: {
      leadDetails,
      date: selectedDate ? selectedDate.toISOString() : undefined,
      time: selectedTime || undefined,
    },
  });

  return savedLead.trackingCode;
};
