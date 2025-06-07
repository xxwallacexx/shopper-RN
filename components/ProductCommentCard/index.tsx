import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { TextArea, XStack, YStack } from 'tamagui';

import { UserInfo } from './UserInfo';
import { PhotoGallery } from './PhotoGallery';
import { ProductCommentCardProps } from '~/types/components';

const ProductCommentCard: React.FC<ProductCommentCardProps> = ({
  username,
  userAvatar,
  isSelf = false,
  rating,
  photos,
  comment,
  createdAt,
  onPhotoPress,
  onActionPress,
}) => {
  return (
    <YStack p="$1" gap="$2" bg="white" br="$radius.3">
      <XStack jc="space-between">
        <UserInfo
          username={username}
          userAvatar={userAvatar}
          createdAt={createdAt}
          rating={rating}
        />
        {isSelf && (
          <TouchableOpacity onPress={onActionPress}>
            <MaterialIcons name="more-horiz" size={18} />
          </TouchableOpacity>
        )}
      </XStack>

      <PhotoGallery photos={photos} onPhotoPress={onPhotoPress} />

      <YStack f={1} gap="$2">
        <TextArea disabled value={comment} />
      </YStack>
    </YStack>
  );
};

export default ProductCommentCard;
