import { EvilIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Skeleton } from 'moti/skeleton';
import { TouchableOpacity } from 'react-native';
import { XStack, YStack, Image, SizableText, Text, Separator } from 'tamagui';

import { useLocale } from '~/hooks';
import { Badge, StyledButton } from '~/tamagui.config';
import { AvailabelCoupon, CartItemReservation, Product } from '~/types';

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
}: {
  photoUri: string;
  totalPrice: number;
  stock: number;
  coupon?: AvailabelCoupon;
  singleItemPrice: number;
  product: Product;
  reservationContent: CartItemReservation;
  onProductPress: () => void;
  onRemovePress: () => void;
  onAvailableCouponPress: () => void;
  isCartItemUpdating: boolean;
  isCartItemRemoving: boolean;
}) => {
  const { t } = useLocale();
  const option = reservationContent.reservation?.options.find((o) => {
    return o._id == reservationContent.option;
  });
  let price = totalPrice;
  if (coupon) {
    price = price - coupon.coupon.discount;
  }
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
          <YStack f={1} py="$2" gap="$2" jc="space-between">
            <YStack>
              <SizableText numberOfLines={1} ellipsizeMode="tail">
                {product.name} {product.introduction}
              </SizableText>
              <Text fow="300" fos="$2">
                {t('option')}: {option?.name}
              </Text>
              <Text fow="300" fos="$2">
                {t('quantity')}: {reservationContent.quantity}
              </Text>
              <Text fow="300" fos="$2">
                {t('time')}:
                {moment(reservationContent.reservation?.time).format('YYYY-MM-DD HH:mm')}
              </Text>
            </YStack>
            <XStack gap="$2" ai="center">
              {isCartItemUpdating ? (
                <Skeleton height={12} colorMode="light" width={80} />
              ) : (
                <SizableText col="$primary">HK$ {price.toFixed(2)}</SizableText>
              )}
              <Text fow="300" fos="$2">
                {t('stock')}: {stock}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>

      <Separator />
      <XStack px="$2" f={1} h="$3" ai="center" jc="space-between">
        <StyledButton w="40%" onPress={onAvailableCouponPress}>
          {coupon ? coupon.coupon.name : t('redeemCoupon')}
        </StyledButton>
        {isCartItemRemoving ? (
          <Skeleton height={18} colorMode="light" width={22} />
        ) : (
          <TouchableOpacity onPress={onRemovePress}>
            <EvilIcons size={24} name="trash" />
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
};

export default ReservationCartItemCard;
