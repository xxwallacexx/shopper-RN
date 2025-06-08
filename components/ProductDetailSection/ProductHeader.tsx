import { AntDesign } from '@expo/vector-icons';
import { SizableText, XStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { StyledButton, Subtitle } from '~/tamagui.config';

const ProductHeader = ({
  category,
  name,
  introduction,
  onSharePress,
}: {
  category: string;
  name: string;
  introduction: string;
  onSharePress: () => void;
}) => {
  const { t } = useLocale();
  return (
    <>
      <XStack jc="space-between">
        <Subtitle size="$4">{category}</Subtitle>
        <StyledButton onPress={onSharePress}>
          {t('shareProduct')}
          <AntDesign name="link" color="#fff" />
        </StyledButton>
      </XStack>
      <SizableText>{name}</SizableText>
      <SizableText numberOfLines={1} ellipsizeMode="tail">
        {introduction}
      </SizableText>
    </>
  );
};

export default ProductHeader;
