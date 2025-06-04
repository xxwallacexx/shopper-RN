import { Image, SizableText, XStack, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { Product } from '~/types';

const OrderProductCard = ({
  choices,
  quantity,
  product,
  price,
}: {
  choices: string[];
  quantity: number;
  product: Product;
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
          {choices.map((c) => {
            return (
              <SizableText size="$2" numberOfLines={1} ellipsizeMode="tail">
                {c}
              </SizableText>
            );
          })}
        </YStack>
        <XStack gap="$2">
          <SizableText>{t('orderQuantity', { quantity })}</SizableText>
          <SizableText col="$primary">{`HK$ ${price}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default OrderProductCard;
