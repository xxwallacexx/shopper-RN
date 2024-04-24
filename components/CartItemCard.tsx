import { Image, SizableText, XStack, YStack } from "tamagui"
import { useLocale } from "~/hooks"
import { Badge } from "~/tamagui.config"

const CartItemCard = ({
  quantity,
  product,
  coupon
}: {
  quantity: number,
  product: Product,
  coupon?: Coupon
}) => {
  const { t } = useLocale()
  const priceAdjustment = product.productStock ? product.productStock.priceAdjustment : 0
  const singleItemPrice = product.price + priceAdjustment
  const singleItemDiscount = coupon ? coupon.coupon.discount : 0
  const singleItemSubtotal = singleItemPrice * quantity - singleItemDiscount
  const photoUri = product.photos && product.photos.length ? product.photos[0].path : undefined

  return (
    <XStack
      p={"$1"}
      space="$2"
      borderColor={"lightslategrey"}
      borderRadius={"$radius.3"}
      borderWidth={0.3}
    >
      <YStack width={"40%"} borderRadius={"$radius.3"} overflow="hidden">
        <Image
          resizeMode="contain"
          aspectRatio={1}
          source={{ uri: photoUri }}
          width={"100%"}
        />
        <Badge position='absolute' top={8} right={8}>
          <SizableText size={"$1"} color="#fff">
            HK$ {(product.price + priceAdjustment).toFixed(2)}
          </SizableText>
        </Badge>
      </YStack>
      <YStack py={"$2"} space="$2" justifyContent="space-between">
        <YStack>
          <SizableText numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </SizableText>
          {/*
            choices
          */}
        </YStack>
        <XStack space="$2">
          <SizableText>
            {t('orderQuantity', { quantity: quantity })}
          </SizableText>
          <SizableText color={"$primary"}>
            {`HK$ ${singleItemSubtotal.toFixed(2)}`}
          </SizableText>
        </XStack>
      </YStack>

    </XStack>
  )
}

export default CartItemCard
