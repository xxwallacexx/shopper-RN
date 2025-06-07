import { AvailabelCoupon, CartItemOrderContent, CartItemReservation, Product, Reservation } from './index';
import { StackProps, TabLayout } from 'tamagui';
import { SharedValue } from 'react-native-reanimated';

export interface OrderCartItemCardProps {
  photoUri: string;
  totalPrice: number;
  stock: number;
  coupon?: AvailabelCoupon;
  singleItemPrice: number;
  product: Product;
  orderContent: CartItemOrderContent;
  onProductPress: () => void;
  onDeductPress: () => void;
  onAddPress: () => void;
  onRemovePress: () => void;
  onAvailableCouponPress: () => void;
  isCartItemUpdating: boolean;
  isCartItemRemoving: boolean;
  testID?: string;
}

export interface CameraProps {
  onBack: () => void;
  onPhotoChange: (uri: string) => void;
}

export interface CropImageParams {
  uri: string;
  height: number;
  width: number;
  originX: number;
  originY: number;
}

export interface ReservationCalendarProps {
  isLoading: boolean;
  reservations: Reservation[];
  selectedDate?: string;
  onDayChange: (value?: string) => void;
}

export interface ReservationCartItemCardProps {
  photoUri: string;
  totalPrice: number;
  stock: number;
  coupon?: AvailabelCoupon;
  singleItemPrice: number;
  product: Product;
  reservationContent: CartItemReservation;
  onProductPress: () => void;
  onRemovePress: () => void;
  onAvailableCouponPress: () => void;
  isCartItemUpdating: boolean;
  isCartItemRemoving: boolean;
}

export interface TabsRovingIndicatorProps extends StackProps {
  active?: boolean;
}

export interface TabState {
  currentTab: string;
  intentAt: TabLayout | null;
  activeAt: TabLayout | null;
  prevActiveAt: TabLayout | null;
}

export interface AnimatedTabsProps {
  tabs: Array<{
    label: string;
    value: string;
  }>;
  initialTab: string;
  onTabChanged: (value: string) => void;
}

export type BannerContentType = 'IMAGE' | 'VIDEO';

export interface BannerContent {
  type: BannerContentType;
  uri: string;
}

export interface BannerItemProps {
  content: BannerContent;
  animationValue: SharedValue<number>;
}

export interface BannerCarouselProps {
  banners: BannerContent[];
} 