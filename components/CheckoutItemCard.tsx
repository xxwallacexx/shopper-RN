import { Image, SizableText, XStack, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge } from '~/tamagui.config';
import { CheckoutProduct, CheckoutCoupon } from '~/types';

const CheckoutItemCard = ({
  quantity,
  product,
  coupon,
}: {
  quantity: number;
  product: CheckoutProduct;
  coupon?: CheckoutCoupon;
}) => {
  const { t } = useLocale();
  const priceAdjustment = product.productStock ? product.productStock.priceAdjustment : 0;
  const singleItemPrice = product.price + priceAdjustment;
  const singleItemDiscount = coupon ? coupon.coupon.discount : 0;
  const singleItemSubtotal = singleItemPrice * quantity - singleItemDiscount;
  const photoUri = product.photos && product.photos.length ? product.photos[0].path : undefined;

  return (
    <XStack p={'$1'} gap="$2" boc={'lightslategrey'} br={'$radius.3'} bw={0.3}>
      <YStack w={'40%'} br={'$radius.3'} ov="hidden">
        <Image
          bc={'white'}
          objectFit="contain"
          aspectRatio={1}
          source={{ uri: photoUri }}
          width={'100%'}
        />
        <Badge pos="absolute" t={8} r={8}>
          <SizableText size={'$1'} col="#fff">
            HK$ {(product.price + priceAdjustment).toFixed(2)}
          </SizableText>
        </Badge>
      </YStack>
      <YStack py={'$2'} gap="$2" jc="space-between">
        <YStack>
          <SizableText numberOfLines={1} ellipsizeMode="tail">
            {product.name}
          </SizableText>
          {product.choices.map((f) => {
            return (
              <SizableText size={'$2'} numberOfLines={1} ellipsizeMode="tail">
                {f.productOption.fieldName}: {f.name}
              </SizableText>
            );
          })}
        </YStack>
        <XStack space="$2">
          <SizableText>{t('orderQuantity', { quantity: quantity })}</SizableText>
          <SizableText col={'$primary'}>{`HK$ ${singleItemSubtotal.toFixed(2)}`}</SizableText>
        </XStack>
      </YStack>
    </XStack>
  );
};

export default CheckoutItemCard;
