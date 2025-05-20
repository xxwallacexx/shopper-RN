import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { XStack, YStack, Image, SizableText, Text, Separator } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge, StyledButton } from '~/tamagui.config';
import { AvailabelCoupon, CartItemReservation, Product } from '~/types';
import { Skeleton } from 'moti/skeleton';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';

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
  console.log(coupon);
  let price = totalPrice;
  if (coupon) {
    price = price - coupon.coupon.discount;
  }
  return (
    <YStack
      flex={1}
      backgroundColor={'white'}
      p={'$1'}
      space="$2"
      borderRadius={'$radius.3'}
      shadowColor={'black'}
      shadowOffset={{
        height: 2,
        width: 0,
      }}
      shadowOpacity={0.25}
      shadowRadius={3.84}>
      <TouchableOpacity onPress={onProductPress}>
        <XStack space="$2" flex={1}>
          <YStack width={'40%'} borderRadius={'$radius.3'} overflow="hidden">
            <Image
              backgroundColor={'white'}
              resizeMode="contain"
              aspectRatio={1}
              source={{ uri: photoUri }}
              width={'100%'}
            />
            <Badge position="absolute" top={8} right={8}>
              <SizableText size={'$1'} color="#fff">
                HK$ {singleItemPrice.toFixed(2)}
              </SizableText>
            </Badge>
          </YStack>
          <YStack flex={1} py={'$2'} space="$2" justifyContent="space-between">
            <YStack>
              <SizableText numberOfLines={1} ellipsizeMode="tail">
                {product.name} {product.introduction}
              </SizableText>
              <Text fontWeight={'300'} fontSize={'$2'}>
                {t('option')}: {option?.name}
              </Text>
              <Text fontWeight={'300'} fontSize={'$2'}>
                {t('quantity')}: {reservationContent.quantity}
              </Text>
              <Text fontWeight={'300'} fontSize={'$2'}>
                {t('time')}:{' '}
                {moment(reservationContent.reservation?.time).format('YYYY-MM-DD HH:mm')}
              </Text>
            </YStack>
            <XStack space="$2" alignItems="center">
              {isCartItemUpdating ? (
                <Skeleton height={12} colorMode="light" width={80} />
              ) : (
                <SizableText color={'$primary'}>HK$ {price.toFixed(2)}</SizableText>
              )}
              <Text fontWeight={'300'} fontSize={'$2'}>
                {t('stock')}: {stock}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>

      <Separator />
      <XStack px="$2" flex={1} h="$3" alignItems="center" justifyContent="space-between">
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
