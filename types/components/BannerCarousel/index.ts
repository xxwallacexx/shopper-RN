import { SharedValue } from 'react-native-reanimated';

export type ContentType = 'IMAGE' | 'VIDEO';

export interface Banner {
  type: ContentType;
  uri: string;
}

export interface ContentProps {
  type: ContentType;
  uri: string;
}

export interface ItemProps {
  content: Banner;
  animationValue: SharedValue<number>;
}

export interface BannerCarouselProps {
  banners: Banner[];
}

export interface CarouselPaginationProps {
  totalSlides: number;
  activeIndex: number;
}
