import { AntDesign } from '@expo/vector-icons';
import { Spinner } from 'tamagui';

interface CalendarHeaderProps {
  isLoading: boolean;
  direction?: 'left' | 'right';
}

export const CalendarHeader = ({ isLoading, direction }: CalendarHeaderProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (direction === 'left') {
    return <AntDesign name="arrowleft" />;
  }

  if (direction === 'right') {
    return <AntDesign name="arrowright" />;
  }

  return null;
};
