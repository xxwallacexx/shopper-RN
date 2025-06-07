import { EvilIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { Pressable, TouchableOpacity } from 'react-native';
import { XStack, YStack, SizableText, Text, Separator } from 'tamagui';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { OrderCartItemCardProps } from '~/types/components';
import { ProductImage } from './ProductImage';
import { QuantityControls } from './QuantityControls';

const OrderCartItemCard = ({
  photoUri,
  totalPrice,
  stock,
  coupon,
  singleItemPrice,
  product,
  orderContent,
  onProductPress,
  onDeductPress,
  onAddPress,
  onRemovePress,
  onAvailableCouponPress,
  isCartItemUpdating,
  isCartItemRemoving,
  testID,
}: OrderCartItemCardProps) => {
  const { t } = useLocale();
  const quantity = orderContent.quantity ?? 0;

  return (
    <YStack
      testID={testID}
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
      <Pressable testID={`${testID}-product-press`} onPress={onProductPress}>
        <XStack gap="$2" f={1}>
          <YStack w="40%" br="$radius.3" ov="hidden">
            <ProductImage photoUri={photoUri} singleItemPrice={singleItemPrice} testID={testID} />
          </YStack>
          <YStack f={1} py="$2" gap="$2" jc="space-between">
            <YStack>
              <SizableText testID={`${testID}-name`} numberOfLines={1} ellipsizeMode="tail">
                {product.name} {product.introduction}
              </SizableText>
              {orderContent.choices.map((c) => (
                <Text key={c._id} fow="300" fos="$2">
                  {t('option')}: {c.name}
                </Text>
              ))}
            </YStack>
            <XStack gap="$2" ai="center">
              {isCartItemUpdating ? (
                <Skeleton height={12} colorMode="light" width={80} />
              ) : (
                <SizableText testID={`${testID}-total-price`} col="$primary">
                  HK$ {totalPrice.toFixed(2)}
                </SizableText>
              )}
              <Text fow="300" fos="$2">
                {t('stock')}: {stock}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Pressable>

      <Separator />
      <XStack px="$2" f={1} h="$3" ai="center" jc="space-between">
        <QuantityControls
          quantity={quantity}
          stock={stock}
          isCartItemUpdating={isCartItemUpdating}
          onDeductPress={onDeductPress}
          onAddPress={onAddPress}
          testID={testID}
        />
        <StyledButton testID={`${testID}-coupon`} w="40%" onPress={onAvailableCouponPress}>
          {coupon ? coupon.coupon.name : t('redeemCoupon')}
        </StyledButton>
        {isCartItemRemoving ? (
          <Skeleton height={18} colorMode="light" width={22} />
        ) : (
          <TouchableOpacity
            testID={`remove-item-button-${testID?.split('-').pop()}`}
            onPress={onRemovePress}>
            <EvilIcons size={24} name="trash" />
          </TouchableOpacity>
        )}
      </XStack>
    </YStack>
  );
};

export default OrderCartItemCard;
