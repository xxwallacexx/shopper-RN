import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, YStack } from 'tamagui';
import { PhotoItemProps } from './types';

export const PhotoItem: React.FC<PhotoItemProps> = ({ uri, onPress }) => (
  <TouchableOpacity onPress={() => onPress(uri)}>
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
        <Image aspectRatio={1} source={{ uri }} width="100%" objectFit="contain" />
      </YStack>
    </YStack>
  </TouchableOpacity>
); 