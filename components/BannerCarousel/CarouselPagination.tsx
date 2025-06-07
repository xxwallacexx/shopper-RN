import React from 'react';
import { XStack, Circle } from 'tamagui';
import { CarouselPaginationProps } from '~/types/components/BannerCarousel';

export const CarouselPagination: React.FC<CarouselPaginationProps> = ({ totalSlides, activeIndex }) => (
  <XStack pos="absolute" b={10} l="20%" w="60%" jc="center" p="$2" gap="$4">
    {Array.from({ length: totalSlides }).map((_, index) => (
      <Circle
        key={`activeSlide_${index}`}
        size={10}
        bc={index === activeIndex ? '$color.primary' : 'ghostwhite'}
        elevation={4}
      />
    ))}
  </XStack>
); 