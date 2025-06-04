import moment from 'moment';
import { Image, SizableText, XStack, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { Product, ReservationOption } from '~/types';

const OrderReservationCard = ({
  option,
  quantity,
  product,
  time,
  price,
}: {
  option?: ReservationOption;
  quantity: number;
  product: Product;
  time: Date;
  price: number;
}) => {
  const { t } = useLocale();

  const photoUri = product.photos && product.photos.length ? product.photos[0].path : undefined;

  return (
    <XStack f={1} bc="white" p="$1" gap="$2">
      <YStack w="40%" br="$radius.3" ov="hidden">
        <Image bc="white" objectFit="contain" aspectRatio={1} source={{ uri: photoUri }} w="100%" />
      </YStack>
      <YStack py="$2" gap="$2" jc="space-between">
        <YStack>
          <SizableText numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </SizableText>
          <SizableText size="$2">
            {t('time')}: {moment(time).format('YYYY-MM-DD')}
          </SizableText>
          <SizableText size="$2">
            {t('option')}: {option?.name}
          </SizableText>
          <SizableText size="$2">
            {t('quantity')}: {quantity}
          </SizableText>
        </YStack>
        <XStack gap="$2">
          <SizableText col="$primary">{`HK$ ${price}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default OrderReservationCard;
