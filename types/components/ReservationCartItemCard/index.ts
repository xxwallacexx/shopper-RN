import { AvailabelCoupon, CartItemReservation, Product } from '~/types';

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
