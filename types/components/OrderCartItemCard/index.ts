import { AvailabelCoupon, CartItemOrderContent, Product } from '~/types';

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

export interface ProductImageProps {
  photoUri: string;
  singleItemPrice: number;
  testID?: string;
}

export interface QuantityControlsProps {
  quantity: number;
  stock: number;
  isCartItemUpdating: boolean;
  onDeductPress: () => void;
  onAddPress: () => void;
  testID?: string;
}

export interface ProductDetailsProps {
  product: Product;
  orderContent: CartItemOrderContent;
  totalPrice: number;
  stock: number;
  isCartItemUpdating: boolean;
  testID?: string;
}

export interface ActionBarProps {
  quantity: number;
  stock: number;
  coupon?: AvailabelCoupon;
  isCartItemUpdating: boolean;
  isCartItemRemoving: boolean;
  onDeductPress: () => void;
  onAddPress: () => void;
  onAvailableCouponPress: () => void;
  onRemovePress: () => void;
  testID?: string;
}
