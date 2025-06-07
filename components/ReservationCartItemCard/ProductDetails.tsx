import moment from 'moment';
import { Skeleton } from 'moti/skeleton';
import { YStack, XStack, SizableText, Text } from 'tamagui';
import { useLocale } from '~/hooks';
import { CartItemReservation, Product } from '~/types';

interface ProductDetailsProps {
  product: Product;
  reservationContent: CartItemReservation;
  price: number;
  stock: number;
  isCartItemUpdating: boolean;
}

export const ProductDetails = ({
  product,
  reservationContent,
  price,
  stock,
  isCartItemUpdating,
}: ProductDetailsProps) => {
  const { t } = useLocale();
  const option = reservationContent.reservation?.options.find(
    (o) => o._id === reservationContent.option
  );

  return (
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
          {t('time')}:{' '}
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
  );
}; 