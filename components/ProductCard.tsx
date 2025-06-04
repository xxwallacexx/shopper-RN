import { Image, SizableText, Text, YStack } from 'tamagui';

import { useLocale } from '~/hooks';
import { Badge } from '~/tamagui.config';
import TestID from '~/utils/testID';

const ProductCard = ({
  imageUri,
  price,
  name,
  categoryName,
  introduction,
  testID,
}: {
  imageUri: string;
  price: number;
  name: string;
  categoryName: string;
  introduction: string;
  testID?: string;
}) => {
  const { t } = useLocale();

  return (
    <YStack
      testID={testID}
      bc="white"
      f={1}
      p="$4"
      br="$radius.3"
      shac="black"
      shof={{
        height: 2,
        width: 0,
      }}
      shop={0.25}
      shar={3.84}>
      <Image
        testID={`${testID}-image`}
        aspectRatio={1}
        source={{ uri: imageUri }}
        objectFit="contain"
        borderRadius={4}
      />
      <Badge pos="absolute" t={22} r={22}>
        <SizableText testID={`${testID}-price`} fos={8} col="#fff">
          $ {price.toFixed(2)} {t('up')}
        </SizableText>
      </Badge>
      <SizableText testID={`${testID}-category`} size="$1" col="lightslategray">
        {categoryName}
      </SizableText>
      <Text testID={`${testID}-name`} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      <Text testID={`${testID}-description`} numberOfLines={1} ellipsizeMode="tail">
        {introduction}
      </Text>
    </YStack>
  );
};

export default ProductCard;
