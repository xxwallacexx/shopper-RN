import { SizableText, Spinner, Stack, XStack, YStack } from 'tamagui';
import { useLocale } from '~/hooks/useLocale';

const Loader = ({ text }: { text?: string }) => {
  const { t } = useLocale();

  return (
    <YStack alignItems="center">
      <Stack w={'$12'}></Stack>
      <XStack justifyContent="center" w="100%" space={'$2'}>
        <Spinner />
        <SizableText>{text ? text : t('loading')}</SizableText>
      </XStack>
    </YStack>
  );
};

export default Loader;
