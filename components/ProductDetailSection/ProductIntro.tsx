import HTMLView from 'react-native-htmlview';
import { YStack, Separator } from 'tamagui';
import { useLocale } from '~/hooks';
import { Container, Title } from '~/tamagui.config';

const ProductIntro = ({
  description,
  logisticDescription,
}: {
  description: string;
  logisticDescription: string;
}) => {
  const { t } = useLocale();
  return (
    <Container w="100%" gap="$2">
      <Separator boc="lightslategray" />
      <YStack gap="$4">
        <Title>{t('productDetail')}</Title>
        <HTMLView value={description} />
        <Title>{t('TnC')}</Title>
        <HTMLView value={logisticDescription} />
      </YStack>
    </Container>
  );
};

export default ProductIntro;
