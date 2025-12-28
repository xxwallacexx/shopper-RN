import { Calendar } from 'react-native-calendars';
import { ReservationCalendarProps } from '~/types/components';
import { getAvailableDates, getMarkedDates } from '~/utils/dateUtils';
import { CalendarHeader } from './CalendarHeader';

const ReservationCalendar = ({
  isLoading,
  reservations,
  selectedDate,
  selectedCalendarMonth,
  onDayChange,
  onMonthChange,
}: ReservationCalendarProps) => {
  const availableDates = getAvailableDates(reservations);
  const markedDates = getMarkedDates(availableDates, selectedDate);

  const handleDayPress = (value: string) => {
    onDayChange(value === selectedDate ? undefined : value);
  };

  return (
    <Calendar
      customHeaderTitle={
        <CalendarHeader title={selectedCalendarMonth.format('MMM YYYY')} isLoading={isLoading} />
      }
      current={selectedCalendarMonth.format('YYYY-MM-DD')}
      onDayPress={(day) => handleDayPress(day.dateString)}
      monthFormat="MMM yyyy"
      onMonthChange={onMonthChange}
      hideArrows={false}
      renderArrow={(direction) => <CalendarHeader direction={direction} isLoading={false} />}
      hideExtraDays
      disableArrowLeft={isLoading}
      disableArrowRight={isLoading}
      disableMonthChange={false}
      firstDay={1}
      hideDayNames={false}
      showWeekNumbers={false}
      onPressArrowLeft={(subtractMonth) => subtractMonth()}
      onPressArrowRight={(addMonth) => addMonth()}
      theme={{
        todayTextColor: '#d9e1e8',
        dayTextColor: '#d9e1e8',
      }}
      markingType="custom"
      markedDates={markedDates}
    />
  );
};

export default ReservationCalendar;
