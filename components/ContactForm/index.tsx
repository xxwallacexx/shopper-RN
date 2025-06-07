import React from 'react';
import { Input, XStack, Label, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { ContactFormProps } from '~/types/components/ContactForm';
import { VerificationStatus } from './VerificationStatus';
import { PhoneNumberInput } from './PhoneNumberInput';
import { VerificationCodeInput } from './VerificationCodeInput';

const ContactForm: React.FC<ContactFormProps> = (props) => {
  const {
    name,
    disabled,
    onNameChange,
    isVerified,
    phoneNumber,
    onPhoneNumberChange,
    verifyCode,
    seconds,
    isVerifyCodeSubmitting,
    onVerifyCodePress,
    onGetVerifyCodePress,
    onVerifyCodeChange,
  } = props;

  const { t } = useLocale();

  return (
    <YStack gap="$2" p="$2">
      <Label>{t('name')}</Label>
      <Input
        value={name}
        autoCapitalize="none"
        autoCorrect={false}
        disabled={disabled}
        onChangeText={onNameChange}
      />

      <XStack gap="$2" ai="center">
        <Label>{t('contactNumber')}</Label>
        <VerificationStatus isVerified={isVerified} />
      </XStack>

      <PhoneNumberInput
        phoneNumber={phoneNumber}
        disabled={disabled}
        isVerified={isVerified}
        onPhoneNumberChange={onPhoneNumberChange}
        seconds={seconds}
        onGetVerifyCodePress={onGetVerifyCodePress}
      />

      <VerificationCodeInput
        isVerified={isVerified}
        verifyCode={verifyCode}
        disabled={disabled}
        onVerifyCodeChange={onVerifyCodeChange}
        isVerifyCodeSubmitting={isVerifyCodeSubmitting}
        onVerifyCodePress={onVerifyCodePress}
      />
    </YStack>
  );
};

export default ContactForm;
