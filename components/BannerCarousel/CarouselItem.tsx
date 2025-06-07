import React from 'react';
import { Stack } from 'tamagui';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { Content } from './Content';
import { ItemProps } from '~/types/components/BannerCarousel';

export const CarouselItem: React.FC<ItemProps> = ({ content, animationValue }) => {
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
      <Content type={content.type} uri={content.uri} />
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