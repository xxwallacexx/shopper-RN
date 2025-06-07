import { Image } from 'tamagui';
import { BannerContent as BannerContentType } from '~/types/components';
import Video from '../Video';

export const BannerContent = ({ type, uri }: BannerContentType) => {
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
