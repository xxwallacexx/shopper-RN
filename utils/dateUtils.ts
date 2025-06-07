import { PRIMARY_COLOR } from '@env';
import moment from 'moment';
import { Reservation } from '~/types';

export const getAvailableDates = (reservations: Reservation[]): string[] => {
  const availableDates: string[] = [];
  for (const reservation of reservations) {
    const date = moment(reservation.time).format('YYYY-MM-DD');
    if (!availableDates.includes(date)) {
      availableDates.push(date);
    }
  }
  return availableDates;
};

export const getMarkedDates = (availableDates: string[], selectedDate?: string) => {
  const markedDates: Record<string, any> = {};

  if (selectedDate) {
    markedDates[selectedDate] = {
      customStyles: {
        container: {
          backgroundColor: PRIMARY_COLOR,
        },
        text: {
          color: 'white',
        },
      },
    };
  }

  for (const availableDate of availableDates) {
    if (availableDate !== selectedDate) {
      markedDates[availableDate] = {
        customStyles: {
          container: {
            backgroundColor: 'white',
          },
          text: {
            color: PRIMARY_COLOR,
          },
        },
      };
    }
  }

  return markedDates;
};
