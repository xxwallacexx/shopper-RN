import { TouchableOpacity } from 'react-native';
import { YStack, Image } from 'tamagui';

const ImageCard = ({ imageUri, onPhotoPress }: { imageUri: string; onPhotoPress: () => void }) => {
  return (
    <YStack>
      <TouchableOpacity onPress={() => onPhotoPress()}>
        <YStack
          bc={'white'}
          w="$14"
          h="$14"
          br={'$radius.3'}
          shac={'black'}
          shof={{
            height: 2,
            width: 0,
          }}
          shop={0.25}
          shar={3.84}
          jc="center"
          ai="center">
          <YStack f={1} br={'$radius.3'} ov="hidden">
            <Image aspectRatio={1} source={{ uri: imageUri }} w={'100%'} objectFit="contain" />
          </YStack>
        </YStack>
      </TouchableOpacity>
    </YStack>
  );
};

export default ImageCard;
