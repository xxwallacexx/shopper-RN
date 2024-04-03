import { useState } from 'react'
import { Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Image, YStack, XStack, Circle } from 'tamagui'


const { width } = Dimensions.get('window')
export default function AdsBanners({ banners }: { banners: string[] }) {
  const [slideIndex, setSlideIndex] = useState(0)


  const renderItem = ({ item, index }) => {
    return (
      <Image
        source={{ uri: item }}
        width={"100%"}
        height={"100%"}
        aspectRatio={1.77}
      />
    )
  }


  return (
    <YStack
      width={"100%"}
      aspectRatio={1.77}
      position='relative'
    >
      <Carousel
        data={banners}
        layout={'default'}
        autoplay={true}
        loop={true}
        autoplayInterval={3000}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={(index) => setSlideIndex(index)}
      />
      <XStack position='absolute' bottom={10} left={"20%"} width={"60%"} justifyContent='center' padding="$2" space="$4" >
        {banners.map((_, index) => {
          return (
            <Circle size={10} backgroundColor={index == slideIndex ? "$color.primary" : "ghostwhite"} elevation={4} />
          )
        })}
      </XStack>
    </YStack >
  )

}
