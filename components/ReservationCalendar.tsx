import { PRIMARY_COLOR } from '@env';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { Spinner } from 'tamagui';

import { Reservation } from '~/types';

const ReservationCalendar = ({
  isLoading,
  reservations,
  selectedDate,
  onDayChange,
}: {
  isLoading: boolean;
  reservations: Reservation[];
  selectedDate?: string;
  onDayChange: (value?: string) => void;
}) => {
  const availableDates: string[] = [];
  for (const reservation of reservations) {
    const date = moment(reservation.time).format('YYYY-MM-DD');
    if (!availableDates.includes(date)) {
      availableDates.push(date);
    }
  }
  const markedDates: any = {};
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

  const onDayPress = (value: string) => {
    if (value == selectedDate) {
      onDayChange(undefined);
    } else {
      onDayChange(value);
    }
  };

  return (
    <>
      <Calendar
        customHeaderTitle={isLoading ? <Spinner /> : undefined}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          onDayPress(day.dateString);
        }}
        // Handler which gets executed on day long press. Default = undefined
        onDayLongPress={(day) => {
          console.log('selected day', day);
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat="MMM yyyy"
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {
          console.log(month);
        }}
        // Hide month navigation arrows. Default = false
        hideArrows={false}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        renderArrow={(direction) => {
          if (direction == 'left') {
            return <AntDesign name="arrowleft" />;
          }
          if (direction === 'right') {
            return <AntDesign name="arrowright" />;
          }
        }}
        // Do not show days of other months in month page. Default = false
        hideExtraDays
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={false}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // Hide day names. Default = false
        hideDayNames={false}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={(substractMonth) => substractMonth()}
        // Handler which gets executed when press arrow icon left. It receive a callback can go next month
        onPressArrowRight={(addMonth) => addMonth()}
        theme={{
          todayTextColor: '#d9e1e8',
          dayTextColor: '#d9e1e8',
        }}
        markingType="custom"
        markedDates={markedDates}
      />
    </>
  );
};

export default ReservationCalendar;
