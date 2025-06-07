import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { XStack, SizableText } from 'tamagui';
import { Skeleton } from 'moti/skeleton';
import { QuantityControlsProps } from '~/types/components/OrderCartItemCard';

export const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  stock,
  isCartItemUpdating,
  onDeductPress,
  onAddPress,
  testID,
}) => (
  <XStack gap="$2" ai="center">
    <TouchableOpacity
      testID={`decrease-quantity-button-${testID}`}
      disabled={quantity < 2}
      onPress={onDeductPress}>
      <Ionicons size={24} name="remove-circle-outline" />
    </TouchableOpacity>
    {isCartItemUpdating ? (
      <Skeleton height={8} colorMode="light" width={18} />
    ) : (
      <SizableText testID={`item-quantity-${testID}`} ta="center" w={18}>
        {quantity}
      </SizableText>
    )}
    <TouchableOpacity
      testID={`increase-quantity-button-${testID}`}
      disabled={quantity >= stock}
      onPress={onAddPress}>
      <Ionicons size={24} name="add-circle-outline" />
    </TouchableOpacity>
  </XStack>
);
