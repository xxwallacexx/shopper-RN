import moment, { Moment } from 'moment';
import { YStack, Label } from 'tamagui';

import OptionSelection from './OptionSelection';
import ProductOptionCard from './ProductOptionCard';
import ReservationCalendar from './ReservationCalendar';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { Option, Product, Reservation, ReservationOption } from '~/types';
import { DateData } from 'react-native-calendars';

const OptionSheetContent = ({
  productType,
  options,
  selectedChoices,
  onChoiceChange,
  isReservationsFetching,
  reservations,
  selectedDate,
  onDayChange,
  onMonthChange,
  availableTimes,
  selectedTime,
  selectedCalendarMonth,
  onTimeChange,
  availableReservationOptions,
  onAvailableReservationOptionPress,
  selectedReservationOption,
}: {
  productType: Product['productType'];
  options: Option[];
  selectedChoices: { optionId: string; choiceId: string }[];
  onChoiceChange: (optionId: string, choiceId: string) => void;
  isReservationsFetching: boolean;
  reservations: Reservation[];
  selectedDate?: string;
  onDayChange: (value?: string) => void;
  onMonthChange: (value: DateData) => void;
  availableTimes: Date[];
  selectedCalendarMonth: Moment;
  selectedTime?: Date;
  onTimeChange: (value?: string) => void;
  availableReservationOptions: ReservationOption[];
  onAvailableReservationOptionPress: () => void;
  selectedReservationOption?: string;
}) => {
  const { t } = useLocale();

  switch (productType) {
    case 'ORDER':
      return (
        <YStack gap="$4">
          {options.map((option) => {
            return (
              <ProductOptionCard
                key={option._id}
                option={option}
                selectedChoice={
                  selectedChoices.find((s) => {
                    return s.optionId == option._id;
                  })?.choiceId
                }
                onChoiceChange={onChoiceChange}
              />
            );
          })}
        </YStack>
      );
    case 'RESERVATION':
      return (
        <YStack gap="$4">
          <Label>{t('pleaseSelectDate')}</Label>
          <ReservationCalendar
            isLoading={isReservationsFetching}
            reservations={reservations}
            selectedDate={selectedDate}
            selectedCalendarMonth={selectedCalendarMonth}
            onDayChange={onDayChange}
            onMonthChange={onMonthChange}
          />
          {availableTimes.length ? (
            <OptionSelection
              title={t('pleaseSelectTime')}
              options={availableTimes.map((t) => {
                return { label: moment(t).format('HH:mm'), value: moment(t).toISOString() };
              })}
              selectedOption={selectedTime?.toISOString()}
              onOptionChange={onTimeChange}
            />
          ) : null}
          {availableReservationOptions.length ? (
            <YStack>
              <Label>{t('pleaseSelectOption')}</Label>
              <StyledButton
                mx="$1"
                h="$3"
                bc="#fff"
                pressStyle={{ bc: 'ghostwhite' }}
                color="#000"
                onPress={onAvailableReservationOptionPress}>
                {selectedReservationOption
                  ? availableReservationOptions.find((o) => {
                      return o._id == selectedReservationOption;
                    })?.name
                  : t('pleaseSelect')}
              </StyledButton>
            </YStack>
          ) : null}
        </YStack>
      );
    default:
      return <></>;
  }
};

export default OptionSheetContent;
