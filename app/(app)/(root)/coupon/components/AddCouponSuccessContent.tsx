import { SizableText, Stack } from 'tamagui';
import { XStack } from 'tamagui';
import { Text } from 'tamagui';
import { useLocale } from '~/hooks';

const AddCouponSuccessContent = () => {
  const { t } = useLocale();
  return (
    <>
      <SizableText fos="$6">{t('addCouponSuccess')}</SizableText>
      <Stack>
        <Text>{t('addCouponSuccessContent')}</Text>
        <XStack>
          <Text>{t('pleaseGoTo')}</Text>
          <Text fow="700">{t('myWallet')}</Text>
          <Text>{t('toCheck')}</Text>
        </XStack>
      </Stack>
    </>
  );
};

export default AddCouponSuccessContent;
