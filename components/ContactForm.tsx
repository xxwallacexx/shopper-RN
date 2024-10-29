import { AntDesign } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import { Input } from 'tamagui';
import { Text } from 'tamagui';
import { XStack } from 'tamagui';
import { Label } from 'tamagui';
import { YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { StyledButton } from '~/tamagui.config';

const ContactForm = ({
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
}: {
  name: string;
  disabled: boolean;
  onNameChange: (value: string) => void;
  isVerified: boolean;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  verifyCode: string;
  seconds: number;
  isVerifyCodeSubmitting: boolean;
  onVerifyCodePress: () => void;
  onGetVerifyCodePress: () => void;
  onVerifyCodeChange: (value: string) => void;
}) => {
  const { t } = useLocale();
  return (
    <YStack space="$2" p="$2">
      <Label>{t('name')}</Label>
      <Input
        value={name}
        autoCapitalize="none"
        autoCorrect={false}
        disabled={disabled}
        onChangeText={onNameChange}
      />
      <XStack space="$2" alignItems="center">
        <Label>{t('contactNumber')}</Label>
        {isVerified ? (
          <XStack space="$1" alignItems="center">
            <AntDesign color={tokens.color.green9Light.val} name="checkcircleo" />
            <Text color="$green9" fontSize={'$2'}>
              {t('verified')}
            </Text>
          </XStack>
        ) : null}
      </XStack>
      <XStack w="100%" alignItems="flex-start" space="$1">
        <Input
          flex={1}
          value={phoneNumber}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          disabled={disabled || isVerified}
          onChangeText={onPhoneNumberChange}
        />
        {isVerified ? null : (
          <StyledButton
            disabled={phoneNumber.length !== 8 || seconds > 0 ? true : false}
            w="35%"
            size="$4"
            onPress={onGetVerifyCodePress}>
            {seconds > 0 ? `${t('verify')} (${seconds}s)` : t('getVerifyCode')}
          </StyledButton>
        )}
      </XStack>

      {isVerified ? null : (
        <>
          <Label>{t('verifyCode')}</Label>
          <XStack w="100%" alignItems="flex-start" space="$1">
            <Input
              flex={1}
              value={verifyCode}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={disabled || isVerified}
              onChangeText={onVerifyCodeChange}
            />
            {isVerified ? null : (
              <StyledButton
                disabled={!verifyCode.length || isVerifyCodeSubmitting}
                w="35%"
                size="$4"
                onPress={onVerifyCodePress}>
                {t('verify')}
              </StyledButton>
            )}
          </XStack>
        </>
      )}
    </YStack>
  );
};

export default ContactForm;
