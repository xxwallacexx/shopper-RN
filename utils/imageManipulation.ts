import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { CropImageParams } from '~/types/components';

export const cropSquareImage = async ({
  uri,
  height,
  width,
  originX,
  originY,
}: CropImageParams) => {
  const actionCrop = [
    {
      crop: {
        height,
        width,
        originX,
        originY,
      },
    },
  ];

  return await manipulateAsync(uri, actionCrop, { format: SaveFormat.PNG });
};
