import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { FlatList, TouchableOpacity } from 'react-native';
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
    <YStack p="$1" gap="$2" bg="white" br="$radius.3">
      <XStack jc="space-between">
        <XStack gap="$2">
          <YStack gap="$2" jc="center" ai="center">
            <Stack w="$6" h="$6">
              <Image aspectRatio={1} source={{ uri: userAvatar }} w="100%" objectFit="contain" />
            </Stack>
            <SizableText>{username}</SizableText>
          </YStack>
          <YStack gap="$2">
            <SizableText size="$2">{moment(createdAt).format('YYYY-MM-DD')}</SizableText>
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
        horizontal
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => onPhotoPress(item)}>
              <YStack
                bc="white"
                w="$14"
                h="$14"
                br="$radius.3"
                shac="black"
                shof={{
                  height: 2,
                  width: 0,
                }}
                shop={0.25}
                shar={3.84}
                jc="center"
                ai="center">
                <YStack f={1} br="$radius.3" ov="hidden">
                  <Image aspectRatio={1} source={{ uri: item }} width="100%" objectFit="contain" />
                </YStack>
              </YStack>
            </TouchableOpacity>
          );
        }}
      />
      <YStack f={1} gap="$2">
        <TextArea disabled value={comment} />
      </YStack>
    </YStack>
  );
};

export default ProductCommentCard;
