import { useTranslation } from 'react-i18next';
import { Calendar } from './ui/calendar';
import { Clock, Calendar as CalendarIcon, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ar } from 'date-fns/locale/ar';
import { enUS } from 'date-fns/locale/en-US';

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
    <div className={cn("space-y-6", className)} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Date Selection */}
        <div className="w-full md:w-1/2 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-white font-bold">
            <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">{t('calculator.booking.select_date')}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl overflow-hidden flex justify-center mx-auto w-full transition-all hover:border-blue-100 dark:hover:border-blue-900">
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
              className="p-0 border-none w-full flex justify-center scale-90"
              classNames={{
                months: "flex flex-col space-y-2 w-full items-center",
                month: "space-y-4 w-full max-w-sm",
                month_caption: "flex justify-center pt-1 relative items-center mb-4 w-full",
                caption_label: "text-lg font-black text-blue-900 dark:text-white tracking-tight",
                nav: "flex items-center justify-between absolute inset-x-0 z-10 w-full px-1",
                button_previous: cn(
                  "h-8 w-8 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                ),
                button_next: cn(
                  "h-8 w-8 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                ),
                table: "w-full border-collapse",
                weekdays: "flex justify-between mb-2 border-b border-gray-50 dark:border-slate-700 pb-1",
                weekday: "text-gray-400 dark:text-slate-500 font-bold text-[0.75rem] uppercase flex-1 text-center",
                week: "flex w-full mt-1 justify-between",
                day: cn(
                  "h-10 w-10 p-0 font-black transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 aspect-square flex items-center justify-center text-blue-900/80 dark:text-slate-300 text-sm"
                ),
                selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40 scale-105",
                today: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-100 dark:ring-emerald-900/50",
                outside: "text-gray-200 dark:text-slate-700 opacity-30",
                disabled: "text-gray-200 dark:text-slate-700 opacity-20 cursor-not-allowed",
                hidden: "invisible",
              }}
              components={{
                Chevron: (props) => {
                  if (props.orientation === 'left') {
                    return isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />;
                  }
                  return isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />;
                }
              }}
            />
          </div>
        </div>

        {/* Time Selection */}
        <div className="w-full md:w-1/2 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-white font-bold">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">{t('calculator.booking.select_time')}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl transition-all hover:border-blue-100 dark:hover:border-blue-900">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  className={cn(
                    "py-3 px-2 rounded-2xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center gap-1",
                    selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                      : "bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-100 dark:hover:border-blue-900 active:scale-95"
                  )}
                >
                  {selectedTime === time && <Check className="w-3 h-3 animate-in zoom-in-50 duration-300" />}
                  <span className="tracking-tight">{t(`calculator.booking.times.${time}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDate && selectedTime && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 shadow-xl shadow-emerald-50 dark:shadow-none">
          <div className="flex items-center gap-5 w-full">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md ring-4 ring-emerald-50 dark:ring-emerald-900/20">
              <Check className="w-10 h-10" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-black mb-1 uppercase tracking-widest">{t('calculator.booking.selected_datetime')}</p>
              <p className="text-blue-900 dark:text-white text-xl md:text-2xl font-black">
                {formatDate(selectedDate)} <span className="text-emerald-300 dark:text-emerald-800 mx-3">|</span> {t(`calculator.booking.times.${selectedTime}`)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

