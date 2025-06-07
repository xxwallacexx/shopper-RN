import React, { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import { interpolate } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { YStack } from 'tamagui';

import { BannerCarouselProps } from '~/types/components/BannerCarousel';
import { CarouselItem } from './CarouselItem';
import { CarouselPagination } from './CarouselPagination';

const { width } = Dimensions.get('window');

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const animationStyle = useCallback((value: number) => {
    'worklet';

    const zIndex = Math.round(interpolate(value, [-1, 0, 1], [-1000, 0, 1000]));
    const translateX = interpolate(value, [-1, 0, 1], [0, 0, width]);

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  return (
    <YStack w="100%" aspectRatio={1.77} pos="relative">
      <Carousel
        style={{ width: '100%' }}
        width={width}
        data={banners}
        autoPlay={banners.length > 1}
        loop
        autoPlayInterval={4000}
        scrollAnimationDuration={400}
        customAnimation={animationStyle}
        renderItem={({ item, animationValue }) => (
          <CarouselItem content={item} animationValue={animationValue} />
        )}
        onSnapToItem={setSlideIndex}
      />
      <CarouselPagination totalSlides={banners.length} activeIndex={slideIndex} />
    </YStack>
  );
};

export default BannerCarousel;
