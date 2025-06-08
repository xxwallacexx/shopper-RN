import React from 'react';
import { Pressable } from 'react-native';
import { XStack, YStack, Separator } from 'tamagui';

import { OrderCartItemCardProps } from '~/types/components/OrderCartItemCard';
import { ProductImage } from './ProductImage';
import { ProductDetails } from './ProductDetails';
import { ActionBar } from './ActionBar';

const OrderCartItemCard: React.FC<OrderCartItemCardProps> = ({
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
}) => {
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
          <ProductDetails
            product={product}
            orderContent={orderContent}
            totalPrice={totalPrice}
            stock={stock}
            isCartItemUpdating={isCartItemUpdating}
            testID={testID}
          />
        </XStack>
      </Pressable>

      <Separator />

      <ActionBar
        quantity={quantity}
        stock={stock}
        coupon={coupon}
        isCartItemUpdating={isCartItemUpdating}
        isCartItemRemoving={isCartItemRemoving}
        onDeductPress={onDeductPress}
        onAddPress={onAddPress}
        onAvailableCouponPress={onAvailableCouponPress}
        onRemovePress={onRemovePress}
        testID={testID}
      />
    </YStack>
  );
};

export default OrderCartItemCard;
