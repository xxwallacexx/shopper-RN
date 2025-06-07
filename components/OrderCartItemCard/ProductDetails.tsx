import React from 'react';
import { Skeleton } from 'moti/skeleton';
import { YStack, SizableText, Text, XStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { ProductDetailsProps } from '~/types/components/OrderCartItemCard';

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  orderContent,
  totalPrice,
  stock,
  isCartItemUpdating,
  testID,
}) => {
  const { t } = useLocale();

  return (
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
  );
}; 