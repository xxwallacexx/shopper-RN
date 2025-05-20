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
      backgroundColor={'white'}
      flex={1}
      p="$4"
      borderRadius={'$radius.3'}
      shadowColor={'black'}
      shadowOffset={{
        height: 2,
        width: 0,
      }}
      shadowOpacity={0.25}
      shadowRadius={3.84}>
      <Image aspectRatio={1} source={{ uri: imageUri }} resizeMode="contain" borderRadius={4} />
      <Badge position="absolute" top={22} right={22}>
        <SizableText fontSize={8} color="#fff">
          $ {price.toFixed(2)} {t('up')}
        </SizableText>
      </Badge>
      <SizableText size={'$1'} color="lightslategray">
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
