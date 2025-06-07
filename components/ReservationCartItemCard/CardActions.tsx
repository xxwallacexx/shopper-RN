import { EvilIcons } from '@expo/vector-icons';
import { Skeleton } from 'moti/skeleton';
import { TouchableOpacity } from 'react-native';
import { XStack } from 'tamagui';
import { StyledButton } from '~/tamagui.config';
import { AvailabelCoupon } from '~/types';
import { useLocale } from '~/hooks';

interface CardActionsProps {
  coupon?: AvailabelCoupon;
  onAvailableCouponPress: () => void;
  onRemovePress: () => void;
  isCartItemRemoving: boolean;
}

export const CardActions = ({
  coupon,
  onAvailableCouponPress,
  onRemovePress,
  isCartItemRemoving,
}: CardActionsProps) => {
  const { t } = useLocale();

  return (
    <XStack px="$2" f={1} h="$3" ai="center" jc="space-between">
      <StyledButton w="40%" onPress={onAvailableCouponPress}>
        {coupon ? coupon.coupon.name : t('redeemCoupon')}
      </StyledButton>
      {isCartItemRemoving ? (
        <Skeleton height={18} colorMode="light" width={22} />
      ) : (
        <TouchableOpacity onPress={onRemovePress}>
          <EvilIcons size={24} name="trash" />
        </TouchableOpacity>
      )}
    </XStack>
  );
};
