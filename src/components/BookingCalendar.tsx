import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
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

const DATE_OPTIONS_COUNT = 14;

const startOfDay = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromDateValue = (value: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

export const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  className
}: BookingCalendarProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    const cursor = new Date(today);

    while (dates.length < DATE_OPTIONS_COUNT) {
      if (cursor.getDay() !== 5) {
        dates.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }, []);

  const minimumDate = availableDates[0];
  const maximumDate = availableDates[availableDates.length - 1];
  const selectedDateValue = selectedDate ? toDateValue(selectedDate) : '';

  const formatDate = (date: Date) =>
    date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const isSelectableDate = (candidate: Date) => {
    const normalizedCandidate = startOfDay(candidate);
    return availableDates.some((date) => date.getTime() === normalizedCandidate.getTime());
  };

  const handleDateInputChange = (value: string) => {
    const parsedDate = fromDateValue(value);
    if (!parsedDate || !isSelectableDate(parsedDate)) {
      return;
    }
    onDateSelect(parsedDate);
  };

  return (
    <div className={cn("space-y-6", className)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/2 space-y-3">
          <div className="flex items-center gap-2 text-blue-900 dark:text-white font-bold">
            <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">{t('calculator.booking.select_date')}</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl space-y-4 transition-all hover:border-blue-100 dark:hover:border-blue-900">
            <input
              type="date"
              value={selectedDateValue}
              min={toDateValue(minimumDate)}
              max={toDateValue(maximumDate)}
              onChange={(event) => handleDateInputChange(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-blue-900 font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {availableDates.map((date) => {
                const isSelected = selectedDate ? startOfDay(selectedDate).getTime() === date.getTime() : false;

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => onDateSelect(date)}
                    className={cn(
                      "rounded-2xl border-2 px-4 py-3 text-start font-black transition-all",
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40"
                        : "border-gray-100 bg-gray-50 text-blue-900 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:hover:border-blue-900 dark:hover:bg-blue-900/20"
                    )}
                  >
                    <span className="block text-sm opacity-80">
                      {date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', { weekday: 'long' })}
                    </span>
                    <span className="block text-base">
                      {date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', { day: 'numeric', month: 'long' })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
                  type="button"
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

      {selectedDate && selectedTime && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[2.5rem] border-2 border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 shadow-xl shadow-emerald-50 dark:shadow-none">
          <div className="flex items-center gap-5 w-full">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md ring-4 ring-emerald-50 dark:ring-emerald-900/20">
              <Check className="w-10 h-10" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-black mb-1 uppercase tracking-widest">
                {t('calculator.booking.selected_datetime')}
              </p>
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
