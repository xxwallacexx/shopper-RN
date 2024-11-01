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
    <XStack flex={1} backgroundColor={'white'} p={'$1'} space="$2">
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
          {choices.map((c) => {
            return (
              <SizableText size={'$2'} numberOfLines={1} ellipsizeMode="tail">
                {c}
              </SizableText>
            );
          })}
        </YStack>
        <XStack space="$2">
          <SizableText>{t('orderQuantity', { quantity: quantity })}</SizableText>
          <SizableText color={'$primary'}>{`HK$ ${price}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default OrderProductCard;
