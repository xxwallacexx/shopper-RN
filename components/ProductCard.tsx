import { Image, SizableText, Text, YStack } from "tamagui"
import { Badge } from "~/tamagui.config"

const ProductCard = ({
  imageUri,
  price,
  name,
  categoryName,
  introduction
}: {
  imageUri: string,
  price: number,
  name: string,
  categoryName: string,
  introduction: string

}) => {
  return (
    <YStack
      flex={1}
      p="$4"
    >
      <Image
        aspectRatio={1}
        source={{ uri: imageUri }}
        width={"100%"}
        borderRadius={4}
      />
      <Badge position='absolute' top={22} right={22}>
        <SizableText fontSize={8} color="#fff">
          $ {price.toFixed(2)} 起
        </SizableText>
      </Badge>
      <SizableText size={"$1"} color="lightslategray">{categoryName}</SizableText>
      <Text numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
      <Text numberOfLines={1} ellipsizeMode='tail'>{introduction}</Text>
    </YStack>

  )
}

export default ProductCard
