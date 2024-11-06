export type Banner = {
  photo: string;
  shop: string;
  detail: string;
  name: string;
  sort: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  _id: string;
  name: string;
  priority: number;
  shop: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
  children: Category[];
  parent?: string;
};

export type Photo = {
  id: string;
  path: string;
};

export type ProductRating = {
  count: number;
  rating: number;
};

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETE = 'COMPLETE',
}
export enum DeliveryMethodEnum {
  SFEXPRESS = 'SFEXPRESS',
  SELF_PICK_UP = 'SELF_PICK_UP',
}

export enum PaymentMethodEnum {
  APPLE_PAY = 'APPLE_PAY',
  CREDIT_CARD = 'CREDIT_CARD',
}

export type Coupon = {
  _id: string;
  credit: number;
  detail: string;
  discount: number;
  endDate: Date;
  name: string;
  shop: Shop;
  photo: string;
  terms: string;
  minPriceRequired: number;
  maxPurchase: number;
};

export type AvailabelCoupon = {
  _id: string;
  coupon: Coupon;
};

export type Shop = {
  address: string;
  deliveryMethods: DeliveryMethodEnum[];
  feedCover: string;
  logo: string;
  name: string;
  stores: string[];
  phoneNumber: string;
  searchCover: string;
  mallDomainName: string;
  couponCover: string;
  terms: string;
};

export type PriceDetail = {
  shippingItemsCount: number;
  reservationItemsCount: number;
  couponsDiscount: number;
  subtotal: number;
  reservationsSubtotal: number;
  freeShippingPrice: number;
  nonfreeShippingFee: number;
  totalPrice: number;
  shippingFee: number;
};

export type ProductPriceDetail = {
  couponDiscount: number;
  subtotal: string;
  freeShippingPrice: number;
  nonfreeShippingFee: number;
};

export type Product = {
  _id: string;
  name: string;
  category: { name: string; status: 'ACTIVE' | 'INACTIVE' };
  shop: Shop;
  cost: number;
  description: string;
  group: string;
  introduction: string;
  isRecommended: boolean;
  logisticDescription: string;
  options: string[];
  photos: Photo[];
  price: number;
  priority: number;
  productRating: ProductRating;
  stock: number;
  productType: 'ORDER' | 'RESERVATION';
  createdAt: Date;
  updatedAt: Date;
};

export type ReservationOption = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  cost: number;
  status: 'ACTIVE' | 'INACTIVE';
};

export type Reservation = {
  _id: string;
  product: Product;
  duration: number;
  time: Date;
  userCountMax: number;
  userCountMin: number;
  options: ReservationOption[];
};

export type ReservationContent = {
  reservation?: string;
  option: string;
  quantity: number;
};

export type Choice = {
  _id: string;
  name: string;
  photo: string;
  productOption: { _id: string; fieldName: string };
  productsubchoices: Choice[];
};

export type Option = {
  _id: string;
  fieldName: string;
  priority: number;
  remark: string;
  choices: Choice[];
};

export type OrderContent = {
  choices: string[];
  quantity: number;
};

export type Stock = {
  _id: string;
  priceAdjustment: number;
  stock: number;
};

export type CartItemOrderContentChoice = {
  _id: string;
  name: string;
  photo: string;
  productOption: string;
  productsubchoices: Choice[];
};

export type CartItemOrderContent = {
  choices: CartItemOrderContentChoice[];
  quantity?: number;
  stock?: Stock;
};

export type CartItemReservationContent = {
  reservation: Reservation;
  option: string;
  quantity: number;
};

export type CartItemReservation = {
  reservation?: Reservation;
  option?: string;
  quantity?: number;
};

export type CartItem = {
  _id: string;
  orderContent: CartItemOrderContent;
  product: Product;
  type: string;
  reservationContent: CartItemReservationContent;
  user: string;
  shop: Shop;
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  name?: string;
  room?: string;
  street?: string;
  district?: string;
  phoneNumber?: string;
};

export type Contact = {
  name: string;
  phoneNumber: string;
  //to-do
  //add other fields
  district?: string;
  street?: string;
  room?: string;
};

export type User = {
  _id: string;
  avatar: string;
  address: Address;
  email: string;
  isTemp: boolean;
  username: string;
};

export type Bookmark = {
  _id: string;
  product: Product;
  shop: Shop;
};

export type Auth = {
  token: string;
  tokenExpAt: string;
};

export type CheckoutProductOption = {
  _id: string;
  fieldName: string;
};

export type CheckoutProductStock = {
  _id: string;
  priceAdjustment: number;
};

export type CheckoutProductChoice = {
  _id: string;
  productOption: CheckoutProductOption;
  name: string;
  productsubchoices: any[];
};

export type CheckoutProduct = {
  _id: string;
  name: string;
  photos: Photo[];
  price: number;
  shop: Shop;
  choices: Choice[];
  productStock: CheckoutProductStock;
};

export type CheckoutCoupon = {
  _id: string;
  coupon: Coupon;
};

export type UserCoupon = {
  _id: string;
  coupon: Coupon;
};

export type Order = {
  _id: string;
  products: {
    product: Product;
    choices: string[];
    quantity: number;
    price: number;
  }[];
  contact: Contact;
  status: OrderStatusEnum;
  reservations: {
    reservation: Reservation;
    option: string;
    quantity: number;
    price: number;
  }[];
  userCoupons: {
    coupon: UserCoupon;
    name: string;
    discount: number;
  }[];
  price: number;
  orderId: string;
  stripeTransactionId: string;
  deliveryMethod: DeliveryMethodEnum;
  pickUpStore: string;
  shop: Shop;
  shippingFee?: number;
  createdAt: Date;
};

export type ProductComment = {
  _id: string;
  rating: number;
  product: string;
  photos: { _id: string; path: string }[];
  comment: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Feed = {
  _id: string;
  view: number;
  likeCount: number;
  commentCount: number;
  title: string;
  detail: string;
  photos: { _id: string; path: string; type: 'IMAGE' | 'VIDEO' }[];
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  shop: Shop;
  createdAt: Date;
  updatedAt: Date;
};
