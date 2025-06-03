import { Image, SizableText, Text, YStack } from 'tamagui';
import { useLocale } from '~/hooks';
import { Badge } from '~/tamagui.config';

const ProductCard = ({
  imageUri,
  price,
  name,
  categoryName,
  introduction,
}: {
  imageUri: string;
  price: number;
  name: string;
  categoryName: string;
  introduction: string;
}) => {
  const { t } = useLocale();

  return (
    <YStack
      bc={'white'}
      f={1}
      p="$4"
      br={'$radius.3'}
      shac={'black'}
      shof={{
        height: 2,
        width: 0,
      }}
      shop={0.25}
      shar={3.84}>
      <Image aspectRatio={1} source={{ uri: imageUri }} objectFit="contain" borderRadius={4} />
      <Badge pos="absolute" t={22} r={22}>
        <SizableText fos={8} col="#fff">
          $ {price.toFixed(2)} {t('up')}
        </SizableText>
      </Badge>
      <SizableText size={'$1'} col="lightslategray">
        {categoryName}
      </SizableText>
      <Text numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      <Text numberOfLines={1} ellipsizeMode="tail">
        {introduction}
      </Text>
    </YStack>
  );
};

export default ProductCard;
