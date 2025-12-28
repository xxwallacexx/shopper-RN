import { AntDesign } from '@expo/vector-icons';
import { Spinner, Text } from 'tamagui';

interface CalendarHeaderProps {
  isLoading: boolean;
  title?: string;
  direction?: 'left' | 'right';
}

export const CalendarHeader = ({ isLoading, title, direction }: CalendarHeaderProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (direction === 'left') {
    return <AntDesign name="arrowleft" />;
  }

  if (direction === 'right') {
    return <AntDesign name="arrowright" />;
  }

  return <Text>{title}</Text>;
};
