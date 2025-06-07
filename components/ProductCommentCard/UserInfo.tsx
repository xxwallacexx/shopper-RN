import React from 'react';
import moment from 'moment';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Image, SizableText, Stack, XStack, YStack } from 'tamagui';
import { ProductCommentCardProps } from './types';

type UserInfoProps = Pick<ProductCommentCardProps, 'username' | 'userAvatar' | 'createdAt' | 'rating'>;

export const UserInfo: React.FC<UserInfoProps> = ({
  username,
  userAvatar,
  createdAt,
  rating,
}) => (
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
); 