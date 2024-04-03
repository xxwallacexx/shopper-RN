import { AntDesign } from "@expo/vector-icons"
import { AnimatePresence } from '@tamagui/animate-presence'
import { useState } from 'react'
import { Button, Image, XStack, YStack, styled } from 'tamagui'

const GalleryItem = styled(YStack, {
  zIndex: 1,
  x: 0,
  opacity: 1,
  fullscreen: true,

  variants: {
    // 1 = right, 0 = nowhere, -1 = left
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
})

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}


const ImageGallery = ({ photos }: { photos: string[] }) => {
  const [[page, going], setPage] = useState([0, 0])

  const imageIndex = wrap(0, photos.length, page)
  const paginate = (going: number) => {
    setPage([page + going, going])
  }

  return (
    <XStack
      overflow="hidden"
      backgroundColor="#000"
      position="relative"
      height={300}
      width="100%"
      alignItems="center"
    >
      <AnimatePresence initial={false} custom={{ going }}>
        <GalleryItem key={page} animation="lazy" going={going}>
          <Image source={{ uri: photos[imageIndex], width: 500, height: 300 }} />
        </GalleryItem>
      </AnimatePresence>

      <Button
        accessibilityLabel="Carousel left"
        icon={<AntDesign name="left" color="#fff"/>}
        size="$3"
        position="absolute"
        left="$4"
        circular
        elevate
        onPress={() => paginate(-1)}
        zi={100}
      />
      <Button
        accessibilityLabel="Carousel right"
        icon={<AntDesign name="right" color="#fff"/>}
        size="$3"
        position="absolute"
        right="$4"
        circular
        elevate
        onPress={() => paginate(1)}
        zi={100}
      />
    </XStack>
  )
}

export default ImageGallery
