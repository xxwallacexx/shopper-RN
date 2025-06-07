import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { tokens } from '@tamagui/themes';
import { Text, XStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { VerificationStatusProps } from '~/types/components/ContactForm';

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ isVerified }) => {
  const { t } = useLocale();
  if (!isVerified) return null;
  
  return (
    <XStack gap="$1" ai="center">
      <AntDesign color={tokens.color.green9Light.val} name="checkcircleo" />
      <Text col="$green9" fos="$2">
        {t('verified')}
      </Text>
    </XStack>
  );
}; 