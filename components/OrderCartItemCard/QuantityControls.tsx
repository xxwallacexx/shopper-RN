import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { XStack, SizableText } from 'tamagui';
import { Skeleton } from 'moti/skeleton';

interface QuantityControlsProps {
  quantity: number;
  stock: number;
  isCartItemUpdating: boolean;
  onDeductPress: () => void;
  onAddPress: () => void;
  testID?: string;
}

export const QuantityControls = ({
  quantity,
  stock,
  isCartItemUpdating,
  onDeductPress,
  onAddPress,
  testID,
}: QuantityControlsProps) => (
  <XStack gap="$2" ai="center">
    <TouchableOpacity
      testID={`decrease-quantity-button-${testID?.split('-').pop()}`}
      disabled={quantity < 2}
      onPress={onDeductPress}>
      <Ionicons size={24} name="remove-circle-outline" />
    </TouchableOpacity>
    {isCartItemUpdating ? (
      <Skeleton height={8} colorMode="light" width={18} />
    ) : (
      <SizableText testID={`item-quantity-${testID?.split('-').pop()}`} ta="center" w={18}>
        {quantity}
      </SizableText>
    )}
    <TouchableOpacity
      testID={`increase-quantity-button-${testID?.split('-').pop()}`}
      disabled={quantity >= stock}
      onPress={onAddPress}>
      <Ionicons size={24} name="add-circle-outline" />
    </TouchableOpacity>
  </XStack>
); 