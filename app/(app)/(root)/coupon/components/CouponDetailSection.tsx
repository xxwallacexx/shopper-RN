import { Text } from 'tamagui';
import { YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';

const CouponDetailSection = ({
  minPriceRequired,
  maxPurchase,
  discount,
}: {
  minPriceRequired: number;
  maxPurchase: number;
  discount: number;
}) => {
  const { t } = useLocale();
  return (
    <Container gap="$2">
      <YStack gap="$4">
        <Title>{t('userCouponDetail')}</Title>
        <Text>{t('minPriceRequired', { minPriceRequired })}</Text>
        <Text>{t('maxPurchase', { maxPurchase })}</Text>
        <Text>{t('discount', { discount })}</Text>
      </YStack>
    </Container>
  );
};

export default CouponDetailSection;
