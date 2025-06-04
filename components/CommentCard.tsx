import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { FlatList, TouchableOpacity } from 'react-native';
import { Image, SizableText, Stack, XStack, YStack } from 'tamagui';

const CommentCard = ({
  isSelf,
  username,
  avatar,
  photos,
  comment,
  onPhotoPress,
  onActionPress,
  createdAt,
}: {
  isSelf: boolean;
  username: string;
  avatar: string;
  photos: string[];
  comment: string;
  onPhotoPress: (uri: string) => void;
  onActionPress: () => void;
  createdAt: Date;
}) => {
  return (
    <XStack p="$2" gap="$1">
      <Stack w="$5" aspectRatio={1}>
        <Image f={1} source={{ uri: avatar }} objectFit="contain" />
      </Stack>
      <YStack p="$2" f={1} br="$radius.3" bg="whitesmoke">
        <XStack jc="space-between">
          <SizableText fos="$7" fow="bold">
            {username}
          </SizableText>
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
                    <Image
                      aspectRatio={1}
                      source={{ uri: item }}
                      width="100%"
                      objectFit="contain"
                    />
                  </YStack>
                </YStack>
              </TouchableOpacity>
            );
          }}
        />

        <SizableText>{comment}</SizableText>
        <SizableText fos="$2">{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</SizableText>
      </YStack>
    </XStack>
  );
};

export default CommentCard;
