import { XStack, Stack, Image, YStack, SizableText } from 'tamagui';

import { Title } from '~/tamagui.config';

const StoreCard = ({ logo, name, address }: { logo: string; name: string; address: string }) => {
  return (
    <XStack gap="$4">
      <Stack w="$size.6">
        <Image bc="white" objectFit="contain" aspectRatio={1} source={{ uri: logo }} w="100%" />
      </Stack>
      <YStack gap="$1" f={1}>
        <Title>{name}</Title>
        <SizableText col="slategray" textOverflow="ellipsis" numberOfLines={1} ellipsizeMode="tail">
          {address}
        </SizableText>
      </YStack>
    </XStack>
  );
};

export default StoreCard;
