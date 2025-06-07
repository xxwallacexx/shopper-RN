import React from 'react';
import { Input, XStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { PhoneNumberInputProps } from '~/types/components/ContactForm';

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  disabled,
  isVerified,
  onPhoneNumberChange,
  seconds,
  onGetVerifyCodePress,
}) => {
  const { t } = useLocale();
  
  return (
    <XStack w="100%" ai="flex-start" gap="$1">
      <Input
        f={1}
        value={phoneNumber}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        disabled={disabled || isVerified}
        onChangeText={onPhoneNumberChange}
      />
      {!isVerified && (
        <StyledButton
          disabled={phoneNumber.length !== 8 || seconds > 0}
          w="35%"
          size="$4"
          onPress={onGetVerifyCodePress}
        >
          {seconds > 0 ? `${t('verify')} (${seconds}s)` : t('getVerifyCode')}
        </StyledButton>
      )}
    </XStack>
  );
}; 