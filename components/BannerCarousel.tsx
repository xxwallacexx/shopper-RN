import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image, YStack, XStack, Circle, Stack } from 'tamagui';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Video from './Video';

const { width } = Dimensions.get('window');

const Content = ({ type, uri }: { type: 'IMAGE' | 'VIDEO'; uri: string }) => {
  switch (type) {
    case 'VIDEO':
      return <Video uri={uri} />;
    case 'IMAGE':
      return (
        <Image
          source={{ uri }}
          width={'100%'}
          height={'100%'}
          aspectRatio={1.778}
          resizeMode="contain"
          backgroundColor={'lightgrey'}
        />
      );
    default:
      return <></>;
  }
};

const Item = ({
  content,
  animationValue,
}: {
  content: { type: 'IMAGE' | 'VIDEO'; uri: string };
  animationValue: SharedValue<number>;
}) => {
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
const BannerCarousel = ({ banners }: { banners: { type: 'IMAGE' | 'VIDEO'; uri: string }[] }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  const animationStyle = useCallback((value: number) => {
    'worklet';

    const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
    const translateX = interpolate(value, [-1, 0, 1], [0, 0, width]);

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  return (
    <YStack overflow="hidden" width={'100%'} aspectRatio={1.77} position="relative">
      <Carousel
        width={width}
        data={banners}
        autoPlay={banners.length > 1 ? true : false}
        loop={true}
        autoPlayInterval={4000}
        scrollAnimationDuration={400}
        customAnimation={animationStyle}
        renderItem={({ item, animationValue }) => {
          return <Item content={item} animationValue={animationValue} />;
        }}
        onSnapToItem={(index) => setSlideIndex(index)}
      />
      <XStack
        position="absolute"
        bottom={10}
        left={'20%'}
        width={'60%'}
        justifyContent="center"
        padding="$2"
        space="$4">
        {banners.map((_, index) => {
          return (
            <Circle
              key={`activeSlide_${index}`}
              size={10}
              backgroundColor={index == slideIndex ? '$color.primary' : 'ghostwhite'}
              elevation={4}
            />
          );
        })}
      </XStack>
    </YStack>
  );
};

export default BannerCarousel;
