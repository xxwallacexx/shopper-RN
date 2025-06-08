import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { TouchableOpacity } from 'react-native';
import { XStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { ActionBarProps } from '~/types/components/OrderCartItemCard';
import { QuantityControls } from './QuantityControls';

export const ActionBar: React.FC<ActionBarProps> = ({
  quantity,
  stock,
  coupon,
  isCartItemUpdating,
  isCartItemRemoving,
  onDeductPress,
  onAddPress,
  onAvailableCouponPress,
  onRemovePress,
  testID,
}) => {
  const { t } = useLocale();

  return (
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
        <TouchableOpacity testID={`remove-item-button-${testID}`} onPress={onRemovePress}>
          <EvilIcons size={24} name="trash" />
        </TouchableOpacity>
      )}
    </XStack>
  );
};
