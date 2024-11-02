import moment from 'moment';
import { Image, SizableText, XStack, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge } from '~/tamagui.config';
import { CheckoutProduct, CheckoutCoupon, Reservation, ReservationContent, Product } from '~/types';

const CheckoutReservationCard = ({
  product,
  reservationContent,
  reservation,
  price,
  coupon,
}: {
  product: Product;
  reservationContent: ReservationContent;
  reservation: Reservation;
  price: number;
  coupon?: CheckoutCoupon;
}) => {
  const { t } = useLocale();
  const photoUri = product.photos && product.photos.length ? product.photos[0].path : undefined;

  console.log(reservation);
  console.log(reservationContent);
  const option = reservation.options.find((o) => {
    return o._id == reservationContent.option;
  });
  return (
    <XStack
      p={'$1'}
      space="$2"
      borderColor={'lightslategrey'}
      borderRadius={'$radius.3'}
      borderWidth={0.3}>
      <YStack width={'40%'} borderRadius={'$radius.3'} overflow="hidden">
        <Image
          backgroundColor={'white'}
          resizeMode="contain"
          aspectRatio={1}
          source={{ uri: photoUri }}
          width={'100%'}
        />
      </YStack>
      <YStack py={'$2'} space="$2" justifyContent="space-between">
        <YStack>
          <SizableText numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </SizableText>
          <SizableText size="$2">
            {t('time')}: {moment(reservation.time).format('YYYY-MM-DD')}
          </SizableText>
          <SizableText size="$2">
            {t('option')}: {option?.name}
          </SizableText>
          <SizableText size="$2">
            {t('quantity')}: {reservationContent.quantity}
          </SizableText>
        </YStack>
        <XStack space="$2">
          <SizableText color={'$primary'}>{`HK$ ${price.toFixed(2)}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default CheckoutReservationCard;
