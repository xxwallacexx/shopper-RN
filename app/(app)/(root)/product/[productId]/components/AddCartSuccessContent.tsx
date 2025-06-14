import { SizableText, Stack } from 'tamagui';
import { XStack } from 'tamagui';
import { Text } from 'tamagui';
import { useLocale } from '~/hooks';

const AddCartSuccessContent = () => {
  const { t } = useLocale();
  return (
    <>
      <SizableText fos="$6">{t('addSuccess')}</SizableText>
      <Stack>
        <Text>{t('addSuccessContent')}</Text>
        <XStack>
          <Text>{t('pleaseGoTo')}</Text>
          <Text fow="700">{t('shoppingCart')}</Text>
          <Text>{t('toCheck')}</Text>
        </XStack>
      </Stack>
    </>
  );
};

export default AddCartSuccessContent;
