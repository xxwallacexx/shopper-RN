import moment from 'moment';
import { Image, SizableText, XStack, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Reservation, ReservationContent, Product } from '~/types';

const CheckoutReservationCard = ({
  product,
  reservationContent,
  reservation,
  price,
}: {
  product: Product;
  reservationContent: ReservationContent;
  reservation: Reservation;
  price: number;
}) => {
  const { t } = useLocale();
  const photoUri = product.photos && product.photos.length ? product.photos[0].path : undefined;

  const option = reservation.options.find((o) => {
    return o._id == reservationContent.option;
  });
  return (
    <XStack p="$1" gap="$2" bc="lightslategrey" br="$radius.3" bw={0.3}>
      <YStack w="40%" br="$radius.3" ov="hidden">
        <Image bc="white" objectFit="contain" aspectRatio={1} source={{ uri: photoUri }} w="100%" />
      </YStack>
      <YStack py="$2" gap="$2" jc="space-between">
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
        <XStack gap="$2">
          <SizableText col="$primary">{`HK$ ${price.toFixed(2)}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default CheckoutReservationCard;
