import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Image, SizableText, Stack, TextArea, XStack, YStack } from 'tamagui';

const ProductCommentCard = ({
  username,
  userAvatar,
  isSelf = false,
  rating,
  photos,
  comment,
  createdAt,
  onPhotoPress,
  onActionPress,
}: {
  username: string;
  userAvatar: string;
  isSelf: boolean;
  rating: number;
  photos: string[];
  comment: string;
  createdAt: Date;
  onPhotoPress: (uri: string) => void;
  onActionPress: () => void;
}) => {
  return (
    <YStack p="$1" space="$2" bg="white" borderRadius={'$radius.3'}>
      <XStack justifyContent="space-between">
        <XStack space="$2">
          <YStack space="$2" justifyContent="center" alignItems="center">
            <Stack w="$6" h="$6">
              <Image
                aspectRatio={1}
                source={{ uri: userAvatar }}
                width={'100%'}
                resizeMode="contain"
              />
            </Stack>
            <SizableText>{username}</SizableText>
          </YStack>
          <YStack space="$2">
            <SizableText size={'$2'}>{moment(createdAt).format('YYYY-MM-DD')}</SizableText>
            <StarRatingDisplay starSize={24} rating={rating} />
          </YStack>
        </XStack>
        {isSelf ? (
          <TouchableOpacity onPress={onActionPress}>
            <MaterialIcons name="more-horiz" size={18} />
          </TouchableOpacity>
        ) : null}
      </XStack>
      <FlatList
        data={photos}
        horizontal={true}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => onPhotoPress(item)}>
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
                  <Image
                    aspectRatio={1}
                    source={{ uri: item }}
                    width={'100%'}
                    resizeMode="contain"
                  />
                </YStack>
              </YStack>
            </TouchableOpacity>
          );
        }}
      />
      <YStack flex={1} space="$2">
        <TextArea disabled value={comment} />
      </YStack>
    </YStack>
  );
};

export default ProductCommentCard;
