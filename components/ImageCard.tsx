import { TouchableOpacity } from 'react-native-gesture-handler';
import { YStack, Image } from 'tamagui';

const ImageCard = ({ imageUri, onPhotoPress }: { imageUri: string; onPhotoPress: () => void }) => {
  return (
    <YStack>
      <TouchableOpacity onPress={() => onPhotoPress()}>
        <YStack
          backgroundColor={'white'}
          w="$14"
          h="$14"
          borderRadius={'$radius.3'}
          shadowColor={'black'}
          shadowOffset={{
            height: 2,
            width: 0,
          }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          justifyContent="center"
          alignItems="center">
          <YStack flex={1} borderRadius={'$radius.3'} overflow="hidden">
            <Image aspectRatio={1} source={{ uri: imageUri }} width={'100%'} resizeMode="contain" />
          </YStack>
        </YStack>
      </TouchableOpacity>
    </YStack>
  );
};

export default ImageCard;
