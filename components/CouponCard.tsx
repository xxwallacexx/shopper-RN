import moment from "moment";
import { Image, SizableText, Text, YStack } from "tamagui"
import { useLocale } from "~/hooks"
import { Badge } from "~/tamagui.config"

const CouponCard = ({
  imageUri,
  name,
  endDate,
  credit
}: {
  imageUri: string;
  name: string;
  endDate: Date;
  credit: number;
}) => {
  const { t } = useLocale()

  return (
    <YStack
      backgroundColor={"white"}
      flex={1}
      p="$4"
      borderRadius={"$radius.3"}
      shadowColor={"black"}
      shadowOffset={{
        height: 2,
        width: 0
      }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
    >
      <Image
        aspectRatio={1}
        source={{ uri: imageUri }}
        width={"100%"}
        resizeMode="contain"
        borderRadius={4}
      />
      <Badge position='absolute' top={22} right={22}>
        <SizableText fontSize={8} color="#fff">
          {t("couponCredit", { credit })}
        </SizableText>
      </Badge>
      <Text fontSize={"$2"} color="slategrey" numberOfLines={1} ellipsizeMode='tail'>{moment(endDate).format("YYYY-MM-DD HH:mm")}</Text>
      <SizableText numberOfLines={1} ellipsizeMode='tail'>{name}</SizableText>

    </YStack>

  )
}



export default CouponCard
