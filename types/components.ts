import { AvailabelCoupon, CartItemOrderContent, CartItemReservation, Product, Reservation } from './index';

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