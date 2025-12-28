import { Moment } from 'moment';
import { DateData } from 'react-native-calendars';
import { Reservation } from '~/types';

export interface ReservationCalendarProps {
  isLoading: boolean;
  reservations: Reservation[];
  selectedDate?: string;
  selectedCalendarMonth: Moment;
  onDayChange: (value?: string) => void;
  onMonthChange: (value: DateData) => void;
}
