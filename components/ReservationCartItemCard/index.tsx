import { TouchableOpacity } from 'react-native';
import { XStack, YStack, Image, Separator, SizableText } from 'tamagui';
import { Badge } from '~/tamagui.config';
import { ReservationCartItemCardProps } from '~/types/components';
import { ProductDetails } from './ProductDetails';
import { CardActions } from './CardActions';

const ReservationCartItemCard = ({
  photoUri,
  totalPrice,
  stock,
  coupon,
  singleItemPrice,
  product,
  reservationContent,
  onProductPress,
  onRemovePress,
  onAvailableCouponPress,
  isCartItemUpdating,
  isCartItemRemoving,
}: ReservationCartItemCardProps) => {
  const finalPrice = coupon ? totalPrice - coupon.coupon.discount : totalPrice;

  return (
    <YStack
      f={1}
      bc="white"
      p="$1"
      gap="$2"
      br="$radius.3"
      shac="black"
      shof={{
        height: 2,
        width: 0,
      }}
      shop={0.25}
      shar={3.84}>
      <TouchableOpacity onPress={onProductPress}>
        <XStack gap="$2" f={1}>
          <YStack w="40%" br="$radius.3" ov="hidden">
            <Image
              bc="white"
              objectFit="contain"
              aspectRatio={1}
              source={{ uri: photoUri }}
              w="100%"
            />
            <Badge pos="absolute" t={8} r={8}>
              <SizableText size="$1" col="#fff">
                HK$ {singleItemPrice.toFixed(2)}
              </SizableText>
            </Badge>
          </YStack>
          <ProductDetails
            product={product}
            reservationContent={reservationContent}
            price={finalPrice}
            stock={stock}
            isCartItemUpdating={isCartItemUpdating}
          />
        </XStack>
      </TouchableOpacity>

      <Separator />
      <CardActions
        coupon={coupon}
        onAvailableCouponPress={onAvailableCouponPress}
        onRemovePress={onRemovePress}
        isCartItemRemoving={isCartItemRemoving}
      />
    </YStack>
  );
};

export default ReservationCartItemCard; 