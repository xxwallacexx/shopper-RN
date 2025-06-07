import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { interpolate } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const useCarouselAnimation = () => {
  return useCallback((value: number) => {
    'worklet';

    const zIndex = Math.round(interpolate(value, [-1, 0, 1], [-1000, 0, 1000]));
    const translateX = interpolate(value, [-1, 0, 1], [0, 0, width]);

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);
};
