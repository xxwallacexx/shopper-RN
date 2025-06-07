import { Image, Stack, SizableText } from 'tamagui';
import { Badge } from '~/tamagui.config';

interface ProductImageProps {
  photoUri: string;
  singleItemPrice: number;
  testID?: string;
}

export const ProductImage = ({ photoUri, singleItemPrice, testID }: ProductImageProps) => {
  return (
    <Stack f={1}>
      <Image
        testID={`${testID}-image`}
        bc="white"
        objectFit="contain"
        aspectRatio={1}
        source={{ uri: photoUri }}
        w="100%"
      />
      <Badge pos="absolute" t={8} r={8}>
        <SizableText testID={`${testID}-price`} size="$1" col="#fff">
          HK$ {singleItemPrice.toFixed(2)}
        </SizableText>
      </Badge>
    </Stack>
  );
};
