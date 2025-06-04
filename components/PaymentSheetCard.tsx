import { CardField, PlatformPay, PlatformPayButton } from '@stripe/stripe-react-native';
import { Details } from '@stripe/stripe-react-native/lib/typescript/src/types/components/CardFieldInput';
import { Platform } from 'react-native';
import { Separator, SizableText, Spinner, XStack, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const PaymentSheetCard = ({
  isLoading,
  isPlatformPayAvailable,
  cardPaymentDisabled,
  onCardCompleted,
  onCardPaymentPress,
  onPlatformPayPress,
}: {
  isLoading: boolean;
  isPlatformPayAvailable: boolean;
  cardPaymentDisabled: boolean;
  onCardCompleted: (value: boolean) => void;
  onCardPaymentPress: () => void;
  onPlatformPayPress: () => void;
}) => {
  const { t } = useLocale();
  const onCardChange = (card: Details) => {
    onCardCompleted(card.complete);
  };

  return (
    <YStack gap="$4">
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#fff',
          textColor: '#000',
        }}
        style={{
          width: '100%',
          height: 50,
        }}
        onCardChange={onCardChange}
      />
      <StyledButton onPress={onCardPaymentPress} disabled={cardPaymentDisabled}>
        <XStack gap="$2">
          {isLoading ? <Spinner size="small" /> : null}
          <SizableText col="white">{t('confirm')}</SizableText>
        </XStack>
      </StyledButton>

      <Separator />

      {isPlatformPayAvailable && Platform.OS == 'ios' ? (
        <PlatformPayButton
          disabled={isLoading}
          onPress={onPlatformPayPress}
          type={PlatformPay.ButtonType.Order}
          appearance={PlatformPay.ButtonStyle.Black}
          borderRadius={4}
          style={{
            width: '100%',
            height: 50,
          }}
        />
      ) : null}
    </YStack>
  );
};
export default PaymentSheetCard;
