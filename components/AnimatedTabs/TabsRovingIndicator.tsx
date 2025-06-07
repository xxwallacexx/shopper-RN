import { YStack } from 'tamagui';
import { TabsRovingIndicatorProps } from '~/types/components';

export const TabsRovingIndicator = ({ active, ...props }: TabsRovingIndicatorProps) => {
  return (
    <YStack
      pos="absolute"
      bc="$color.primary"
      o={0.7}
      animation="100ms"
      enterStyle={{
        o: 0,
      }}
      exitStyle={{
        o: 0,
      }}
      {...(active && {
        backgroundColor: '$color.primary',
        opacity: 0.6,
      })}
      {...props}
    />
  );
}; 