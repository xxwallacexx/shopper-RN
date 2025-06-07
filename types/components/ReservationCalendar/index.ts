import { Reservation } from '~/types';

export interface ReservationCalendarProps {
  isLoading: boolean;
  reservations: Reservation[];
  selectedDate?: string;
  onDayChange: (value?: string) => void;
} 