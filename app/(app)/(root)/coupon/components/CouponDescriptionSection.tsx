import HTMLView from 'react-native-htmlview';
import { YStack } from 'tamagui';
import { Separator } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';

const CouponDescriptionSection = ({ detail }: { detail: string }) => {
  const { t } = useLocale();
  return (
    <Container gap="$2">
      <Separator boc="lightslategray" />
      <YStack gap="$4">
        <Title>{t('couponIntro')}</Title>
        <HTMLView value={detail} />
      </YStack>
    </Container>
  );
};

export default CouponDescriptionSection;
