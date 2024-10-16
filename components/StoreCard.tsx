import { XStack, Stack, Image, YStack,  SizableText } from "tamagui"
import { Title } from "~/tamagui.config";

const StoreCard = ({
  logo,
  name,
  address
}: {
  logo: string;
  name: string;
  address: string;
}) => {
  return (
    <XStack space="$4" >
      <Stack w="$size.6">
        <Image
          backgroundColor={"white"}
          resizeMode="contain"
          aspectRatio={1}
          source={{ uri: logo }}
          width={"100%"}
        />
      </Stack>
      <YStack space="$1" flex={1}>
        <Title>{name}</Title>
        <SizableText
          color="slategray"
          textOverflow="ellipsis"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {address}
        </SizableText>
      </YStack>
    </XStack>

  )
}

export default StoreCard
