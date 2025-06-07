import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { Stack } from 'tamagui';
import { BannerItemProps } from '~/types/components';
import { BannerContent } from './BannerContent';

export const BannerItem = ({ content, animationValue }: BannerItemProps) => {
  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['#000', 'transparent', '#000']
    );

    return {
      backgroundColor,
    };
  }, [animationValue]);

  return (
    <Stack style={{ flex: 1 }}>
      <BannerContent {...content} />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          maskStyle,
        ]}
      />
    </Stack>
  );
}; 