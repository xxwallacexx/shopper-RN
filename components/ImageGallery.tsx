import { AntDesign } from '@expo/vector-icons';
import { AnimatePresence } from '@tamagui/animate-presence';
import { useState } from 'react';
import { Button, Image, XStack, YStack, styled } from 'tamagui';

const GalleryItem = styled(YStack, {
  zi: 1,
  x: 0,
  o: 1,
  fullscreen: true,

  variants: {
    going: {
      ':number': (going) => ({
        enterStyle: {
          x: going > 0 ? 1000 : -1000,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: going < 0 ? 1000 : -1000,
          opacity: 0,
        },
      }),
    },
  } as const,
});

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const ImageGallery = ({ photos }: { photos: string[] }) => {
  const [[page, going], setPage] = useState([0, 0]);

  const imageIndex = wrap(0, photos.length, page);
  const paginate = (going: number) => {
    setPage([page + going, going]);
  };

  return (
    <XStack ov="hidden" bc="#000" pos="relative" h={300} w="100%" ai="center">
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation="lazy" going={going}>
          <Image source={{ uri: photos[imageIndex], width: 500, height: 300 }} />
        </GalleryItem>
      </AnimatePresence>

      <Button
        icon={<AntDesign name="left" color="#fff" />}
        size="$3"
        pos="absolute"
        l="$4"
        circular
        elevate
        onPress={() => paginate(-1)}
        zi={100}
      />
      <Button
        icon={<AntDesign name="right" color="#fff" />}
        size="$3"
        pos="absolute"
        r="$4"
        circular
        elevate
        onPress={() => paginate(1)}
        zi={100}
      />
    </XStack>
  );
};

export default ImageGallery;
