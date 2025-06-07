import React from 'react';
import { Image } from 'tamagui';
import Video from '../Video';
import { ContentProps } from '~/types/components/BannerCarousel';

export const Content: React.FC<ContentProps> = ({ type, uri }) => {
  switch (type) {
    case 'VIDEO':
      return <Video uri={uri} />;
    case 'IMAGE':
      return (
        <Image
          source={{ uri }}
          width="100%"
          height="100%"
          aspectRatio={1.778}
          objectFit="contain"
          bc="lightgrey"
        />
      );
    default:
      return <></>;
  }
}; 