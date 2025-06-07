import { YStackProps } from 'tamagui';

export interface ImageGalleryProps {
  photos: string[];
}

export interface GalleryItemProps extends YStackProps {
  going?: number;
  children: React.ReactNode;
}

export interface NavigationButtonProps {
  direction: 'left' | 'right';
  onPress: () => void;
}

export interface GalleryContentProps {
  imageUri: string;
  going: number;
  page: number;
}
