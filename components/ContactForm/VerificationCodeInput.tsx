import React from 'react';
import { Input, XStack, Label } from 'tamagui';

import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';
import { VerificationCodeInputProps } from '~/types/components/ContactForm';

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  isVerified,
  verifyCode,
  disabled,
  onVerifyCodeChange,
  isVerifyCodeSubmitting,
  onVerifyCodePress,
}) => {
  const { t } = useLocale();

  if (isVerified) return null;

  return (
    <>
      <Label>{t('verifyCode')}</Label>
      <XStack w="100%" ai="flex-start" gap="$1">
        <Input
          f={1}
          value={verifyCode}
          autoCapitalize="none"
          autoCorrect={false}
          disabled={disabled || isVerified}
          onChangeText={onVerifyCodeChange}
        />
        <StyledButton
          disabled={!verifyCode.length || isVerifyCodeSubmitting}
          w="35%"
          size="$4"
          onPress={onVerifyCodePress}>
          {t('verify')}
        </StyledButton>
      </XStack>
    </>
  );
};
