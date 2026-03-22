import { useTranslation } from 'react-i18next';
import { Calendar } from './ui/calendar';
import { Clock, Calendar as CalendarIcon, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  className?: string;
}

const timeSlots = [
  '09_00', '10_00', '11_00', '12_00',
  '13_00', '14_00', '15_00', '16_00',
  '17_00', '18_00', '19_00', '20_00',
  '21_00', '22_00'
];

export const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  className
}: BookingCalendarProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={cn("space-y-8", className)} dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-900 font-bold mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl">{t('calculator.booking.select_date')}</span>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden flex justify-center mx-auto w-full transition-all hover:border-blue-100">
            <Calendar
              mode="single"
              locale={isRTL ? ar : enUS}
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => {
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return date < now || date.getDay() === 5;
              }}
              className="p-0 border-none w-full flex justify-center"
              classNames={{
                months: "flex flex-col space-y-4 w-full items-center",
                month: "space-y-6 w-full max-w-md",
                month_caption: "flex justify-center pt-1 relative items-center mb-6 w-full",
                caption_label: "text-xl font-black text-blue-900 tracking-tight",
                nav: "flex items-center justify-between absolute inset-x-0 z-10 w-full px-2",
                button_previous: cn(
                  "h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                ),
                button_next: cn(
                  "h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                ),
                table: "w-full border-collapse",
                weekdays: "flex justify-between mb-4 border-b border-gray-50 pb-2",
                weekday: "text-gray-400 font-bold text-[0.85rem] uppercase flex-1 text-center",
                week: "flex w-full mt-2 justify-between",
                day: cn(
                  "h-12 w-12 p-0 font-black transition-all rounded-2xl hover:bg-blue-50 hover:text-blue-600 aspect-square flex items-center justify-center text-blue-900/80 text-base"
                ),
                selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-lg shadow-blue-200 scale-110",
                today: "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100",
                outside: "text-gray-200 opacity-30",
                disabled: "text-gray-200 opacity-20 cursor-not-allowed hover:bg-transparent",
                hidden: "invisible",
              }}
              components={{
                Chevron: (props) => {
                  if (props.orientation === 'left') {
                    return isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />;
                  }
                  return isRTL ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />;
                }
              }}
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-900 font-bold mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl">{t('calculator.booking.select_time')}</span>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-2xl transition-all hover:border-blue-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  className={cn(
                    "py-5 px-3 rounded-[1.5rem] text-sm font-black transition-all border-2 flex flex-col items-center justify-center gap-2",
                    selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-105"
                      : "bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 active:scale-95"
                  )}
                >
                  {selectedTime === time && <Check className="w-4 h-4 animate-in zoom-in-50 duration-300" />}
                  <span className="tracking-tight">{t(`calculator.booking.times.${time}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 shadow-xl shadow-emerald-50">
          <div className="flex items-center gap-5 w-full">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md ring-4 ring-emerald-50">
              <Check className="w-10 h-10" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-sm text-emerald-600 font-black mb-1 uppercase tracking-widest">{t('calculator.booking.selected_datetime')}</p>
              <p className="text-blue-900 text-xl md:text-2xl font-black">
                {formatDate(selectedDate)} <span className="text-emerald-300 mx-3">|</span> {t(`calculator.booking.times.${selectedTime}`)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

