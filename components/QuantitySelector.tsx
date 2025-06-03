import { AntDesign } from '@expo/vector-icons';
import { Label, SizableText, XStack, YStack } from 'tamagui';
import { StyledButton } from '~/tamagui.config';
import { useLocale } from '~/hooks';
import { Product } from '~/types';

const QuantitySelector = ({
  productType,
  quantity,
  stock,
  minQuantity,
  selectedReservationOption,
  onQuantityChange,
}: {
  productType: Product['productType'];
  quantity: number;
  stock: number;
  minQuantity: number;
  selectedReservationOption?: string;
  onQuantityChange: (value: number) => void;
}) => {
  const { t } = useLocale();
  if (productType == 'RESERVATION' && !selectedReservationOption) return;
  return (
    <YStack>
      <Label>{t('quantity')}</Label>
      <XStack ml={2} gap={'$2'} ai="center">
        <StyledButton
          disabled={quantity < minQuantity + 1 || quantity < 2}
          pressStyle={{ o: 0.5 }}
          size="$2"
          onPress={() => onQuantityChange(quantity - 1)}
          icon={<AntDesign name="minus" />}
        />
        <SizableText>{quantity}</SizableText>
        <StyledButton
          disabled={quantity >= stock}
          pressStyle={{ o: 0.5 }}
          size="$2"
          onPress={() => onQuantityChange(quantity + 1)}
          icon={<AntDesign name="plus" />}
        />
        {stock < 20 ? (
          <SizableText>
            {t('stock')}: {stock}
          </SizableText>
        ) : null}
      </XStack>
    </YStack>
  );
};

export default QuantitySelector;
