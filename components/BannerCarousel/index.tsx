import { useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { YStack, XStack, Circle } from 'tamagui';
import { BannerCarouselProps } from '~/types/components';
import { BannerItem } from './BannerItem';
import { useCarouselAnimation } from './useCarouselAnimation';

const { width } = Dimensions.get('window');

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const animationStyle = useCarouselAnimation();

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
          <BannerItem content={item} animationValue={animationValue} />
        )}
        onSnapToItem={setSlideIndex}
      />
      <XStack pos="absolute" b={10} l="20%" w="60%" jc="center" p="$2" gap="$4">
        {banners.map((_, index) => (
          <Circle
            key={`activeSlide_${index}`}
            size={10}
            bc={index === slideIndex ? '$color.primary' : 'ghostwhite'}
            elevation={4}
          />
        ))}
      </XStack>
    </YStack>
  );
};

export default BannerCarousel; 