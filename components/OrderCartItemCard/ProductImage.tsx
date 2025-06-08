import React from 'react';
import { Image, Stack, SizableText } from 'tamagui';
import { Badge } from '~/tamagui.config';
import { ProductImageProps } from '~/types/components/OrderCartItemCard';

export const ProductImage: React.FC<ProductImageProps> = ({
  photoUri,
  singleItemPrice,
  testID,
}) => {
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
