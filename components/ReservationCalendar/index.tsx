import { Calendar } from 'react-native-calendars';
import { ReservationCalendarProps } from '~/types/components';
import { getAvailableDates, getMarkedDates } from '~/utils/dateUtils';
import { CalendarHeader } from './CalendarHeader';

const ReservationCalendar = ({
  isLoading,
  reservations,
  selectedDate,
  onDayChange,
}: ReservationCalendarProps) => {
  const availableDates = getAvailableDates(reservations);
  const markedDates = getMarkedDates(availableDates, selectedDate);

  const handleDayPress = (value: string) => {
    onDayChange(value === selectedDate ? undefined : value);
  };

  return (
    <Calendar
      customHeaderTitle={<CalendarHeader isLoading={isLoading} />}
      onDayPress={(day) => handleDayPress(day.dateString)}
      monthFormat="MMM yyyy"
      onMonthChange={(month) => {
        console.log('Month changed:', month);
      }}
      hideArrows={false}
      renderArrow={(direction) => <CalendarHeader direction={direction} isLoading={false} />}
      hideExtraDays
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
