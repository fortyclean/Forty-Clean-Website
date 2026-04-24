import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  className?: string;
}

const timeSlots = ['09_00', '10_00', '11_00', '12_00', '13_00', '14_00', '15_00', '16_00', '17_00', '18_00', '19_00', '20_00', '21_00', '22_00'];

const addDays = (baseDate: Date, daysToAdd: number) => {
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + daysToAdd);
  return nextDate;
};

const toInputDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const BookingCalendar = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  className,
}: BookingCalendarProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const nextAvailableDates = useMemo(() => {
    const dates: Date[] = [];
    let cursor = 0;

    while (dates.length < 14) {
      const candidate = addDays(today, cursor);
      if (candidate.getDay() !== 5) {
        dates.push(candidate);
      }
      cursor += 1;
    }

    return dates;
  }, [today]);

  const selectedDateValue = selectedDate ? toInputDateValue(selectedDate) : '';

  const handleNativeDateChange = (value: string) => {
    if (!value) {
      onDateSelect(undefined);
      return;
    }

    const pickedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(pickedDate.getTime()) || pickedDate.getDay() === 5 || pickedDate < today) {
      return;
    }

    onDateSelect(pickedDate);
  };

  const formatSelectedDate = (date: Date) =>
    date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className={cn('space-y-6', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="w-full space-y-3 md:w-1/2">
          <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-white">
            <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">{t('calculator.booking.select_date')}</span>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl transition-all hover:border-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-900">
            <div className="rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <input
                type="date"
                min={toInputDateValue(today)}
                value={selectedDateValue}
                onChange={(event) => handleNativeDateChange(event.target.value)}
                className="w-full bg-transparent text-lg font-black text-blue-900 outline-none dark:text-white"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {nextAvailableDates.map((date) => {
                const dateValue = toInputDateValue(date);
                const isSelected = selectedDateValue === dateValue;

                return (
                  <button
                    key={dateValue}
                    type="button"
                    onClick={() => onDateSelect(date)}
                    className={cn(
                      'rounded-2xl border px-3 py-4 text-center transition-all',
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                        : 'border-gray-100 bg-slate-50 text-blue-900 hover:border-blue-100 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-900 dark:hover:bg-blue-900/20'
                    )}
                  >
                    <div className="text-sm font-black">
                      {date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', { weekday: 'long' })}
                    </div>
                    <div className="mt-1 text-lg font-black">
                      {date.toLocaleDateString(isRTL ? 'ar-KW' : 'en-US', { day: 'numeric', month: 'long' })}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full space-y-3 md:w-1/2">
          <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-white">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-lg">{t('calculator.booking.select_time')}</span>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-xl transition-all hover:border-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-900">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => onTimeSelect(time)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-3 text-xs font-black transition-all',
                    selectedTime === time
                      ? 'scale-105 border-blue-600 bg-blue-600 text-white shadow-lg'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-blue-900 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
                  )}
                >
                  {selectedTime === time ? <Check className="h-3 w-3 animate-in zoom-in-50 duration-300" /> : null}
                  <span className="tracking-tight">{t(`calculator.booking.times.${time}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedDate && selectedTime ? (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border-2 border-emerald-100 bg-emerald-50 p-8 shadow-xl shadow-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:shadow-none sm:flex-row">
          <div className="flex w-full items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md ring-4 ring-emerald-50 dark:bg-slate-800 dark:text-emerald-400 dark:ring-emerald-900/20">
              <Check className="h-10 w-10" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="mb-1 text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {t('calculator.booking.selected_datetime')}
              </p>
              <p className="text-xl font-black text-blue-900 dark:text-white md:text-2xl">
                {formatSelectedDate(selectedDate)}
                <span className="mx-3 text-emerald-300 dark:text-emerald-800">|</span>
                {t(`calculator.booking.times.${selectedTime}`)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
